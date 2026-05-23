import { useState, useEffect, useRef, KeyboardEvent } from "react";
import Icon from "@/components/ui/icon";
import { useUser } from "@/context/UserContext";

const CHAT_URL = "https://functions.poehali.dev/1186dab1-1c68-4be5-95d4-74d1e710571e";

const SUGGESTIONS = [
  "Придумай игру по истории для 7 класса",
  "Как провести рефлексию в конце урока?",
  "Идеи для мотивации учеников на математике",
  "Как оценить групповую работу?",
];

const STUDENTS_IMAGE = "https://cdn.poehali.dev/projects/3a27d5a9-016a-43ab-946d-4c4fe8129705/files/a75ebe32-992a-474d-964e-72a5f83e9bed.jpg";



const FAQ_ITEMS = [
  {
    q: "Нужны ли технические навыки для работы с сервисом?",
    a: "Нет. УрокАИ создан специально для педагогов без технической подготовки. Просто опишите тему, класс и предмет — ИИ сделает остальное.",
  },
  {
    q: "Можно ли редактировать готовый план урока?",
    a: "Да, после генерации вы можете скачать план и доработать его под себя. В личном кабинете все уроки сохраняются и доступны для редактирования.",
  },
  {
    q: "Могу ли я сохранять свои уроки?",
    a: "Конечно. Все разработанные уроки сохраняются в вашем личном кабинете. Вы можете редактировать, копировать и делиться ими с коллегами.",
  },
  {
    q: "Подходит ли сервис для разных предметов?",
    a: "УрокАИ работает для любых предметов — от математики и физики до литературы и физкультуры. ИИ адаптирует идеи под специфику каждой дисциплины.",
  },
  {
    q: "Сколько стоит использование?",
    a: "Есть бесплатный тариф с базовыми функциями. Премиум-план открывает неограниченные уроки, интеграции и приоритетную поддержку.",
  },
];

const ARTICLES = [
  {
    tag: "Методика",
    tagColor: "badge-indigo",
    accentColor: "from-primary to-indigo-mid",
    title: "5 техник активного обучения, которые работают в любом классе",
    desc: "Как превратить пассивных слушателей в участников урока с помощью простых приёмов.",
    time: "5 мин",
  },
  {
    tag: "Оценивание",
    tagColor: "badge-amber",
    accentColor: "from-amber to-amber-mid",
    title: "Формативное оценивание без стресса: инструменты и примеры",
    desc: "Как регулярно проверять знания учеников так, чтобы это помогало, а не пугало.",
    time: "7 мин",
  },
  {
    tag: "Технологии",
    tagColor: "badge-indigo",
    accentColor: "from-teal to-teal-light",
    title: "ИИ в классе: как сократить подготовку урока вдвое",
    desc: "Пошаговое руководство по внедрению ИИ-помощника в ежедневную работу педагога.",
    time: "4 мин",
  },
];

const FEATURES = [
  { icon: "Lightbulb", title: "Идеи и активности", desc: "ИИ предлагает конкретные упражнения, игры и задания с учётом возраста и предмета", color: "bg-amber-light text-amber" },
  { icon: "BarChart3", title: "Методы оценивания", desc: "Получите готовые критерии оценки, рубрики и форматы проверки знаний", color: "bg-indigo-light text-primary" },
  { icon: "Download", title: "Скачать план урока", desc: "Готовая технологическая карта в один клик — сохраняйте и используйте сразу", color: "bg-teal-light text-teal" },
  { icon: "BookOpen", title: "Библиотека уроков", desc: "Сохраняйте, редактируйте и делитесь уроками с коллегами", color: "bg-amber-light text-amber" },
  { icon: "Users", title: "Адаптация под класс", desc: "Укажите особенности аудитории — ИИ настроит подачу материала", color: "bg-indigo-light text-primary" },
  { icon: "Clock", title: "Экономия времени", desc: "Подготовка урока занимает 5 минут вместо нескольких часов", color: "bg-teal-light text-teal" },
];

function About() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="section-fade text-center mb-10 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full badge-indigo text-xs font-body font-semibold uppercase tracking-wider mb-4">О сервисе</span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-3 mb-5 text-foreground">
            Всё необходимое для{" "}
            <span className="gradient-text">современного урока</span>
          </h2>
          <p className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            УрокАИ — это интеллектуальный ассистент, который понимает специфику педагогической работы и помогает создавать вовлекающие уроки.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="section-fade group p-6 rounded-2xl border border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 bg-white"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200`}>
                <Icon name={f.icon} fallback="Lightbulb" size={20} />
              </div>
              <h3 className="font-body font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}

type Message = { role: "user" | "bot"; text: string };

const FREE_CHAT_LIMIT = 8;

function ChatDemo({ onPayment }: { onPayment?: () => void }) {
  const { token, status, incrementUsage } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Гостевой счётчик (localStorage)
  const [guestChat, setGuestChat] = useState(() => Number(localStorage.getItem("guest_chat") || 0));

  const chatUsed = token ? (status?.usage.chat ?? 0) : guestChat;
  const chatLimit = token ? (status?.limits.chat ?? FREE_CHAT_LIMIT) : FREE_CHAT_LIMIT;
  const isLimitReached = chatUsed >= chatLimit;

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading || isLimitReached) return;

    const newMessages: Message[] = [...messages, { role: "user", text: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Увеличиваем счётчик
    if (token) {
      await incrementUsage("chat");
    } else {
      const next = guestChat + 1;
      setGuestChat(next);
      localStorage.setItem("guest_chat", String(next));
    }

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          messages: newMessages.map((m) => ({
            role: m.role === "bot" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply || "Что-то пошло не так, попробуйте ещё раз." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Не удалось получить ответ. Проверьте соединение." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <section id="demo" className="py-16 sm:py-24 bg-background">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="section-fade text-center mb-10 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full badge-amber text-xs font-body font-semibold uppercase tracking-wider mb-4">Попробуйте прямо сейчас</span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-3 mb-5 text-foreground">
            Живой диалог с ИИ-помощником
          </h2>
          <p className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Спросите что угодно о педагогике — получите конкретные идеи прямо здесь.
          </p>
        </div>

        <div className="section-fade max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl shadow-primary/8 border border-border overflow-hidden flex flex-col" style={{ height: "min(520px, 70vh)" }}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center gap-3 bg-slate/50 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <Icon name="GraduationCap" size={16} className="text-white" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">УрокАИ</p>
                <div className="flex items-center gap-1.5 font-body text-xs text-teal">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block animate-pulse-soft" />
                  {loading ? "Печатает..." : "Онлайн"}
                </div>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="ml-auto font-body text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Icon name="RotateCcw" size={12} />
                  Сбросить
                </button>
              )}
            </div>

            {/* Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
              {isEmpty && (
                <div className="h-full flex flex-col items-center justify-center gap-5 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-light flex items-center justify-center">
                    <Icon name="Sparkles" size={26} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-foreground mb-1">Спросите про педагогику</p>
                    <p className="font-body text-sm text-muted-foreground">Идеи уроков, игры, оценивание, мотивация</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-sm">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-left px-4 py-2.5 rounded-xl border border-border bg-white hover:border-primary/30 hover:bg-indigo-light/40 transition-all font-body text-sm text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
                  {msg.role === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                      <Icon name="Bot" size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-sm"
                      : "bg-slate text-foreground rounded-tl-sm"
                  }`}>
                    <p className="font-body text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center mr-2">
                    <Icon name="Bot" size={14} className="text-white" />
                  </div>
                  <div className="bg-slate rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t border-border p-4">
              {isLimitReached ? (
                <div className="text-center py-3 space-y-2">
                  <p className="font-body text-sm font-semibold text-foreground">Лимит сообщений исчерпан</p>
                  <p className="font-body text-xs text-muted-foreground">Оформите подписку, чтобы общаться без ограничений</p>
                  <button
                    onClick={onPayment}
                    className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-body font-bold text-sm hover:bg-primary/90 transition-all active:scale-95 shadow-md shadow-primary/25"
                  >
                    <Icon name="Crown" size={15} />
                    Оформить подписку
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-3">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Напишите вопрос или задачу..."
                      rows={1}
                      className="flex-1 resize-none rounded-xl border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors bg-white"
                      style={{ maxHeight: 120 }}
                    />
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || loading}
                      className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-primary/25"
                    >
                      <Icon name="Send" size={16} className="text-white" />
                    </button>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-2 text-center">
                    Enter — отправить · Shift+Enter — новая строка · осталось {chatLimit - chatUsed} из {chatLimit} сообщений
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6">
        <div className="section-fade text-center mb-10 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full badge-indigo text-xs font-body font-semibold uppercase tracking-wider mb-4">Вопросы и ответы</span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-3 mb-5 text-foreground">
            Частые вопросы
          </h2>
          <p className="font-body text-base sm:text-lg text-muted-foreground">
            Если не нашли ответ — напишите нам в поддержку.
          </p>
        </div>

        <div className="section-fade space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                open === i ? "border-primary/30 shadow-md shadow-primary/8" : "border-border hover:border-primary/20"
              }`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-slate/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-body font-medium text-foreground text-sm leading-relaxed">{item.q}</span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${open === i ? "bg-primary text-white" : "bg-slate text-muted-foreground"}`}>
                  <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={14} />
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 animate-fade-in border-t border-border/50 pt-4">
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Articles() {
  return (
    <section id="articles" className="py-16 sm:py-24 bg-background">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="section-fade flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="inline-block px-3 py-1 rounded-full badge-amber text-xs font-body font-semibold uppercase tracking-wider mb-4">Блог</span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-3 text-foreground">
              Статьи и советы
            </h2>
          </div>
          <a href="#" className="hidden md:flex items-center gap-1.5 font-body text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            Все статьи
            <Icon name="ArrowRight" size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {ARTICLES.map((a, i) => (
            <div
              key={i}
              className="section-fade group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/8 transition-all duration-300 cursor-pointer"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`h-1.5 bg-gradient-to-r ${a.accentColor} group-hover:h-2 transition-all duration-300`} />
              <div className="p-6">
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-body font-semibold mb-4 ${a.tagColor}`}>
                  {a.tag}
                </span>
                <h3 className="font-body font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                  {a.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{a.desc}</p>
                <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                  <Icon name="Clock" size={13} />
                  {a.time} чтения
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const WISE_QUOTES = [
  "Не верь первому, что увидел. Проверяй второе, что услышал. Действуй на основе третьего — проверенного.",
  "Информационный шум — не твоя реальность. Фильтр — твой выбор.",
  "Критическое мышление — это не недоверие ко всем. Это уважение к фактам.",
  "Твоё внимание — самая дорогая валюта. Трать её осознанно.",
  "Если новость вызывает срочность или страх — остановись. Манипуляция любит спешку.",
  "Не путай мнение эксперта с доказанным исследованием.",
  "Цифровая гигиена начинается с вопроса: «Зачем я это читаю?»",
  "Факты не кричат. Они ждут, пока ты задашь правильные вопросы.",
  "Отписаться от токсичного источника — не слабость. Это акт заботы о своём уме.",
  "Информация без контекста — просто шум с красивым заголовком.",
  "Твоя лента не обязана быть полной. Она должна быть полезной.",
  "Проверяй источник так же тщательно, как проверяешь состав продуктов в магазине.",
  "Мозг устает не от информации, а от её хаоса. Структурируй поток.",
  "«Все так говорят» — не аргумент. «Вот данные» — да.",
  "Информационная грамотность — это не знание всего. Это умение найти и проверить нужное.",
  "Не позволяй алгоритмам решать, о чём тебе думать. Возвращай контроль.",
  "Эмоция — плохой компас для решений. Факт — надёжный.",
  "Читай медленно, думай глубоко, проверяй дважды.",
  "Твои убеждения должны расти вместе с новыми доказательствами, а не цепляться за старые.",
  "Информация, которую ты не проверяешь, в итоге проверяет тебя.",
  "Не бойся сказать «я не знаю» — это начало мудрости. Бойся сказать «я уверен» без проверки.",
  "Цифровой детокс — не отказ от мира. Это возврат к себе.",
  "Критический взгляд — это не цинизм. Это забота о ясности.",
  "Прежде чем поделиться — остановись на 3 секунды. Спроси: «А это правда? А это нужно?»",
  "Твоя информационная диета определяет твою ментальную форму.",
  "Не гонись за трендами. Гонись за фактами.",
  "Осознанное потребление информации начинается с паузы между стимулом и реакцией.",
  "Каждый источник, который ты оставляешь в ленте, голосует за твоё будущее мышление.",
  "Умный человек не собирает всё подряд. Он строит систему отбора.",
  "Информационная грамотность — это не навык. Это ежедневная практика свободы выбора.",
];

export function WiseMinute() {
  const saved = typeof window !== "undefined" ? localStorage.getItem("wise-quote-index") : null;
  const [index, setIndex] = useState<number>(
    saved !== null ? parseInt(saved, 10) : Math.floor(Math.random() * WISE_QUOTES.length)
  );
  const [visible, setVisible] = useState(true);

  function nextQuote() {
    setVisible(false);
    setTimeout(() => {
      let next: number;
      do { next = Math.floor(Math.random() * WISE_QUOTES.length); } while (next === index && WISE_QUOTES.length > 1);
      setIndex(next);
      localStorage.setItem("wise-quote-index", String(next));
      setVisible(true);
    }, 250);
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50">
      <div className="container max-w-2xl mx-auto px-4 sm:px-6">
        <div className="section-fade text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-body font-semibold uppercase tracking-wider mb-3">💡 Мудрая минутка</span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">Мысль дня</h2>
        </div>

        <div className="section-fade relative bg-white rounded-3xl shadow-lg border-t-4 border-teal-400 px-8 py-10 text-center">
          <span className="absolute top-0 left-5 -translate-y-1/2 text-7xl text-orange-200/60 font-serif leading-none select-none">❝</span>
          <p
            className="font-body text-base sm:text-lg font-medium text-foreground leading-relaxed min-h-[80px] flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {WISE_QUOTES[index]}
          </p>
        </div>

        <div className="section-fade flex justify-center mt-6">
          <button
            onClick={nextQuote}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-300 text-white font-body font-semibold text-sm shadow-md shadow-orange-200 hover:from-orange-500 hover:to-orange-400 hover:shadow-orange-300 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            💡 Совет дня
          </button>
        </div>
      </div>
    </section>
  );
}

export { About, ChatDemo, FAQ, Articles };