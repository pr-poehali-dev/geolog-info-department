import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

# Ранг должности: чем больше число — тем выше в иерархии
POSITION_RANK = {
    'Начальник отдела': 4,
    'Заместитель начальника отдела': 3,
    'Главный специалист': 2,
    'Ведущий специалист': 1,
    'Специалист': 0,
}


def _cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id, X-Login',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def _serialize(row):
    return {
        'id': str(row['id']),
        'title': row['title'],
        'description': row['description'] or '',
        'assigneeId': str(row['assignee_id']),
        'assigneeName': row.get('assignee_name') or '',
        'creatorId': str(row['creator_id']) if row['creator_id'] else '',
        'creatorName': row.get('creator_name') or '',
        'priority': row['priority'],
        'status': row['status'],
        'dueDate': row['due_date'].isoformat() if row['due_date'] else '',
        'createdAt': row['created_at'].isoformat() if row['created_at'] else '',
    }


def _get_actor(cur, login):
    if not login:
        return None
    cur.execute('SELECT id, position FROM employees WHERE login = %s', (login,))
    return cur.fetchone()


def _can_assign(actor_position, assignee_position):
    '''Правила назначения исполнителя по иерархии:
    - Начальник отдела: любой сотрудник;
    - Заместитель начальника: любой, кроме начальника отдела;
    - Главный специалист: любой, кроме начальника и заместителя;
    - Ведущий специалист/специалист: любой, кто ниже главного специалиста.'''
    actor_rank = POSITION_RANK.get(actor_position, 0)
    assignee_rank = POSITION_RANK.get(assignee_position, 0)
    if actor_rank >= POSITION_RANK['Начальник отдела']:
        return True
    return assignee_rank <= actor_rank


def handler(event: dict, context) -> dict:
    '''Управление задачами отдела: список, создание, изменение статуса, удаление. Выбор исполнителя ограничен иерархией должностей.'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors_headers(), 'body': ''}

    headers = event.get('headers') or {}
    actor_login = headers.get('X-Login') or headers.get('x-login') or ''

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True

    try:
        params = event.get('queryStringParameters') or {}

        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('''
                    SELECT t.*, a.full_name AS assignee_name, c.full_name AS creator_name
                    FROM tasks t
                    JOIN employees a ON a.id = t.assignee_id
                    LEFT JOIN employees c ON c.id = t.creator_id
                    ORDER BY t.created_at DESC, t.id DESC
                ''')
                rows = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': _cors_headers(),
                'body': json.dumps([_serialize(r) for r in rows]),
            }

        body = json.loads(event.get('body') or '{}')

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            actor = _get_actor(cur, actor_login)
        if not actor:
            return {'statusCode': 401, 'headers': _cors_headers(), 'body': json.dumps({'error': 'Требуется авторизация'})}

        if method == 'POST':
            assignee_id = body.get('assigneeId')
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT position FROM employees WHERE id = %s', (assignee_id,))
                assignee = cur.fetchone()
                if not assignee:
                    return {'statusCode': 404, 'headers': _cors_headers(), 'body': json.dumps({'error': 'Исполнитель не найден'})}
                if not _can_assign(actor['position'], assignee['position']):
                    return {'statusCode': 403, 'headers': _cors_headers(), 'body': json.dumps({'error': 'Нельзя назначить этого сотрудника исполнителем по правилам иерархии'})}
                cur.execute('''
                    INSERT INTO tasks (title, description, assignee_id, creator_id, priority, status, due_date)
                    VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING *
                ''', (
                    body.get('title', ''),
                    body.get('description', ''),
                    assignee_id,
                    actor['id'],
                    body.get('priority', 'medium'),
                    body.get('status', 'new'),
                    body.get('dueDate') or None,
                ))
                new_row = cur.fetchone()
                cur.execute('''
                    SELECT t.*, a.full_name AS assignee_name, c.full_name AS creator_name
                    FROM tasks t JOIN employees a ON a.id = t.assignee_id
                    LEFT JOIN employees c ON c.id = t.creator_id WHERE t.id = %s
                ''', (new_row['id'],))
                row = cur.fetchone()
            return {'statusCode': 201, 'headers': _cors_headers(), 'body': json.dumps(_serialize(row))}

        if method == 'PUT':
            task_id = body.get('id')
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('''
                    UPDATE tasks SET
                    title = COALESCE(%s, title),
                    description = COALESCE(%s, description),
                    priority = COALESCE(%s, priority),
                    status = COALESCE(%s, status),
                    due_date = %s
                    WHERE id = %s RETURNING id
                ''', (
                    body.get('title'),
                    body.get('description'),
                    body.get('priority'),
                    body.get('status'),
                    body.get('dueDate') or None,
                    task_id,
                ))
                updated = cur.fetchone()
                if not updated:
                    return {'statusCode': 404, 'headers': _cors_headers(), 'body': json.dumps({'error': 'not found'})}
                cur.execute('''
                    SELECT t.*, a.full_name AS assignee_name, c.full_name AS creator_name
                    FROM tasks t JOIN employees a ON a.id = t.assignee_id
                    LEFT JOIN employees c ON c.id = t.creator_id WHERE t.id = %s
                ''', (task_id,))
                row = cur.fetchone()
            return {'statusCode': 200, 'headers': _cors_headers(), 'body': json.dumps(_serialize(row))}

        if method == 'DELETE':
            task_id = params.get('id') or body.get('id')
            with conn.cursor() as cur:
                cur.execute('DELETE FROM tasks WHERE id = %s', (task_id,))
            return {'statusCode': 200, 'headers': _cors_headers(), 'body': json.dumps({'success': True})}

        return {'statusCode': 405, 'headers': _cors_headers(), 'body': json.dumps({'error': 'method not allowed'})}
    finally:
        conn.close()