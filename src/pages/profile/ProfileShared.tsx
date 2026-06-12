import Icon from "@/components/ui/icon";

export const USER_STATUS_URL = "https://functions.poehali.dev/e173392a-d801-4fb1-8a22-1d4eae8245b0";
export const AUTH_URL = "https://functions.poehali.dev/43173cf5-6a15-477a-b57b-72f11019ab4b";
export const EXPORT_EXCEL_URL = "https://functions.poehali.dev/219a8e87-3ec1-4431-ae04-93709bd04b1f";
export const ADMIN_EMAIL = "el037d@gmail.com";

export const PLAN_LABELS: Record<string, string> = {
  free: "Бесплатный",
  "7days": "7 дней",
  "30days": "30 дней",
};

export const PLAN_COLORS: Record<string, string> = {
  free: "bg-slate text-muted-foreground border-border",
  "7days": "bg-amber-light text-amber-700 border-amber-mid",
  "30days": "bg-indigo-light text-primary border-indigo-mid",
};

export const TYPE_META: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  lesson: { label: "Урок", icon: "BookOpen", color: "text-primary", bg: "bg-indigo-light" },
  game: { label: "Игра", icon: "Gamepad2", color: "text-amber", bg: "bg-amber-light" },
  analysis: { label: "Анализ", icon: "BarChart2", color: "text-teal", bg: "bg-teal-light" },
};

export type Tab = "profile" | "history" | "saved" | "settings";

export const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "profile", label: "Профиль", icon: "User" },
  { id: "history", label: "История", icon: "Clock" },
  { id: "saved", label: "Сохранённые", icon: "Bookmark" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

export function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-indigo-light/30 to-teal-light/20">
      <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
}

export function LoadingCard({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm p-8 flex items-center justify-center gap-3">
      <div className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <span className="font-body text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

export function EmptyCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
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

export function ErrorCard({ onRetry }: { onRetry: () => void }) {
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

export function StatCard({ icon, label, used, limit, color, bg, bar }: {
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