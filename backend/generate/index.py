import json
import os
import urllib.request
import re
import psycopg2
from datetime import datetime, timezone


API_URL = "https://api.aitunnel.ru/v1/chat/completions"
MODEL = "gpt-4o-mini"
SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p75689129_landing_chatbot_desi')
FREE_LIMITS = {'lessons': 5, 'games': 5, 'analyses': 0}

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
}

CHAT_SYSTEM_PROMPT = """Ты УрокАИ — дружелюбный ИИ-помощник для педагогов. Помогаешь с педагогическими идеями: планами уроков, играми, заданиями, методическими приёмами, мотивацией учеников и оцениванием.

Правила:
- Отвечай по-русски, тепло и профессионально
- Давай конкретные, готовые к применению идеи
- Используй эмодзи для структурирования списков
- Предлагай 3–5 практичных идей, не перегружай
- Если запрос расплывчатый — задай 1 уточняющий вопрос
- Ответ не длиннее 300 слов"""


def call_ai(api_key, messages, temperature=0.7, max_tokens=2000):
    payload = json.dumps({
        'model': MODEL,
        'messages': messages,
        'temperature': temperature,
        'max_tokens': max_tokens,
    }).encode('utf-8')
    req = urllib.request.Request(
        API_URL,
        data=payload,
        headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        result = json.loads(resp.read().decode('utf-8'))
    return result['choices'][0]['message']['content']


def strip_json(content):
    content = content.strip()
    content = re.sub(r'^```(?:json)?\s*', '', content)
    content = re.sub(r'\s*```$', '', content)
    return content.strip()


def ok(data):
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False)
    }


def err(message, code=400):
    return {
        'statusCode': code,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': False, 'error': message})
    }


def handle_chat(api_key, body):
    messages = body.get('messages', [])
    if not messages:
        return err('messages обязательны')
    reply = call_ai(
        api_key,
        [{'role': 'system', 'content': CHAT_SYSTEM_PROMPT}] + messages,
        max_tokens=1000
    )
    return ok({'reply': reply})


def handle_lesson(api_key, body):
    subject = body.get('subject', '')
    grade = body.get('grade', '')
    topic = body.get('topic', '')
    lesson_format = body.get('lesson_format', 'очный')
    duration = body.get('duration', '45 мин')
    students_count = body.get('students_count', '25–30')
    goal = body.get('goal', '')
    results_subject = body.get('results_subject', '')
    results_meta = body.get('results_meta', '')
    results_personal = body.get('results_personal', '')
    tech = body.get('tech', 'доска и маркеры')
    group_features = body.get('group_features', '')
    technology = body.get('technology', '')

    prompt = f"""Ты опытный методист с 20-летним стажем. Разработай подробный план-конспект урока.

📌 Параметры урока:
- Предмет/направление: {subject}
- Тема: {topic}
- Возраст/класс: {grade}
- Формат: {lesson_format}
- Длительность: {duration}
- Количество обучающихся: {students_count}
- Цель урока: {goal if goal else f'сформировать понимание темы «{topic}»'}
- Предметные результаты: {results_subject if results_subject else 'знание основных понятий темы'}
- Метапредметные результаты (УУД): {results_meta if results_meta else 'коммуникация, критическое мышление, рефлексия'}
- Личностные результаты: {results_personal if results_personal else 'мотивация к учению, социальная ответственность'}
- Технические возможности: {tech}
- Особенности группы: {group_features if group_features else 'стандартная группа'}
- Технология обучения: {technology if technology else 'смешанная'}

Сгенерируй план-конспект строго в JSON-формате (только JSON, без markdown):
{{
  "title": "Тема урока",
  "lesson_type": "Тип урока (изучение нового / закрепление / комбинированный / контроль)",
  "grade": "{grade}",
  "duration": "{duration}",
  "format": "{lesson_format}",
  "goal": "Педагогическая цель урока",
  "planned_results": {{
    "subject": "Предметные результаты: что узнают / научатся делать",
    "meta": "Метапредметные УУД: коммуникация, критическое мышление, рефлексия",
    "personal": "Личностные: ценности, мотивация, социальная ответственность"
  }},
  "equipment": "Оборудование и материалы (с упоминанием бесплатных цифровых ресурсов если нужны)",
  "interdisciplinary": "Межпредметные связи и интеграция с воспитательной работой",
  "stages": [
    {{"name": "Организационный момент", "duration": "2–3 мин", "goal": "Мотивация и настрой", "teacher_actions": "Подробные действия учителя", "student_actions": "Действия обучающихся", "method": "Приём (конкретный)", "materials": "Материалы"}},
    {{"name": "Актуализация знаний", "duration": "5–7 мин", "goal": "Проверка базовых знаний", "teacher_actions": "Подробные действия учителя + пример вопроса", "student_actions": "Действия обучающихся", "method": "Приём", "materials": "Материалы"}},
    {{"name": "Изучение нового материала", "duration": "10–15 мин", "goal": "Освоение нового содержания", "teacher_actions": "Подробные действия учителя", "student_actions": "Действия обучающихся", "method": "Метод + интерактив", "materials": "Материалы"}},
    {{"name": "Первичное закрепление", "duration": "7–10 мин", "goal": "Отработка нового материала", "teacher_actions": "Задание с критериями проверки", "student_actions": "Действия обучающихся", "method": "Приём", "materials": "Материалы"}},
    {{"name": "Рефлексия", "duration": "3–5 мин", "goal": "Осмысление результатов урока", "teacher_actions": "Конкретный приём рефлексии (незаконченное предложение / светофор / 3-2-1)", "student_actions": "Действия обучающихся", "method": "Приём рефлексии", "materials": "Материалы"}},
    {{"name": "Домашнее задание", "duration": "2–3 мин", "goal": "Постановка ДЗ", "teacher_actions": "Объяснение ДЗ", "student_actions": "Запись ДЗ", "method": "Дифференцированное задание", "materials": ""}}
  ],
  "homework": {{
    "basic": "Базовое задание для всех",
    "advanced": "Повышенное задание для сильных",
    "creative": "Творческое задание по желанию"
  }},
  "adaptation": "Адаптация под разные образовательные потребности: инклюзия, поддержка мотивации, работа с разными темпами",
  "assessment": {{
    "formative": "Формативные критерии оценки (в процессе урока)",
    "summative": "Суммативные критерии оценки (итог)",
    "checklist": ["Пункт самопроверки 1", "Пункт самопроверки 2", "Пункт самопроверки 3", "Пункт самопроверки 4"]
  }},
  "risks": [
    {{"risk": "Риск 1", "solution": "Как быстро исправить"}},
    {{"risk": "Риск 2", "solution": "Как быстро исправить"}},
    {{"risk": "Риск 3", "solution": "Как быстро исправить"}}
  ],
  "handouts": [
    {{"type": "Тип материала (вопрос/карточка/задание/слайд)", "content": "Готовый текст для копирования/печати 1"}},
    {{"type": "Тип материала", "content": "Готовый текст 2"}},
    {{"type": "Тип материала", "content": "Готовый текст 3"}},
    {{"type": "Тип материала", "content": "Готовый текст 4"}}
  ],
  "teacher_tips": ["Лайфхак 1", "Лайфхак 2", "Лайфхак 3"]
}}

Требования:
- Язык простой, инструктивный, без академической воды
- Все задания возраст-адекватные для {grade}
- Упор на активность обучающихся: минимум лекции, максимум практики
- Сумма времени этапов = {duration}
- Цифровые инструменты — только бесплатные и доступные в РФ (Яндекс.Учебник, LearningApps, Wordwall)
- Учти особенности группы: {group_features if group_features else 'стандартная группа'}"""

    content = call_ai(api_key, [
        {'role': 'system', 'content': 'Ты профессиональный методист с 20-летним опытом. Составляешь детальные планы-конспекты уроков. Отвечаешь только валидным JSON без markdown-блоков.'},
        {'role': 'user', 'content': prompt}
    ], max_tokens=2000)

    lesson_plan = json.loads(strip_json(content))
    return ok({'ok': True, 'lesson': lesson_plan})


def handle_game(api_key, body):
    subject = body.get('subject', '')
    grade = body.get('grade', '')
    duration = body.get('duration', '25 мин')
    topic = body.get('topic', '')
    students_count = body.get('students_count', '25–30')
    game_format = body.get('game_format', '')
    lesson_goal = body.get('lesson_goal', '')
    tech = body.get('tech', 'доска и маркеры')

    prompt = f"""Ты опытный педагог-методист с 20-летним стажем, эксперт по геймификации в образовании.

📌 Параметры:
- Предмет/тема: {subject} — {topic}
- Класс/возраст: {grade}
- Количество учеников: {students_count}
- Длительность: {duration}
- Формат: {game_format if game_format else 'на твоё усмотрение'}
- Цель урока: {lesson_goal if lesson_goal else f'закрепить материал по теме {topic}'}
- Технические возможности: {tech}

Сгенерируй подробную образовательную игру строго в JSON-формате (только JSON, без markdown-блоков):
{{
  "name": "Название игры",
  "legend": "Краткая легенда/сеттинг — 1–2 предложения",
  "type": "Тип игры",
  "duration": "{duration}",
  "subject": "{subject}",
  "grade": "{grade}",
  "topic": "{topic}",
  "goal": "Цель игры — чему учит",
  "description": "Описание игры (3–4 предложения)",
  "teams": "Описание разделения на команды/роли",
  "materials": "Что нужно подготовить учителю (распечатать, вырезать, написать заранее)",
  "rules": ["Правило 1", "Правило 2", "Правило 3", "Правило 4", "Правило 5"],
  "steps": [
    {{"step": 1, "duration": "X мин", "action": "Подробное описание шага"}},
    {{"step": 2, "duration": "X мин", "action": "Подробное описание шага"}},
    {{"step": 3, "duration": "X мин", "action": "Подробное описание шага"}},
    {{"step": 4, "duration": "X мин", "action": "Подробное описание шага"}}
  ],
  "scoring": "Система подсчёта баллов и критерии победы",
  "game_materials": [
    {{"type": "Тип материала (вопрос/карточка/задание)", "content": "Готовый текст для печати 1"}},
    {{"type": "Тип материала", "content": "Готовый текст для печати 2"}},
    {{"type": "Тип материала", "content": "Готовый текст для печати 3"}},
    {{"type": "Тип материала", "content": "Готовый текст для печати 4"}},
    {{"type": "Тип материала", "content": "Готовый текст для печати 5"}},
    {{"type": "Тип материала", "content": "Готовый текст для печати 6"}},
    {{"type": "Тип материала", "content": "Готовый текст для печати 7"}},
    {{"type": "Тип материала", "content": "Готовый текст для печати 8"}}
  ],
  "adaptation": "Как упростить для слабых учеников и усложнить для сильных; инклюзивные правки",
  "digital_tools": "Бесплатные цифровые инструменты если нужны или пустая строка",
  "teacher_tips": ["Лайфхак 1 — как удержать внимание", "Лайфхак 2 — что делать при хаосе", "Лайфхак 3 — как быстро проверить ответы", "Лайфхак 4 — дополнительный совет"],
  "variations": "Как упростить или усложнить игру целиком"
}}

Требования:
- Игра безопасная, возраст-адекватная для {grade}
- Все game_materials готовы к копированию и печати прямо сейчас
- Укладывается ровно в {duration}
- Работает при технических возможностях: {tech}
- Язык простой — инструкция работает даже у учителя без опыта геймификации"""

    content = call_ai(api_key, [
        {'role': 'system', 'content': 'Ты профессиональный педагог-методист с 20-летним опытом геймификации. Создаёшь детальные, готовые к использованию образовательные игры. Отвечаешь только валидным JSON без markdown-блоков.'},
        {'role': 'user', 'content': prompt}
    ], max_tokens=2000)

    game = json.loads(strip_json(content))
    return ok({'ok': True, 'game': game})


def handle_analysis(api_key, body):
    subject = body.get('subject', '')
    grade = body.get('grade', '')
    topic = body.get('topic', '')
    goal = body.get('goal', '')
    technologies = body.get('technologies', '')
    achievements = body.get('achievements', '')
    difficulties = body.get('difficulties', '')

    if not subject or not topic:
        return err('Заполните предмет и тему')

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

    content = call_ai(api_key, [
        {'role': 'system', 'content': 'Ты профессиональный методист-эксперт. Составляешь самоанализы уроков. Отвечаешь только валидным JSON без markdown.'},
        {'role': 'user', 'content': prompt}
    ], max_tokens=1500)

    analysis = json.loads(strip_json(content))
    return ok({'ok': True, 'analysis': analysis})


def handle_intensive(api_key, body):
    fmt = body.get('format', 'Интенсив')
    duration = body.get('duration', '2 часа')
    conduct = body.get('conduct', 'Офлайн')
    participants = body.get('participants', '15–20 человек')
    audience = body.get('audience', '')
    level = body.get('level', 'Смешанный')
    goal = body.get('goal', '')

    prompt = f"""Ты опытный методист и фасилитатор с 15-летним стажем проведения интенсивов и мастер-классов.

📋 ИСХОДНЫЕ ДАННЫЕ:
- Тип мероприятия: {fmt}
- Целевая аудитория: {audience}
- Длительность: {duration}
- Формат проведения: {conduct}
- Количество участников: {participants}
- Цель занятия: {goal}
- Уровень подготовки: {level}

Создай подробную программу строго в JSON-формате (только JSON, без markdown):
{{
  "title": "Креативное название мероприятия",
  "slogan": "Короткий слоган/девиз",
  "format": "{fmt}",
  "duration": "{duration}",
  "audience": "{audience}",
  "goals": {{
    "educational": "Образовательная цель",
    "developmental": "Развивающая цель",
    "personal": "Воспитательная/личностная цель"
  }},
  "expected_results": [
    "Результат 1 — что участник унесёт с собой",
    "Результат 2",
    "Результат 3",
    "Результат 4"
  ],
  "facilitator_competencies": ["Компетенция ведущего 1", "Компетенция 2", "Компетенция 3"],
  "program": [
    {{
      "block": "Вводная часть (ледокол, мотивация)",
      "duration": "X мин",
      "content": "Подробное содержание блока",
      "methods": "Методы и приёмы",
      "materials": "Необходимые материалы",
      "facilitator_role": "Роль ведущего",
      "participant_role": "Роль участников"
    }},
    {{
      "block": "Теоретический блок",
      "duration": "X мин",
      "content": "Подробное содержание",
      "methods": "Методы",
      "materials": "Материалы",
      "facilitator_role": "Роль ведущего",
      "participant_role": "Роль участников"
    }},
    {{
      "block": "Практический блок",
      "duration": "X мин",
      "content": "Практические упражнения, кейсы",
      "methods": "Методы",
      "materials": "Материалы",
      "facilitator_role": "Роль ведущего",
      "participant_role": "Роль участников"
    }},
    {{
      "block": "Рефлексия и итоги",
      "duration": "X мин",
      "content": "Подведение итогов",
      "methods": "Методы рефлексии",
      "materials": "Материалы",
      "facilitator_role": "Роль ведущего",
      "participant_role": "Роль участников"
    }}
  ],
  "interactive_elements": [
    {{"type": "Геймификация", "description": "Подробное описание игрового элемента"}},
    {{"type": "Работа в группах", "description": "Описание групповой работы"}},
    {{"type": "Практический кейс", "description": "Описание кейса"}},
    {{"type": "Элемент соревновательности", "description": "Описание соревновательного элемента"}}
  ],
  "equipment": {{
    "hardware": ["Проектор", "Флипчарт", "другое оборудование"],
    "digital_tools": ["Mentimeter / Kahoot / Miro и т.д."],
    "handouts": ["Чек-лист", "Памятка", "Шаблон — описание что именно"]
  }},
  "assessment": {{
    "success_criteria": "Как понять что цели достигнуты",
    "feedback_forms": ["Форма 1", "Форма 2", "Форма 3"],
    "skill_evaluation": "Методы оценки полученных навыков"
  }},
  "highlights": {{
    "attention_tricks": ["Приём 1 для удержания внимания", "Приём 2", "Приём 3"],
    "homework": "Идея для ДЗ или продолжения",
    "online_adaptation": "Как адаптировать под онлайн-формат",
    "risks": [
      {{"risk": "Риск 1", "prevention": "Как предотвратить"}},
      {{"risk": "Риск 2", "prevention": "Как предотвратить"}}
    ]
  }}
}}

Требования:
- Теория не более 30%, практика не менее 70%
- Сумма времени блоков = {duration}
- Конкретные сценарии упражнений, не абстрактные
- Surprise-эффект: хотя бы 1 неожиданный приём
- Учти формат проведения: {conduct}
- Аудитория: {audience}, уровень: {level}"""

    content = call_ai(api_key, [
        {'role': 'system', 'content': 'Ты профессиональный методист и фасилитатор. Создаёшь детальные программы интенсивов, мастер-классов и воркшопов. Отвечаешь только валидным JSON без markdown-блоков.'},
        {'role': 'user', 'content': prompt}
    ], max_tokens=3000)

    plan = json.loads(strip_json(content))
    return ok({'ok': True, 'plan': plan})


def check_limit(token, resource):
    """Проверяет лимит пользователя. Возвращает (allowed: bool, error_msg: str|None)."""
    if not token:
        return True, None
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    try:
        cur.execute(
            f"SELECT s.user_id FROM {SCHEMA}.sessions s WHERE s.token=%s AND s.expires_at > NOW()",
            (token,)
        )
        row = cur.fetchone()
        if not row:
            return True, None
        user_id = row[0]

        cur.execute(
            f"SELECT plan, expires_at FROM {SCHEMA}.subscriptions WHERE user_id=%s AND is_active=TRUE ORDER BY started_at DESC LIMIT 1",
            (user_id,)
        )
        sub = cur.fetchone()
        plan = sub[0] if sub else 'free'
        expires_at = sub[1] if sub else None

        if plan != 'free' and expires_at and expires_at < datetime.now(timezone.utc):
            cur.execute(f"UPDATE {SCHEMA}.subscriptions SET is_active=FALSE WHERE user_id=%s AND plan!='free'", (user_id,))
            conn.commit()
            plan = 'free'

        if plan != 'free':
            return True, None

        col_map = {'lessons': 'lessons_used', 'games': 'games_used', 'analyses': 'analyses_used'}
        col = col_map.get(resource)
        if not col:
            return True, None

        cur.execute(f"SELECT {col} FROM {SCHEMA}.usage_counts WHERE user_id=%s", (user_id,))
        usage_row = cur.fetchone()
        used = usage_row[0] if usage_row else 0
        limit = FREE_LIMITS.get(resource, 0)

        if used >= limit:
            return False, 'Лимит исчерпан. Оформите подписку для продолжения.'
        return True, None
    finally:
        cur.close()
        conn.close()


def handler(event: dict, context) -> dict:
    """Единая функция генерации: урок (lesson), игра (game), самоанализ (analysis), чат (chat)."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    api_key = os.environ.get('AITUNNEL_API_KEY', '')
    body = json.loads(event.get('body') or '{}')
    action = body.get('action', 'lesson')

    token = (event.get('headers') or {}).get('X-Authorization', '').replace('Bearer ', '').strip()
    if not token:
        token = (event.get('headers') or {}).get('Authorization', '').replace('Bearer ', '').strip()

    resource_map = {'lesson': 'lessons', 'game': 'games', 'analysis': 'analyses', 'intensive': 'lessons'}
    resource = resource_map.get(action)
    if resource:
        allowed, limit_err = check_limit(token, resource)
        if not allowed:
            return {
                'statusCode': 403,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'ok': False, 'error': limit_err, 'limit_exceeded': True})
            }

    if action == 'chat':
        return handle_chat(api_key, body)
    elif action == 'lesson':
        return handle_lesson(api_key, body)
    elif action == 'game':
        return handle_game(api_key, body)
    elif action == 'analysis':
        return handle_analysis(api_key, body)
    elif action == 'intensive':
        return handle_intensive(api_key, body)
    else:
        return err(f'Неизвестный action: {action}')