import json
import os
import urllib.request

API_URL = "https://api.aitunnel.ru/v1/chat/completions"
MODEL = "gpt-4o-mini"


def handler(event: dict, context) -> dict:
    """Генерирует самоанализ урока на основе данных педагога."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    api_key = os.environ.get('AITUNNEL_API_KEY', '')
    body = json.loads(event.get('body') or '{}')

    subject = body.get('subject', '')
    grade = body.get('grade', '')
    topic = body.get('topic', '')
    goal = body.get('goal', '')
    technologies = body.get('technologies', '')
    achievements = body.get('achievements', '')
    difficulties = body.get('difficulties', '')

    if not subject or not topic:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': False, 'error': 'Заполните предмет и тему'})
        }

    prompt = f"""Ты опытный методист. Составь профессиональный самоанализ урока на основе данных педагога.

Данные урока:
- Предмет: {subject}
- Класс: {grade}
- Тема: {topic}
- Цель урока: {goal}
- Использованные методы и технологии: {technologies}
- Что получилось хорошо: {achievements}
- Что вызвало затруднения: {difficulties}

Составь самоанализ строго в JSON-формате (только JSON, без markdown):
{{
  "goal_analysis": "Анализ достижения цели урока (2-3 предложения)",
  "content_analysis": "Анализ содержания и его соответствия программе (2-3 предложения)",
  "method_analysis": "Анализ применённых методов и их эффективности (2-3 предложения)",
  "student_activity": "Оценка активности и вовлечённости учеников (2-3 предложения)",
  "self_assessment": "Общая самооценка урока: достижения и зоны роста (2-3 предложения)",
  "recommendations": [
    "Конкретная рекомендация для улучшения 1",
    "Конкретная рекомендация для улучшения 2",
    "Конкретная рекомендация для улучшения 3"
  ]
}}

Требования:
- Язык профессиональный, но живой — без канцелярщины
- Конкретные наблюдения, а не общие фразы
- Рекомендации — практичные и реализуемые"""

    payload = {
        'model': MODEL,
        'messages': [
            {'role': 'system', 'content': 'Ты профессиональный методист-эксперт. Составляешь самоанализы уроков. Отвечаешь только валидным JSON без markdown.'},
            {'role': 'user', 'content': prompt}
        ],
        'temperature': 0.7,
        'max_tokens': 1500,
    }

    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=25) as resp:
        result = json.loads(resp.read())

    content = result['choices'][0]['message']['content'].strip()
    content = content.replace('```json', '').replace('```', '').strip()
    analysis = json.loads(content)

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True, 'analysis': analysis}, ensure_ascii=False)
    }
