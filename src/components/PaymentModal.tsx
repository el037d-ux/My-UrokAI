import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useUser } from "@/context/UserContext";

const SBP_BASE = "https://t.tb.ru/c2c-qr-choose-bank?requisiteNumber=+79083287309&bankCode=100000000004";

const PLANS = [
  { id: "7days", label: "7 дней", price: 69, desc: "Доступ ко всем функциям на неделю", highlight: false },
  { id: "30days", label: "30 дней", price: 260, desc: "Полный доступ на месяц — выгоднее", highlight: true },
];

const AUTH_URL = "https://functions.poehali.dev/43173cf5-6a15-477a-b57b-72f11019ab4b";

type Step = "plan" | "email" | "done";

export default function PaymentModal({ onClose }: { onClose: () => void }) {
  const { status } = useUser();
  const [step, setStep] = useState<Step>("plan");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [email, setEmail] = useState(status?.user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultLink, setResultLink] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setStep("email");
  };

  const handleSendLink = async () => {
    setError("");
    if (!email.trim() || !email.includes("@")) { setError("Введите корректный email"); return; }
    setLoading(true);
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_payment_link", email: email.trim().toLowerCase(), plan: selectedPlan }),
      });
      const data = await res.json();
      if (data.ok) {
        setResultLink(data.link);
        setEmailSent(data.email_sent);
        setStep("done");
      } else {
        setError(data.error || "Ошибка генерации ссылки");
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  const plan = PLANS.find(p => p.id === selectedPlan);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-fade-in-up" onClick={e => e.stopPropagation()}>

        <div className="px-8 pt-7 pb-5 border-b border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-md bg-primary flex items-center justify-center">
                <Icon name="Crown" size={12} className="text-white" />
              </span>
              <span className="font-body text-xs font-semibold text-primary uppercase tracking-wider">Подписка</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {step === "plan" && "Выберите тариф"}
              {step === "email" && "Куда отправить ссылку?"}
              {step === "done" && "Ссылка готова!"}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate flex items-center justify-center transition-colors">
            <Icon name="X" size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-5">

          {step === "plan" && (
            <>
              <div className="p-4 rounded-2xl bg-indigo-light border border-indigo-mid">
                <div className="font-body text-xs font-semibold text-primary uppercase tracking-wider mb-2">С подпиской доступно</div>
                <ul className="space-y-1.5">
                  {["Неограниченные планы уроков", "Неограниченные игры", "Самоанализ урока", "Приоритетная поддержка"].map(f => (
                    <li key={f} className="flex items-center gap-2 font-body text-sm text-foreground">
                      <Icon name="Check" size={14} className="text-teal flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>

              {PLANS.map(p => (
                <div key={p.id} className={`rounded-2xl border-2 p-5 ${p.highlight ? "border-primary bg-indigo-light/30" : "border-border"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xl font-bold text-foreground">{p.label}</span>
                        {p.highlight && <span className="px-2 py-0.5 rounded-full bg-primary text-white font-body text-xs font-semibold">Выгодно</span>}
                      </div>
                      <p className="font-body text-sm text-muted-foreground mt-0.5">{p.desc}</p>
                    </div>
                    <div className="font-display text-3xl font-bold text-primary">{p.price}₽</div>
                  </div>

                  <div className="pt-3 border-t border-border space-y-3">
                    <div className="flex flex-col items-center gap-2">
                      <div className="font-body text-xs text-muted-foreground">Оплатите через СБП, затем получите ссылку для входа</div>
                      <div className="p-2 rounded-2xl border border-border bg-white shadow-sm">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`${SBP_BASE}&amount=${p.price * 100}`)}&bgcolor=ffffff&color=000000&qzone=2`}
                          alt={`QR ${p.label}`}
                          className="w-[160px] h-[160px]"
                        />
                      </div>
                    </div>
                    <a href={`${SBP_BASE}&amount=${p.price * 100}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#FFDD2D] text-[#333] font-body font-bold text-sm hover:bg-[#f5d400] transition-all active:scale-95 shadow-sm">
                      <Icon name="CreditCard" size={16} />
                      Оплатить {p.price}₽ через СБП
                    </a>
                    <button onClick={() => handleSelectPlan(p.id)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-primary text-primary font-body font-bold text-sm hover:bg-primary/5 transition-all active:scale-95">
                      <Icon name="Mail" size={15} />
                      Оплатил — получить ссылку для входа
                    </button>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-2xl bg-slate border border-border text-center">
                <div className="font-body text-sm font-semibold text-foreground mb-1">Бесплатно всегда</div>
                <div className="font-body text-xs text-muted-foreground">3 плана урока · 3 игры · без самоанализа</div>
              </div>
            </>
          )}

          {step === "email" && plan && (
            <>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-light border border-indigo-mid">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <Icon name="Crown" size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-body text-sm font-bold text-foreground">Тариф: {plan.label}</div>
                  <div className="font-body text-xs text-muted-foreground">{plan.price}₽ · после оплаты через СБП</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-light border border-amber-mid">
                <div className="flex items-start gap-2">
                  <Icon name="Info" size={15} className="text-amber flex-shrink-0 mt-0.5" />
                  <p className="font-body text-xs text-foreground leading-relaxed">
                    Введите email — мы отправим уникальную ссылку. После перехода по ней вы автоматически войдёте и подписка активируется. Ссылка действует <strong>48 часов</strong>.
                  </p>
                </div>
              </div>

              <div>
                <label className="font-body text-xs text-muted-foreground mb-1.5 block">Ваш email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="teacher@school.ru"
                  onKeyDown={e => e.key === "Enter" && handleSendLink()}
                  className={`w-full px-4 py-3 rounded-xl border font-body text-sm outline-none transition-all ${error ? "border-destructive" : "border-border focus:border-primary"}`}
                />
                {error && <p className="font-body text-xs text-destructive mt-1.5">{error}</p>}
              </div>

              <button onClick={handleSendLink} disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary text-white font-body font-bold text-sm hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading
                  ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Отправляем...</>
                  : <><Icon name="Send" size={16} /> Отправить ссылку</>}
              </button>

              <button onClick={() => setStep("plan")}
                className="w-full py-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5">
                <Icon name="ArrowLeft" size={14} /> Назад к тарифам
              </button>
            </>
          )}

          {step === "done" && (
            <>
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon name={emailSent ? "MailCheck" : "Link"} size={32} className="text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {emailSent ? "Письмо отправлено!" : "Ссылка создана!"}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {emailSent
                    ? <>Проверьте почту <strong className="text-foreground">{email}</strong>. Нажмите на ссылку в письме — вы автоматически войдёте и подписка активируется.</>
                    : "Используйте ссылку ниже для активации подписки."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted border border-border">
                <div className="font-body text-xs text-muted-foreground mb-2">Ссылка для активации (действует 48 ч):</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-body text-xs text-foreground break-all">{resultLink}</code>
                  <button onClick={() => navigator.clipboard.writeText(resultLink)}
                    className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center hover:border-primary transition-all">
                    <Icon name="Copy" size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              <a href={resultLink}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary text-white font-body font-bold text-sm hover:bg-primary/90 transition-all active:scale-95">
                <Icon name="LogIn" size={16} />
                Активировать сейчас
              </a>

              <div className="p-3 rounded-xl bg-amber-light border border-amber-mid">
                <p className="font-body text-xs text-foreground text-center">
                  Если письмо не пришло — проверьте папку «Спам»
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}