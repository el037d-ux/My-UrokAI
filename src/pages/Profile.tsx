import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import Icon from "@/components/ui/icon";

const USER_STATUS_URL = "https://functions.poehali.dev/e173392a-d801-4fb1-8a22-1d4eae8245b0";
const AUTH_URL = "https://functions.poehali.dev/43173cf5-6a15-477a-b57b-72f11019ab4b";

const PLAN_LABELS: Record<string, string> = {
  free: "Бесплатный",
  "7days": "7 дней",
  "30days": "30 дней",
};

const PLAN_COLORS: Record<string, string> = {
  free: "bg-slate text-muted-foreground border-border",
  "7days": "bg-amber-light text-amber-700 border-amber-mid",
  "30days": "bg-indigo-light text-primary border-indigo-mid",
};

const TYPE_META: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  lesson: { label: "Урок", icon: "BookOpen", color: "text-primary", bg: "bg-indigo-light" },
  game: { label: "Игра", icon: "Gamepad2", color: "text-amber", bg: "bg-amber-light" },
  analysis: { label: "Анализ", icon: "BarChart2", color: "text-teal", bg: "bg-teal-light" },
};

type Tab = "profile" | "history" | "saved" | "settings";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "profile", label: "Профиль", icon: "User" },
  { id: "history", label: "История", icon: "Clock" },
  { id: "saved", label: "Сохранённые", icon: "Bookmark" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-indigo-light/30 to-teal-light/20">
      <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
}

function LoadingCard({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 flex items-center justify-center gap-3">
      <div className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <span className="font-body text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

function EmptyCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
        <Icon name={icon} fallback="BookOpen" size={24} className="text-muted-foreground" />
      </div>
      <div className="font-display text-base font-bold text-foreground mb-1">{title}</div>
      <p className="font-body text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 text-center">
      <Icon name="WifiOff" size={36} className="text-muted-foreground mx-auto mb-3" />
      <div className="font-body text-sm text-muted-foreground mb-4">Не удалось загрузить данные</div>
      <button onClick={onRetry} className="px-4 py-2 rounded-xl bg-primary text-white font-body text-sm font-medium">
        Повторить
      </button>
    </div>
  );
}

function StatCard({ icon, label, used, limit, color, bg, bar }: {
  icon: string; label: string; used: number; limit: number; color: string; bg: string; bar: string;
}) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const isUnlimited = limit >= 999;
  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
            <Icon name={icon} fallback="BookOpen" size={16} className={color} />
          </div>
          <span className="font-body text-sm font-semibold text-foreground">{label}</span>
        </div>
        <span className="font-body text-sm font-medium text-muted-foreground">
          {used} / {isUnlimited ? "∞" : limit}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${bar} rounded-full transition-all duration-700`}
          style={{ width: isUnlimited ? "0%" : `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ProfileTab() {
  const { status } = useUser();
  const navigate = useNavigate();
  if (!status) return null;
  const { plan, expires_at, usage, limits } = status;

  const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : null;

  const statsItems = [
    { label: "Уроков создано", icon: "BookOpen", used: usage.lessons, limit: limits.lessons, color: "text-primary", bg: "bg-indigo-light", bar: "bg-primary" },
    { label: "Игр создано", icon: "Gamepad2", used: usage.games, limit: limits.games, color: "text-amber", bg: "bg-amber-light", bar: "bg-amber" },
    { label: "Анализов", icon: "BarChart2", used: usage.analyses, limit: limits.analyses, color: "text-teal", bg: "bg-teal-light", bar: "bg-teal" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-indigo-light flex items-center justify-center">
            <Icon name="BarChart2" size={16} className="text-primary" />
          </div>
          <span className="font-display text-base font-bold text-foreground">Использование в этом месяце</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {statsItems.map((item) => <StatCard key={item.label} {...item} />)}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-amber-light flex items-center justify-center">
            <Icon name="Crown" size={16} className="text-amber" />
          </div>
          <span className="font-display text-base font-bold text-foreground">Подписка</span>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted border border-border mb-4">
          <span className={`px-3 py-1 rounded-full border text-xs font-body font-bold ${PLAN_COLORS[plan] || PLAN_COLORS.free}`}>
            {plan !== "free" && <Icon name="Crown" size={10} className="inline mr-1" />}
            {PLAN_LABELS[plan] || plan}
          </span>
          {expires_at && plan !== "free" ? (
            <span className="font-body text-sm text-muted-foreground">Действует до {formatDate(expires_at)}</span>
          ) : (
            <span className="font-body text-sm text-muted-foreground">
              {plan === "free" ? "Бесплатный план — ограниченный доступ" : ""}
            </span>
          )}
        </div>

        {plan === "free" && (
          <div className="grid sm:grid-cols-2 gap-3">
            <button onClick={() => navigate("/#payment")}
              className="p-4 rounded-2xl bg-amber-light border border-amber-mid hover:border-amber transition-all text-left group">
              <div className="font-display text-xl font-bold text-foreground group-hover:text-amber transition-colors">69 ₽</div>
              <div className="font-body text-sm font-semibold text-amber mt-0.5">7 дней</div>
              <ul className="mt-3 space-y-1.5">
                {["Безлимитные уроки", "Безлимитные игры", "Анализ ошибок"].map((f) => (
                  <li key={f} className="flex items-center gap-2 font-body text-xs text-foreground">
                    <Icon name="Check" size={12} className="text-amber flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </button>
            <button onClick={() => navigate("/#payment")}
              className="p-4 rounded-2xl bg-indigo-light border border-indigo-mid hover:border-primary transition-all text-left group">
              <div className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">260 ₽</div>
              <div className="font-body text-sm font-semibold text-primary mt-0.5">30 дней</div>
              <ul className="mt-3 space-y-1.5">
                {["Безлимитные уроки", "Безлимитные игры", "Анализ ошибок"].map((f) => (
                  <li key={f} className="flex items-center gap-2 font-body text-xs text-foreground">
                    <Icon name="Check" size={12} className="text-primary flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type HistoryItem = {
  id: number;
  type: string;
  title: string;
  prompt?: string;
  created_at: string;
};

function HistoryTab() {
  const { token } = useUser();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 10;

  const load = useCallback(async (p: number) => {
    if (!token) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${USER_STATUS_URL}?action=get_history&page=${p}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setItems(data.items);
        setTotal(data.total);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(page); }, [load, page]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  const totalPages = Math.ceil(total / PER_PAGE);

  if (loading) return <LoadingCard text="Загружаем историю..." />;
  if (error) return <ErrorCard onRetry={() => load(page)} />;
  if (items.length === 0) return (
    <EmptyCard icon="Clock" title="История пуста" desc="Здесь появятся созданные уроки, игры и анализы" />
  );

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
          </div>
          <span className="font-display text-base font-bold text-foreground">История активности</span>
        </div>
        <span className="font-body text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {total} записей
        </span>
      </div>
      <div className="divide-y divide-border">
        {items.map((item) => {
          const meta = TYPE_META[item.type] || TYPE_META.lesson;
          return (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors">
              <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon name={meta.icon} fallback="BookOpen" size={16} className={meta.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body text-sm font-semibold text-foreground truncate">{item.title}</div>
                {item.prompt && (
                  <div className="font-body text-xs text-muted-foreground mt-0.5 truncate">{item.prompt}</div>
                )}
                <div className="font-body text-xs text-muted-foreground mt-0.5">{meta.label}</div>
              </div>
              <div className="font-body text-xs text-muted-foreground flex-shrink-0">{formatDate(item.created_at)}</div>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border font-body text-xs text-muted-foreground disabled:opacity-40 hover:border-primary hover:text-primary transition-all"
          >
            <Icon name="ChevronLeft" size={14} /> Назад
          </button>
          <span className="font-body text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border font-body text-xs text-muted-foreground disabled:opacity-40 hover:border-primary hover:text-primary transition-all"
          >
            Далее <Icon name="ChevronRight" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

type SavedItem = {
  id: number;
  type: string;
  title: string;
  history_id?: number;
  created_at: string;
};

function SavedTab() {
  const { token } = useUser();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 10;

  const load = useCallback(async (p: number) => {
    if (!token) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${USER_STATUS_URL}?action=get_saved&page=${p}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setItems(data.items);
        setTotal(data.total);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(page); }, [load, page]);

  const handleUnsave = async (id: number) => {
    if (!token) return;
    setRemovingId(id);
    try {
      const res = await fetch(USER_STATUS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "unsave_material", id }),
      });
      const data = await res.json();
      if (data.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setTotal((t) => t - 1);
      }
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });

  const totalPages = Math.ceil(total / PER_PAGE);

  if (loading) return <LoadingCard text="Загружаем сохранённые..." />;
  if (error) return <ErrorCard onRetry={() => load(page)} />;
  if (items.length === 0) return (
    <EmptyCard icon="Bookmark" title="Нет сохранённых материалов" desc="Сохраняйте уроки, игры и анализы — они появятся здесь" />
  );

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-light flex items-center justify-center">
            <Icon name="Bookmark" size={16} className="text-primary" />
          </div>
          <span className="font-display text-base font-bold text-foreground">Сохранённые материалы</span>
        </div>
        <span className="font-body text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {total} материалов
        </span>
      </div>
      <div className="divide-y divide-border">
        {items.map((item) => {
          const meta = TYPE_META[item.type] || TYPE_META.lesson;
          return (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors group">
              <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon name={meta.icon} fallback="BookOpen" size={16} className={meta.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body text-sm font-semibold text-foreground truncate">{item.title}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs font-body font-medium px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
                    {meta.label}
                  </span>
                  <span className="font-body text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
                </div>
              </div>
              <button
                onClick={() => handleUnsave(item.id)}
                disabled={removingId === item.id}
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border font-body text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all disabled:opacity-50 flex-shrink-0"
                title="Убрать из сохранённых"
              >
                {removingId === item.id
                  ? <div className="w-3.5 h-3.5 rounded-full border-2 border-destructive/30 border-t-destructive animate-spin" />
                  : <Icon name="BookmarkX" size={14} />}
              </button>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border font-body text-xs text-muted-foreground disabled:opacity-40 hover:border-primary hover:text-primary transition-all"
          >
            <Icon name="ChevronLeft" size={14} /> Назад
          </button>
          <span className="font-body text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border font-body text-xs text-muted-foreground disabled:opacity-40 hover:border-primary hover:text-primary transition-all"
          >
            Далее <Icon name="ChevronRight" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  const { status, token, refreshStatus } = useUser();
  const [name, setName] = useState(status?.user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState("");

  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState("");

  const saveName = async () => {
    if (!name.trim()) { setNameError("Имя не может быть пустым"); return; }
    if (name.trim().length < 2) { setNameError("Минимум 2 символа"); return; }
    setNameError("");
    setNameLoading(true);
    setNameSuccess(false);
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action: "update_name", name: name.trim() }),
      });
      const data = await res.json();
      if (data.ok) { setNameSuccess(true); await refreshStatus(); setTimeout(() => setNameSuccess(false), 3000); }
      else setNameError(data.error || "Ошибка сохранения");
    } catch { setNameError("Ошибка соединения"); }
    finally { setNameLoading(false); }
  };

  const savePassword = async () => {
    if (!oldPwd) { setPwdError("Введите текущий пароль"); return; }
    if (newPwd.length < 6) { setPwdError("Новый пароль — минимум 6 символов"); return; }
    setPwdError("");
    setPwdLoading(true);
    setPwdSuccess(false);
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action: "change_password", old_password: oldPwd, new_password: newPwd }),
      });
      const data = await res.json();
      if (data.ok) { setPwdSuccess(true); setOldPwd(""); setNewPwd(""); setTimeout(() => setPwdSuccess(false), 3000); }
      else setPwdError(data.error || "Неверный текущий пароль");
    } catch { setPwdError("Ошибка соединения"); }
    finally { setPwdLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-indigo-light flex items-center justify-center">
            <Icon name="UserPen" size={16} className="text-primary" />
          </div>
          <span className="font-display text-base font-bold text-foreground">Имя профиля</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1.5 block">Отображаемое имя</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); setNameSuccess(false); }}
              placeholder="Введите имя"
              className={`w-full px-4 py-2.5 rounded-xl border font-body text-sm text-foreground bg-background outline-none transition-all ${nameError ? "border-destructive" : "border-border focus:border-primary"}`}
            />
            {nameError && <p className="font-body text-xs text-destructive mt-1.5">{nameError}</p>}
          </div>
          <button
            onClick={saveName}
            disabled={nameLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-body text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60"
          >
            {nameLoading
              ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Сохраняем...</>
              : nameSuccess
              ? <><Icon name="Check" size={15} /> Сохранено!</>
              : "Сохранить имя"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
            <Icon name="Lock" size={16} className="text-muted-foreground" />
          </div>
          <span className="font-display text-base font-bold text-foreground">Смена пароля</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1.5 block">Текущий пароль</label>
            <input
              type="password"
              value={oldPwd}
              onChange={(e) => { setOldPwd(e.target.value); setPwdError(""); setPwdSuccess(false); }}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-xl border font-body text-sm text-foreground bg-background outline-none transition-all ${pwdError ? "border-destructive" : "border-border focus:border-primary"}`}
            />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1.5 block">Новый пароль</label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => { setNewPwd(e.target.value); setPwdError(""); setPwdSuccess(false); }}
              placeholder="Минимум 6 символов"
              className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary font-body text-sm text-foreground bg-background outline-none transition-all"
            />
          </div>
          {pwdError && <p className="font-body text-xs text-destructive">{pwdError}</p>}
          <button
            onClick={savePassword}
            disabled={pwdLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-body text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-all active:scale-95 disabled:opacity-60"
          >
            {pwdLoading
              ? <><div className="w-4 h-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin" /> Меняем...</>
              : pwdSuccess
              ? <><Icon name="Check" size={15} className="text-primary" /> Пароль изменён!</>
              : <><Icon name="Lock" size={15} /> Изменить пароль</>}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-destructive/20 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Icon name="Mail" size={16} className="text-destructive" />
          </div>
          <span className="font-display text-base font-bold text-foreground">Аккаунт</span>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-1">
          Email: <span className="text-foreground font-medium">{status?.user?.email}</span>
        </p>
        <p className="font-body text-xs text-muted-foreground">Для смены email обратитесь в поддержку</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { status, token, loading, logout } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (!loading && !token) navigate("/");
  }, [loading, token, navigate]);

  if (loading || !status) return <Spinner />;

  const { user, plan } = status;

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-indigo-light/30 to-teal-light/20">
      <nav className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
              <Icon name="GraduationCap" size={16} className="text-white" />
            </span>
            <span className="font-display text-xl font-bold text-foreground tracking-tight">УрокАИ</span>
          </button>
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={15} /> На главную
          </button>
        </div>
      </nav>

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="bg-white rounded-3xl border border-border shadow-sm p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 flex-shrink-0">
            <span className="font-display text-2xl font-bold text-white">
              {(user?.name || user?.email || "?")[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-xl font-bold text-foreground truncate">{user?.name || "Пользователь"}</div>
            <div className="font-body text-sm text-muted-foreground mt-0.5 truncate">{user?.email}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2.5 py-0.5 rounded-full border text-xs font-body font-semibold ${PLAN_COLORS[plan] || PLAN_COLORS.free}`}>
                {plan !== "free" && <Icon name="Crown" size={10} className="inline mr-1" />}
                {PLAN_LABELS[plan] || plan}
              </span>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-body font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all flex-shrink-0">
            <Icon name="LogOut" size={15} /> <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>

        <div className="flex gap-1 p-1 bg-white rounded-2xl border border-border shadow-sm overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl font-body text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={t.icon} size={15} fallback="User" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === "profile" && <ProfileTab />}
        {tab === "history" && <HistoryTab />}
        {tab === "saved" && <SavedTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
