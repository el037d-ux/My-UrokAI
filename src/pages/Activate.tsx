import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/43173cf5-6a15-477a-b57b-72f11019ab4b";

const PLAN_LABELS: Record<string, string> = {
  "7days": "7 дней",
  "30days": "30 дней",
};

type State = "loading" | "success" | "used" | "expired" | "error";

export default function Activate() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { login: _login } = useUser();
  const [state, setState] = useState<State>("loading");
  const [plan, setPlan] = useState("");
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (!token) { setState("error"); return; }

    fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "activate", token }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          localStorage.setItem("urok_token", data.token);
          setPlan(data.plan || "");
          setState("success");
          window.dispatchEvent(new Event("storage"));
        } else if (data.error?.includes("использована")) {
          setState("used");
        } else if (data.error?.includes("истёк") || data.error?.includes("истекла")) {
          setState("expired");
        } else {
          setState("error");
        }
      })
      .catch(() => setState("error"));
  }, [token]);

  useEffect(() => {
    if (state !== "success") return;
    if (seconds <= 0) { navigate("/"); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [state, seconds, navigate]);

  const configs: Record<State, { icon: string; iconBg: string; iconColor: string; title: string; text: string }> = {
    loading: { icon: "Loader2", iconBg: "bg-muted", iconColor: "text-muted-foreground", title: "Активируем подписку...", text: "Подождите несколько секунд" },
    success: { icon: "PartyPopper", iconBg: "bg-primary/10", iconColor: "text-primary", title: "Подписка активирована!", text: "" },
    used: { icon: "ShieldX", iconBg: "bg-destructive/10", iconColor: "text-destructive", title: "Ссылка уже использована", text: "Эта ссылка была активирована ранее. Войдите в аккаунт обычным способом." },
    expired: { icon: "Clock", iconBg: "bg-amber-light", iconColor: "text-amber", title: "Ссылка устарела", text: "Срок действия ссылки истёк (48 часов). Обратитесь в поддержку или создайте новую." },
    error: { icon: "CircleX", iconBg: "bg-destructive/10", iconColor: "text-destructive", title: "Что-то пошло не так", text: "Не удалось активировать ссылку. Возможно, она неверна или уже недействительна." },
  };

  const cfg = configs[state];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-indigo-light/30 to-teal-light/20 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl border border-border shadow-xl w-full max-w-md p-10 text-center animate-fade-in-up">

        <button onClick={() => navigate("/")} className="flex items-center gap-2 mx-auto mb-8 group">
          <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
            <Icon name="GraduationCap" size={16} className="text-white" />
          </span>
          <span className="font-display text-xl font-bold text-foreground tracking-tight">УрокАИ</span>
        </button>

        <div className={`w-20 h-20 rounded-2xl ${cfg.iconBg} flex items-center justify-center mx-auto mb-6 ${state === "loading" ? "animate-pulse" : ""}`}>
          <Icon name={cfg.icon} fallback="CircleX" size={36} className={`${cfg.iconColor} ${state === "loading" ? "animate-spin" : ""}`} />
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground mb-3">{cfg.title}</h1>

        {state === "success" ? (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-light border border-indigo-mid mb-4">
              <Icon name="Crown" size={13} className="text-primary" />
              <span className="font-body text-sm font-semibold text-primary">
                {PLAN_LABELS[plan] || plan}
              </span>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              Вы вошли в аккаунт. Все функции открыты!
            </p>
            <div className="mb-6 p-4 rounded-2xl bg-muted">
              <div className="font-body text-sm text-muted-foreground mb-2">Переход на главную через</div>
              <div className="font-display text-4xl font-bold text-primary">{seconds}</div>
            </div>
            <button onClick={() => navigate("/")}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-body font-bold text-sm hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2">
              <Icon name="Home" size={16} />
              На главную
            </button>
          </>
        ) : (
          <>
            {cfg.text && <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{cfg.text}</p>}
            {state !== "loading" && (
              <button onClick={() => navigate("/")}
                className="w-full py-3.5 rounded-xl bg-primary text-white font-body font-bold text-sm hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2">
                <Icon name="Home" size={16} />
                На главную
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
