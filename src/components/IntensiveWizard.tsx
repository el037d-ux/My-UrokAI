import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useUser } from "@/context/UserContext";

const GENERATE_URL = "https://functions.poehali.dev/acc2b019-de6d-4961-914e-394914e55d5a";
const USER_STATUS_URL = "https://functions.poehali.dev/e173392a-d801-4fb1-8a22-1d4eae8245b0";

const FORMAT_OPTIONS = ["Интенсив", "Мастер-класс", "Воркшоп", "Тренинг", "Семинар"];
const LEVEL_OPTIONS = ["Новички", "Средний уровень", "Продвинутый", "Смешанный"];
const DURATION_OPTIONS = ["1 час", "1.5 часа", "2 часа", "3 часа", "4 часа", "6 часов", "1 день", "2 дня"];
const FORMAT_CONDUCT = ["Офлайн", "Онлайн", "Смешанный"];

type IntensivePlan = {
  title: string;
  slogan: string;
  format: string;
  duration: string;
  audience: string;
  goals: { educational: string; developmental: string; personal: string };
  expected_results: string[];
  facilitator_competencies: string[];
  program: Array<{
    block: string;
    duration: string;
    content: string;
    methods: string;
    materials: string;
    facilitator_role: string;
    participant_role: string;
  }>;
  interactive_elements: Array<{ type: string; description: string }>;
  equipment: { hardware: string[]; digital_tools: string[]; handouts: string[] };
  assessment: { success_criteria: string; feedback_forms: string[]; skill_evaluation: string };
  highlights: { attention_tricks: string[]; homework: string; online_adaptation: string; risks: Array<{ risk: string; prevention: string }> };
};

function downloadIntensive(plan: IntensivePlan, form: Record<string, string>) {
  const lines = [
    `${plan.format?.toUpperCase() || "ИНТЕНСИВ"}: ${plan.title}`,
    `"${plan.slogan}"`,
    ``,
    `Аудитория: ${form.audience}  |  Длительность: ${form.duration}  |  Формат: ${form.conduct}`,
    ``,
    `== ЦЕЛИ ==`,
    `Образовательная: ${plan.goals?.educational}`,
    `Развивающая: ${plan.goals?.developmental}`,
    `Воспитательная: ${plan.goals?.personal}`,
    ``,
    `== ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ ==`,
    ...(plan.expected_results || []).map((r, i) => `${i + 1}. ${r}`),
    ``,
    `== ПРОГРАММА ==`,
    ...(plan.program || []).map(b => [
      `\n[${b.block} — ${b.duration}]`,
      `Содержание: ${b.content}`,
      `Методы: ${b.methods}`,
      `Материалы: ${b.materials}`,
      `Ведущий: ${b.facilitator_role}`,
      `Участники: ${b.participant_role}`,
    ].join("\n")),
    ``,
    `== ИНТЕРАКТИВ ==`,
    ...(plan.interactive_elements || []).map(e => `• ${e.type}: ${e.description}`),
    ``,
    `== ОБОРУДОВАНИЕ ==`,
    `Техника: ${(plan.equipment?.hardware || []).join(", ")}`,
    `Цифровые инструменты: ${(plan.equipment?.digital_tools || []).join(", ")}`,
    `Раздатка: ${(plan.equipment?.handouts || []).join(", ")}`,
    ``,
    `== ОЦЕНКА РЕЗУЛЬТАТОВ ==`,
    `Критерии успеха: ${plan.assessment?.success_criteria}`,
    `Обратная связь: ${(plan.assessment?.feedback_forms || []).join(", ")}`,
    ``,
    `== ФИШКИ ==`,
    ...(plan.highlights?.attention_tricks || []).map(t => `★ ${t}`),
    ``,
    `ДЗ/продолжение: ${plan.highlights?.homework}`,
    `Онлайн-адаптация: ${plan.highlights?.online_adaptation}`,
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${plan.format || "интенсив"}_${plan.title?.slice(0, 30)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function ProgramBlock({ block, idx }: { block: IntensivePlan["program"][0]; idx: number }) {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate hover:bg-slate/80 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-light border border-indigo-mid flex items-center justify-center font-body text-xs font-bold text-primary flex-shrink-0">{idx + 1}</span>
          <span className="font-body text-sm font-semibold text-foreground">{block.block}</span>
          <span className="font-body text-xs text-muted-foreground">— {block.duration}</span>
        </div>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={14} className="text-muted-foreground flex-shrink-0" />
      </button>
      {open && (
        <div className="px-4 py-3 space-y-2 bg-white">
          {[
            ["Содержание", block.content],
            ["Методы", block.methods],
            ["Материалы", block.materials],
            ["Ведущий", block.facilitator_role],
            ["Участники", block.participant_role],
          ].map(([label, text]) => text ? (
            <div key={label}>
              <span className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}: </span>
              <span className="font-body text-sm text-foreground">{text}</span>
            </div>
          ) : null)}
        </div>
      )}
    </div>
  );
}

function IntensiveResult({ plan, form, token, onClose, onPayment }: {
  plan: IntensivePlan; form: Record<string, string>;
  token: string | null; onClose: () => void; onPayment?: () => void;
}) {
  const [tab, setTab] = useState<"program" | "interactive" | "equipment" | "assessment" | "highlights">("program");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!token || saving || saved) return;
    setSaving(true);
    try {
      await fetch(USER_STATUS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          action: "save_material",
          type: "intensive",
          title: plan.title,
          content: JSON.stringify(plan),
        }),
      });
      setSaved(true);
    } catch { /* не критично */ } finally { setSaving(false); }
  };

  const tabs = [
    ["program", "MapPin", "Программа"],
    ["interactive", "Zap", "Интерактив"],
    ["equipment", "Package", "Обеспечение"],
    ["assessment", "CheckSquare", "Оценка"],
    ["highlights", "Sparkles", "Фишки"],
  ] as const;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[95vh] sm:h-[90vh] flex flex-col animate-fade-in-up overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-md bg-indigo-light flex items-center justify-center flex-shrink-0">
                  <Icon name="Zap" size={12} className="text-primary" />
                </span>
                <span className="font-body text-xs font-semibold text-primary uppercase tracking-wider">{plan.format} готов</span>
              </div>
              <h2 className="font-display text-lg font-bold text-foreground leading-tight">{plan.title}</h2>
              {plan.slogan && <p className="font-body text-xs text-muted-foreground mt-0.5 italic">«{plan.slogan}»</p>}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-indigo-light border border-indigo-mid font-body text-xs text-primary">{form.format}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate font-body text-xs text-muted-foreground">{form.audience?.slice(0, 20)}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-light border border-amber-mid font-body text-xs text-amber-700">⏱ {form.duration}</span>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate flex items-center justify-center flex-shrink-0 transition-colors">
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 bg-slate rounded-xl p-1 overflow-x-auto">
            {tabs.map(([key, icon, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex-shrink-0 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg font-body text-xs font-semibold transition-all ${tab === key ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <Icon name={icon} size={11} />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 space-y-3">

          {tab === "program" && (
            <>
              {/* Goals */}
              {plan.goals && (
                <div className="bg-indigo-light rounded-2xl p-4">
                  <div className="font-body text-xs font-semibold text-primary uppercase tracking-wider mb-2">Цели</div>
                  <div className="space-y-1">
                    {[["📚 Образовательная", plan.goals.educational], ["🌱 Развивающая", plan.goals.developmental], ["❤️ Воспитательная", plan.goals.personal]].map(([l, v]) => (
                      <p key={l} className="font-body text-sm text-foreground"><span className="font-semibold">{l}:</span> {v}</p>
                    ))}
                  </div>
                </div>
              )}
              {/* Results */}
              {plan.expected_results?.length > 0 && (
                <div className="bg-teal-light rounded-2xl p-4">
                  <div className="font-body text-xs font-semibold text-teal uppercase tracking-wider mb-2">Ожидаемые результаты</div>
                  <ul className="space-y-1">
                    {plan.expected_results.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground">
                        <Icon name="CheckCircle" size={13} className="text-teal mt-0.5 flex-shrink-0" />{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Program blocks */}
              <div className="space-y-2">
                <div className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">Программа по блокам</div>
                {(plan.program || []).map((b, i) => <ProgramBlock key={i} block={b} idx={i} />)}
              </div>
            </>
          )}

          {tab === "interactive" && (
            <div className="space-y-3">
              {(plan.interactive_elements || []).map((el, i) => (
                <div key={i} className="bg-slate rounded-2xl p-4">
                  <div className="font-body text-xs font-semibold text-primary uppercase tracking-wider mb-1">{el.type}</div>
                  <p className="font-body text-sm text-foreground">{el.description}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "equipment" && (
            <div className="space-y-3">
              {[
                ["Оборудование", "Monitor", plan.equipment?.hardware],
                ["Цифровые инструменты", "Globe", plan.equipment?.digital_tools],
                ["Раздаточные материалы", "Printer", plan.equipment?.handouts],
              ].map(([label, icon, items]) => (items as string[])?.length > 0 && (
                <div key={label as string} className="bg-slate rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={icon as string} size={14} className="text-primary" />
                    <span className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label as string}</span>
                  </div>
                  <ul className="space-y-1">
                    {(items as string[]).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground">
                        <Icon name="ChevronRight" size={12} className="text-primary mt-1 flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {tab === "assessment" && (
            <div className="space-y-3">
              {plan.assessment?.success_criteria && (
                <div className="bg-teal-light rounded-2xl p-4">
                  <div className="font-body text-xs font-semibold text-teal uppercase tracking-wider mb-1">Критерии успеха</div>
                  <p className="font-body text-sm text-foreground">{plan.assessment.success_criteria}</p>
                </div>
              )}
              {plan.assessment?.feedback_forms?.length > 0 && (
                <div className="bg-slate rounded-2xl p-4">
                  <div className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Формы обратной связи</div>
                  <ul className="space-y-1">
                    {plan.assessment.feedback_forms.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground">
                        <Icon name="MessageSquare" size={12} className="text-primary mt-1 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {plan.assessment?.skill_evaluation && (
                <div className="bg-slate rounded-2xl p-4">
                  <div className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Оценка навыков</div>
                  <p className="font-body text-sm text-foreground">{plan.assessment.skill_evaluation}</p>
                </div>
              )}
            </div>
          )}

          {tab === "highlights" && (
            <div className="space-y-3">
              {plan.highlights?.attention_tricks?.length > 0 && (
                <div className="bg-amber-light rounded-2xl p-4">
                  <div className="font-body text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Приёмы удержания внимания</div>
                  <ul className="space-y-1">
                    {plan.highlights.attention_tricks.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground">
                        <span className="text-amber-600 mt-0.5">★</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {plan.highlights?.homework && (
                <div className="bg-slate rounded-2xl p-4">
                  <div className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">ДЗ / продолжение</div>
                  <p className="font-body text-sm text-foreground">{plan.highlights.homework}</p>
                </div>
              )}
              {plan.highlights?.online_adaptation && (
                <div className="bg-slate rounded-2xl p-4">
                  <div className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Онлайн-адаптация</div>
                  <p className="font-body text-sm text-foreground">{plan.highlights.online_adaptation}</p>
                </div>
              )}
              {plan.highlights?.risks?.length > 0 && (
                <div className="bg-slate rounded-2xl p-4">
                  <div className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Риски и профилактика</div>
                  <div className="space-y-2">
                    {plan.highlights.risks.map((r, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Icon name="AlertTriangle" size={13} className="text-amber mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-body text-sm font-semibold text-foreground">{r.risk}: </span>
                          <span className="font-body text-sm text-muted-foreground">{r.prevention}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-border flex gap-2 flex-shrink-0">
          {token && (
            <button onClick={handleSave} disabled={saved || saving}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border font-body text-sm font-semibold transition-all ${saved ? "bg-teal-light border-teal/30 text-teal" : "border-border text-foreground hover:border-primary hover:text-primary"} disabled:opacity-60`}>
              {saving ? <div className="w-4 h-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin" /> : <Icon name={saved ? "BookmarkCheck" : "Bookmark"} size={15} />}
              {saved ? "Сохранено" : "Сохранить"}
            </button>
          )}
          <button onClick={() => downloadIntensive(plan, form)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white font-body text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-md shadow-primary/25">
            <Icon name="Download" size={15} />Скачать программу
          </button>
        </div>
      </div>
    </div>
  );
}

const STEPS = ["Формат", "Аудитория", "Цели"];

export default function IntensiveWizard({ onClose, onPayment }: { onClose: () => void; onPayment?: () => void }) {
  const { token, incrementUsage } = useUser();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    format: "", duration: "", conduct: "", participants: "",
    audience: "", level: "", goal: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<IntensivePlan | null>(null);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return !!form.format && !!form.duration && !!form.conduct;
    if (step === 1) return !!form.audience.trim() && !!form.participants.trim();
    return !!form.goal.trim();
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(GENERATE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ action: "intensive", ...form }),
      });
      const data = await res.json();
      if (data.limit_exceeded) { onClose(); onPayment?.(); return; }
      if (data.ok && data.plan) {
        setPlan(data.plan);
        await incrementUsage("lessons");
        if (token) {
          try {
            await fetch(USER_STATUS_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                action: "add_history", type: "intensive",
                title: data.plan.title,
                prompt: `${form.format}, ${form.audience}, ${form.goal}`,
                result: JSON.stringify(data.plan),
              }),
            });
          } catch { /* не критично */ }
        }
      } else {
        setError("Не удалось создать программу. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка соединения.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-border bg-slate font-body text-sm focus:outline-none focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground";
  const textareaCls = inputCls + " resize-none";

  if (plan) return <IntensiveResult plan={plan} form={form} token={token} onClose={onClose} onPayment={onPayment} />;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-fade-in-up overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-indigo-light flex items-center justify-center shadow-md">
                <Icon name="Zap" size={16} className="text-primary" />
              </span>
              <span className="font-display text-lg font-bold text-foreground">Генератор интенсива</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate flex items-center justify-center transition-colors">
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>
          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-slate"}`} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display text-base font-bold text-foreground">{STEPS[step]}</span>
            <span className="ml-auto font-body text-xs text-muted-foreground">{step + 1} / {STEPS.length}</span>
          </div>

          {step === 0 && (
            <>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Формат мероприятия</label>
                <div className="flex flex-wrap gap-2">
                  {FORMAT_OPTIONS.map(f => (
                    <button key={f} onClick={() => set("format", f)}
                      className={`px-3 py-1.5 rounded-xl border font-body text-sm font-medium transition-all ${form.format === f ? "bg-primary text-white border-primary" : "border-border text-foreground hover:border-primary/40 bg-white"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Длительность</label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map(d => (
                    <button key={d} onClick={() => set("duration", d)}
                      className={`px-3 py-1.5 rounded-xl border font-body text-sm font-medium transition-all ${form.duration === d ? "bg-primary text-white border-primary" : "border-border text-foreground hover:border-primary/40 bg-white"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Формат проведения</label>
                <div className="flex gap-2">
                  {FORMAT_CONDUCT.map(c => (
                    <button key={c} onClick={() => set("conduct", c)}
                      className={`flex-1 px-3 py-2 rounded-xl border font-body text-sm font-medium transition-all ${form.conduct === c ? "bg-primary text-white border-primary" : "border-border text-foreground hover:border-primary/40 bg-white"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Целевая аудитория</label>
                <textarea className={textareaCls} rows={2} placeholder="Например: педагоги начальной школы, HR-специалисты, студенты 3 курса" value={form.audience} onChange={e => set("audience", e.target.value)} />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Количество участников</label>
                <input className={inputCls} placeholder="Например: 15–20 человек" value={form.participants} onChange={e => set("participants", e.target.value)} />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Уровень подготовки</label>
                <div className="flex flex-wrap gap-2">
                  {LEVEL_OPTIONS.map(l => (
                    <button key={l} onClick={() => set("level", l)}
                      className={`px-3 py-1.5 rounded-xl border font-body text-sm font-medium transition-all ${form.level === l ? "bg-primary text-white border-primary" : "border-border text-foreground hover:border-primary/40 bg-white"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Цель занятия</label>
              <textarea className={textareaCls} rows={5} placeholder="Чему должны научиться участники? Какой результат вы хотите получить? Например: участники научатся создавать эффективные презентации и смогут применить это в работе уже на следующей неделе" value={form.goal} onChange={e => set("goal", e.target.value)} />
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2">
              <Icon name="AlertCircle" size={15} className="text-destructive flex-shrink-0" />
              <span className="font-body text-sm text-destructive">{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="flex-1 py-2.5 rounded-xl border border-border font-body text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-all">
                ← Назад
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button disabled={!canNext()} onClick={() => setStep(s => s + 1)}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white font-body text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Далее →
              </button>
            ) : (
              <button disabled={!canNext() || loading} onClick={generate}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white font-body text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Создаём программу...</>
                ) : (
                  <><Icon name="Zap" size={15} />Создать программу</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
