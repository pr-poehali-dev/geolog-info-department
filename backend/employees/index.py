import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def _cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def _serialize(row):
    return {
        'id': str(row['id']),
        'fullName': row['full_name'],
        'position': row['position'],
        'status': row['status'],
        'email': row['email'] or '',
        'phone': row['phone'] or '',
        'birthDate': row['birth_date'].isoformat() if row['birth_date'] else '',
        'hiredAt': row['hired_at'].isoformat() if row['hired_at'] else '',
        'location': row['location'] or '',
        'about': row['about'] or '',
        'avatarColor': row['avatar_color'],
        'stats': {
            'tasksDone': row['tasks_done'],
            'tasksInProgress': row['tasks_in_progress'],
            'reports': row['reports'],
            'efficiency': row['efficiency'],
        },
    }


def handler(event: dict, context) -> dict:
    '''Управление сотрудниками отдела: список, добавление, редактирование, удаление'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors_headers(), 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True

    try:
        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT * FROM employees ORDER BY id ASC')
                rows = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': _cors_headers(),
                'body': json.dumps([_serialize(r) for r in rows]),
            }

        body = json.loads(event.get('body') or '{}')

        if method == 'POST':
            stats = body.get('stats', {})
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    '''INSERT INTO employees
                    (full_name, position, status, email, phone, birth_date, hired_at,
                     location, about, avatar_color, tasks_done, tasks_in_progress, reports, efficiency)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *''',
                    (
                        body.get('fullName', ''),
                        body.get('position', 'Специалист'),
                        body.get('status', 'active'),
                        body.get('email', ''),
                        body.get('phone', ''),
                        body.get('birthDate') or None,
                        body.get('hiredAt') or None,
                        body.get('location', ''),
                        body.get('about', ''),
                        body.get('avatarColor', 'from-emerald-500 to-teal-700'),
                        stats.get('tasksDone', 0),
                        stats.get('tasksInProgress', 0),
                        stats.get('reports', 0),
                        stats.get('efficiency', 0),
                    ),
                )
                row = cur.fetchone()
            return {
                'statusCode': 201,
                'headers': _cors_headers(),
                'body': json.dumps(_serialize(row)),
            }

        if method == 'PUT':
            emp_id = body.get('id')
            stats = body.get('stats', {})
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    '''UPDATE employees SET
                    full_name=%s, position=%s, status=%s, email=%s, phone=%s,
                    birth_date=%s, hired_at=%s, location=%s, about=%s, avatar_color=%s,
                    tasks_done=%s, tasks_in_progress=%s, reports=%s, efficiency=%s
                    WHERE id=%s RETURNING *''',
                    (
                        body.get('fullName', ''),
                        body.get('position', 'Специалист'),
                        body.get('status', 'active'),
                        body.get('email', ''),
                        body.get('phone', ''),
                        body.get('birthDate') or None,
                        body.get('hiredAt') or None,
                        body.get('location', ''),
                        body.get('about', ''),
                        body.get('avatarColor', 'from-emerald-500 to-teal-700'),
                        stats.get('tasksDone', 0),
                        stats.get('tasksInProgress', 0),
                        stats.get('reports', 0),
                        stats.get('efficiency', 0),
                        emp_id,
                    ),
                )
                row = cur.fetchone()
            if not row:
                return {'statusCode': 404, 'headers': _cors_headers(), 'body': json.dumps({'error': 'not found'})}
            return {
                'statusCode': 200,
                'headers': _cors_headers(),
                'body': json.dumps(_serialize(row)),
            }

        if method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            emp_id = params.get('id') or body.get('id')
            with conn.cursor() as cur:
                cur.execute('DELETE FROM employees WHERE id=%s', (emp_id,))
            return {
                'statusCode': 200,
                'headers': _cors_headers(),
                'body': json.dumps({'success': True}),
            }

        return {'statusCode': 405, 'headers': _cors_headers(), 'body': json.dumps({'error': 'method not allowed'})}
    finally:
        conn.close()
