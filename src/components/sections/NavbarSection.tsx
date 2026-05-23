import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useUser } from "@/context/UserContext";

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

function WiseButton() {
  const saved = typeof window !== "undefined" ? localStorage.getItem("wise-quote-index") : null;
  const [index, setIndex] = useState<number>(
    saved !== null ? parseInt(saved, 10) : Math.floor(Math.random() * WISE_QUOTES.length)
  );
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function nextQuote() {
    setVisible(false);
    setTimeout(() => {
      let next: number;
      do { next = Math.floor(Math.random() * WISE_QUOTES.length); } while (next === index && WISE_QUOTES.length > 1);
      setIndex(next);
      localStorage.setItem("wise-quote-index", String(next));
      setVisible(true);
    }, 200);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-body font-semibold text-orange-500 hover:border-orange-300 hover:bg-orange-50 transition-all"
      >
        💡 Мудрая минутка
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-border p-4 z-50 animate-fade-in">
          <p className="font-body text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">💡 Мудрая минутка</p>
          <p
            className="font-body text-sm text-foreground leading-relaxed mb-3 transition-opacity duration-200"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {WISE_QUOTES[index]}
          </p>
          <button
            onClick={nextQuote}
            className="w-full py-2 rounded-xl bg-orange-50 text-orange-600 font-body font-semibold text-xs hover:bg-orange-100 transition-colors"
          >
            Следующая →
          </button>
        </div>
      )}
    </div>
  );
}

const HERO_IMAGE = "https://cdn.poehali.dev/projects/3a27d5a9-016a-43ab-946d-4c4fe8129705/bucket/fb741ecb-cd4a-4766-ba6b-9c590c24dfe7.png";

function Navbar({ onStart, onAuth, onPayment, onProfile }: { onStart: () => void; onAuth: () => void; onPayment: () => void; onProfile: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { token, status } = useUser();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#about", label: "О сервисе" },
    { href: "#demo", label: "Примеры" },
    { href: "#faq", label: "Вопросы" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
            <Icon name="GraduationCap" size={16} className="text-white" />
          </span>
          <span className="font-display text-xl font-bold text-foreground tracking-tight">УрокАИ</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors font-medium">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate("/quests")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-body font-semibold text-amber hover:border-amber/40 hover:bg-amber/5 transition-all">
            <Icon name="Swords" size={14} className="text-amber" />
            Тренажёры
          </button>
          <WiseButton />

          {token ? (
            <button onClick={onProfile} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-body font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/25 active:scale-95">
              <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold leading-none">
                {(status?.user?.name || status?.user?.email || "?")[0].toUpperCase()}
              </div>
              Личный кабинет
            </button>
          ) : (
            <button onClick={onAuth} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-body font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 active:scale-95">
              Войти
            </button>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={20} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 space-y-3 animate-fade-in">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="block text-sm font-body text-muted-foreground hover:text-foreground py-1.5 font-medium"
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="pt-2 space-y-2">
            <button onClick={() => { navigate("/quests"); setMenuOpen(false); }} className="w-full py-2.5 text-sm font-body font-semibold border border-amber/30 text-amber rounded-xl flex items-center justify-center gap-2">
              <Icon name="Swords" size={14} />Тренажёры
            </button>

            {token ? (
              <button onClick={() => { onProfile(); setMenuOpen(false); }} className="w-full py-2.5 text-sm font-body font-semibold bg-primary text-white rounded-xl flex items-center justify-center gap-2">
                <Icon name="User" size={14} />Личный кабинет
              </button>
            ) : (
              <button onClick={() => { onAuth(); setMenuOpen(false); }} className="w-full py-2.5 text-sm font-body font-semibold bg-primary text-white rounded-xl">
                Войти
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero({ onStart, onGame, onAnalysis, onPayment, lessonsLeft, gamesLeft, isPaid }: { onStart: () => void; onGame: () => void; onAnalysis: () => void; onPayment: () => void; lessonsLeft: number | null; gamesLeft: number | null; isPaid: boolean }) {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-indigo-light/40 to-teal-light/30 -z-10" />
      <div className="absolute top-1/4 right-0 w-48 sm:w-80 md:w-[500px] h-48 sm:h-80 md:h-[500px] rounded-full bg-primary/8 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-1/4 w-40 sm:w-64 md:w-[400px] h-40 sm:h-64 md:h-[400px] rounded-full bg-amber-light blur-3xl -z-10" />
      <div className="absolute top-1/2 left-0 w-32 sm:w-52 md:w-[300px] h-32 sm:h-52 md:h-[300px] rounded-full bg-teal-light/50 blur-3xl -z-10" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-amber mb-6 sm:mb-8 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-soft" />
            <span className="text-xs font-body font-semibold">ИИ для педагогов нового поколения</span>
          </div>

          <h1 style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }} className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] text-foreground mb-5 sm:mb-6 animate-fade-in-up delay-100">
            Готовьте уроки{" "}
            <span className="gradient-text">в 10 раз быстрее</span>{" "}
            с помощью ИИ
          </h1>

          <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8 animate-fade-in-up delay-200">
            Опишите тему, возраст учеников и предмет — УрокАИ предложит идеи активностей, методы оценивания и готовый план урока за секунды.
          </p>

          {/* Две главные кнопки */}
          <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in-up delay-300">
            {/* Генератор урока */}
            <button
              onClick={onStart}
              className="flex flex-col items-center gap-2 px-4 py-4 rounded-2xl bg-primary text-white font-body font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95 group"
            >
              <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Icon name="BookOpen" size={20} className="text-white" />
              </span>
              <span className="text-sm font-bold">Генератор урока</span>
              {!isPaid && lessonsLeft !== null && (
                <span className="text-xs font-body font-normal opacity-80">
                  {lessonsLeft > 0 ? `Осталось бесплатно: ${lessonsLeft}` : "Лимит исчерпан"}
                </span>
              )}
              {isPaid && <span className="text-xs font-body font-normal opacity-80">Безлимитно</span>}
            </button>

            {/* Генератор игры */}
            <button
              onClick={onGame}
              className="flex flex-col items-center gap-2 px-4 py-4 rounded-2xl bg-amber text-foreground font-body font-semibold hover:bg-amber/90 transition-all hover:shadow-lg hover:shadow-amber/25 active:scale-95 group"
            >
              <span className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center group-hover:bg-black/15 transition-colors">
                <Icon name="Gamepad2" size={20} className="text-foreground" />
              </span>
              <span className="text-sm font-bold">Генератор игры</span>
              {!isPaid && gamesLeft !== null && (
                <span className="text-xs font-body font-normal opacity-70">
                  {gamesLeft > 0 ? `Осталось бесплатно: ${gamesLeft}` : "Лимит исчерпан"}
                </span>
              )}
              {isPaid && <span className="text-xs font-body font-normal opacity-70">Безлимитно</span>}
            </button>

          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6 animate-fade-in-up delay-500">
            {[
              { n: "4 000+", l: "педагогов", color: "text-primary" },
              { n: "50 000+", l: "уроков создано", color: "text-teal" },
              { n: "5 мин", l: "на подготовку урока", color: "text-amber" },
            ].map((s) => (
              <div key={s.l}>
                <div className={`font-display text-2xl font-bold ${s.color}`}>{s.n}</div>
                <div className="font-body text-sm text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-in-up delay-300 hidden lg:block">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 animate-float">
            <img
              src={HERO_IMAGE}
              alt="Педагог с ИИ-помощником"
              className="w-full h-[480px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
          </div>

          <div className="absolute -left-8 top-16 bg-white rounded-xl p-3 shadow-xl border border-border animate-fade-in delay-500 max-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-lg bg-teal-light flex items-center justify-center">
                <Icon name="Zap" size={12} className="text-teal" />
              </span>
              <span className="font-body text-xs font-semibold">Урок готов</span>
            </div>
            <p className="font-body text-xs text-muted-foreground">Фотосинтез, 6 класс — 4 активности, 3 метода оценки</p>
          </div>

          <div className="absolute -right-4 bottom-20 bg-white rounded-xl p-3 shadow-xl border border-border animate-fade-in delay-600 max-w-[180px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-lg bg-amber-light flex items-center justify-center">
                <Icon name="Clock" size={12} className="text-amber" />
              </span>
              <span className="font-body text-xs font-semibold">Сэкономлено</span>
            </div>
            <p className="font-body text-xs text-muted-foreground">2 часа 15 минут на подготовку</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Navbar, Hero };