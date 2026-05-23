import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import Icon from "@/components/ui/icon";
import { PLAN_LABELS, PLAN_COLORS, StatCard } from "./ProfileShared";

export function ProfileTab() {
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
