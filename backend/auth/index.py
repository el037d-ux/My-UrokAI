import json
import os
import hashlib
import secrets
import psycopg2
import psycopg2.errors

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p75689129_landing_chatbot_desi')


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    """Регистрация и вход пользователей."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action')  # 'register' or 'login'
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')
    name = body.get('name', '').strip()

    if not email or not password:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': False, 'error': 'Email и пароль обязательны'})}

    conn = get_conn()
    cur = conn.cursor()

    try:
        if action == 'register':
            pw_hash = hash_password(password)
            cur.execute(f"INSERT INTO {SCHEMA}.users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id", (email, pw_hash, name))
            user_id = cur.fetchone()[0]
            # Создаём счётчик использования
            cur.execute(f"INSERT INTO {SCHEMA}.usage_counts (user_id) VALUES (%s)", (user_id,))
            # Создаём бесплатную подписку
            cur.execute(f"INSERT INTO {SCHEMA}.subscriptions (user_id, plan) VALUES (%s, 'free')", (user_id,))
            token = secrets.token_hex(32)
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (user_id, token))
            conn.commit()
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True, 'token': token, 'user': {'id': user_id, 'email': email, 'name': name}})
            }

        elif action == 'login':
            pw_hash = hash_password(password)
            cur.execute(f"SELECT id, email, name FROM {SCHEMA}.users WHERE email=%s AND password_hash=%s", (email, pw_hash))
            row = cur.fetchone()
            if not row:
                return {'statusCode': 401, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': False, 'error': 'Неверный email или пароль'})}
            user_id, email, name = row
            token = secrets.token_hex(32)
            cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (user_id, token))
            conn.commit()
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True, 'token': token, 'user': {'id': user_id, 'email': email, 'name': name}})
            }

        else:
            return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': False, 'error': 'Неизвестное действие'})}

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return {'statusCode': 409, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': False, 'error': 'Пользователь с таким email уже существует'})}
    finally:
        cur.close()
        conn.close()