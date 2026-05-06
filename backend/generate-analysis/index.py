import json
import os
import urllib.request
import re

API_URL = "https://api.aitunnel.ru/v1/chat/completions"
MODEL = "gpt-4o-mini"


def handler(event: dict, context) -> dict:
    """Генерирует самоанализ урока для педагога (платный контент)."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}, 'body': ''}

    api_key = os.environ.get('AITUNNEL_API_KEY', '')
    body = json.loads(event.get('body') or '{}')

    subject = body.get('subject', '')
    grade = body.get('grade', '')
    topic = body.get('topic', '')
    goal = body.get('goal', '')
    technology = body.get('technology', '')
    what_went_well = body.get('what_went_well', '')
    what_was_hard = body.get('what_was_hard', '')
    student_activity = body.get('student_activity', '')
    goal_achieved = body.get('goal_achieved', '')

    prompt = f"""Ты методист-эксперт. Составь профессиональный самоанализ урока на основе данных педагога.

Данные об уроке:
- Предмет: {subject}
- Класс: {grade}
- Тема урока: {topic}
- Цель урока: {goal}
- Технология обучения: {technology}
- Что прошло хорошо: {what_went_well}
- Что вызвало затруднения: {what_was_hard}
- Активность учеников: {student_activity}
- Цель достигнута: {goal_achieved}

Составь подробный самоанализ урока строго в JSON-формате (только JSON, без markdown):
{{
  "title": "Самоанализ урока: {topic}",
  "subject": "{subject}",
  "grade": "{grade}",
  "topic": "{topic}",
  "goal_analysis": "Анализ соответствия цели уроку и её достижения (3-4 предложения)",
  "content_analysis": "Анализ содержания и структуры урока (3-4 предложения)",
  "methods_analysis": "Анализ использованных методов и технологий (3-4 предложения)",
  "student_activity_analysis": "Анализ активности и вовлечённости учеников (2-3 предложения)",
  "achievements": ["Достижение 1", "Достижение 2", "Достижение 3"],
  "difficulties": ["Трудность 1", "Трудность 2"],
  "improvement_suggestions": ["Рекомендация 1", "Рекомендация 2", "Рекомендация 3"],
  "self_assessment": "Общая самооценка урока педагогом (2-3 предложения)",
  "rating": 4
}}

Пиши профессионально, конкретно, в духе педагогической рефлексии. rating — число от 1 до 5."""

    request_body = json.dumps({
        'model': MODEL,
        'messages': [
            {'role': 'system', 'content': 'Ты опытный методист с 20-летним стажем. Составляешь профессиональные самоанализы уроков. Отвечаешь только валидным JSON без markdown-блоков.'},
            {'role': 'user', 'content': prompt}
        ],
        'temperature': 0.7,
        'max_tokens': 2000,
    }).encode('utf-8')

    req = urllib.request.Request(API_URL, data=request_body, headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=60) as response:
        result = json.loads(response.read().decode('utf-8'))

    content = result['choices'][0]['message']['content']
    content = re.sub(r'^```(?:json)?\s*', '', content.strip())
    content = re.sub(r'\s*```$', '', content.strip())
    analysis = json.loads(content)

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True, 'analysis': analysis}, ensure_ascii=False)
    }
