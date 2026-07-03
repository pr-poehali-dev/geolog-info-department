import json
import os
import hashlib
import psycopg2
from psycopg2.extras import RealDictCursor, Json

PASSWORD_SALT = 'geomonitor_2024_salt'


def _hash_password(raw):
    return hashlib.sha256((PASSWORD_SALT + (raw or '')).encode('utf-8')).hexdigest()


def _cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id, X-Login',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def _serialize(row, include_login=False):
    data = {
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
        'customFields': row.get('custom_fields') or [],
        'stats': {
            'tasksDone': row['tasks_done'],
            'tasksInProgress': row['tasks_in_progress'],
            'reports': row['reports'],
            'efficiency': row['efficiency'],
        },
    }
    if include_login:
        data['login'] = row.get('login') or ''
    return data


def _is_boss(cur, login):
    if not login:
        return False
    cur.execute('SELECT position FROM employees WHERE login = %s', (login,))
    row = cur.fetchone()
    return bool(row and row['position'] == 'Начальник отдела')


def handler(event: dict, context) -> dict:
    '''Управление сотрудниками отдела: авторизация, список, добавление, редактирование, удаление. Изменения доступны только начальнику отдела.'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors_headers(), 'body': ''}

    headers = event.get('headers') or {}
    actor_login = headers.get('X-Login') or headers.get('x-login') or ''

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True

    try:
        params = event.get('queryStringParameters') or {}
        body = json.loads(event.get('body') or '{}')

        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                is_boss = _is_boss(cur, actor_login)
                cur.execute('SELECT * FROM employees ORDER BY id ASC')
                rows = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': _cors_headers(),
                'body': json.dumps([_serialize(r, include_login=is_boss) for r in rows]),
            }

        if params.get('action') == 'login' or body.get('action') == 'login':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    'SELECT * FROM employees WHERE login = %s AND password = %s',
                    (body.get('login', ''), _hash_password(body.get('password', ''))),
                )
                row = cur.fetchone()
            if not row:
                return {
                    'statusCode': 401,
                    'headers': _cors_headers(),
                    'body': json.dumps({'error': 'Неверный логин или пароль'}),
                }
            return {
                'statusCode': 200,
                'headers': _cors_headers(),
                'body': json.dumps(_serialize(row, include_login=True)),
            }

        if params.get('action') == 'change_password' or body.get('action') == 'change_password':
            if not actor_login:
                return {'statusCode': 401, 'headers': _cors_headers(), 'body': json.dumps({'error': 'Требуется авторизация'})}
            old_pw = body.get('oldPassword', '')
            new_pw = body.get('newPassword', '')
            if len(new_pw) < 4:
                return {'statusCode': 400, 'headers': _cors_headers(), 'body': json.dumps({'error': 'Новый пароль слишком короткий (мин. 4 символа)'})}
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    'SELECT id FROM employees WHERE login = %s AND password = %s',
                    (actor_login, _hash_password(old_pw)),
                )
                me = cur.fetchone()
                if not me:
                    return {'statusCode': 403, 'headers': _cors_headers(), 'body': json.dumps({'error': 'Неверный текущий пароль'})}
                cur.execute('UPDATE employees SET password = %s WHERE id = %s', (_hash_password(new_pw), me['id']))
            return {'statusCode': 200, 'headers': _cors_headers(), 'body': json.dumps({'success': True})}

        with conn.cursor(cursor_factory=RealDictCursor) as check_cur:
            if not _is_boss(check_cur, actor_login):
                return {
                    'statusCode': 403,
                    'headers': _cors_headers(),
                    'body': json.dumps({'error': 'Недостаточно прав. Управлять сотрудниками может только начальник отдела.'}),
                }

        if method == 'POST':
            stats = body.get('stats', {})
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    '''INSERT INTO employees
                    (full_name, position, status, email, phone, birth_date, hired_at,
                     location, about, avatar_color, login, password, custom_fields,
                     tasks_done, tasks_in_progress, reports, efficiency)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *''',
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
                        body.get('login') or None,
                        _hash_password(body.get('password', '')),
                        Json(body.get('customFields', [])),
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
                'body': json.dumps(_serialize(row, include_login=True)),
            }

        if method == 'PUT':
            emp_id = body.get('id')
            stats = body.get('stats', {})
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if body.get('password'):
                    cur.execute('UPDATE employees SET password = %s WHERE id = %s', (_hash_password(body['password']), emp_id))
                cur.execute(
                    '''UPDATE employees SET
                    full_name=%s, position=%s, status=%s, email=%s, phone=%s,
                    birth_date=%s, hired_at=%s, location=%s, about=%s, avatar_color=%s,
                    login=%s, custom_fields=%s,
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
                        body.get('login') or None,
                        Json(body.get('customFields', [])),
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
                'body': json.dumps(_serialize(row, include_login=True)),
            }

        if method == 'DELETE':
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