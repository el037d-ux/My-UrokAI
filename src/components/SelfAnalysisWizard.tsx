import { useState } from "react";
import Icon from "@/components/ui/icon";

const ANALYSIS_URL = "https://functions.poehali.dev/acc2b019-de6d-4961-914e-394914e55d5a";

type Step = { id: string; label: string; icon: string };

const STEPS: Step[] = [
  { id: "subject", label: "Предмет и класс", icon: "BookOpen" },
  { id: "topic", label: "Тема и цель", icon: "Target" },
  { id: "method", label: "Технологии", icon: "Layers" },
  { id: "reflection", label: "Рефлексия", icon: "MessageSquare" },
];

type Analysis = {
  goal_analysis: string;
  content_analysis: string;
  method_analysis: string;
  student_activity: string;
  self_assessment: string;
  recommendations: string[];
};

function downloadAnalysis(analysis: Analysis, form: Record<string, string>) {
  const lines = [
    `САМОАНАЛИЗ УРОКА`,
    `Предмет: ${form.subject}, Класс: ${form.grade}`,
    `Тема: ${form.topic}`,
    ``,
    `АНАЛИЗ ЦЕЛИ`,
    analysis.goal_analysis,
    ``,
    `АНАЛИЗ СОДЕРЖАНИЯ`,
    analysis.content_analysis,
    ``,
    `АНАЛИЗ МЕТОДОВ`,
    analysis.method_analysis,
    ``,
    `АКТИВНОСТЬ УЧЕНИКОВ`,
    analysis.student_activity,
    ``,
    `САМООЦЕНКА`,
    analysis.self_assessment,
    ``,
    `РЕКОМЕНДАЦИИ`,
    ...analysis.recommendations.map((r, i) => `${i + 1}. ${r}`),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `самоанализ_${form.subject}_${form.grade}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function AnalysisResult({ analysis, form, onClose }: { analysis: Analysis; form: Record<string, string>; onClose: () => void }) {
  const sections = [
    { label: "📌 Анализ цели", text: analysis.goal_analysis },
    { label: "📚 Анализ содержания", text: analysis.content_analysis },
    { label: "🛠 Анализ методов", text: analysis.method_analysis },
    { label: "👥 Активность учеников", text: analysis.student_activity },
    { label: "🪞 Самооценка", text: analysis.self_assessment },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center pb-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-light flex items-center justify-center mx-auto mb-3">
          <Icon name="CheckCircle" size={24} className="text-teal" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">Самоанализ готов</h3>
        <p className="font-body text-sm text-muted-foreground mt-1">{form.subject} · {form.grade} · {form.topic}</p>
      </div>

      <div className="space-y-3 max-h-[42vh] overflow-y-auto pr-1">
        {sections.map((s) => (
          <div key={s.label} className="bg-slate rounded-2xl p-4">
            <div className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{s.label}</div>
            <p className="font-body text-sm text-foreground leading-relaxed">{s.text}</p>
          </div>
        ))}

        {analysis.recommendations?.length > 0 && (
          <div className="bg-indigo-light rounded-2xl p-4">
            <div className="font-body text-xs font-semibold text-primary uppercase tracking-wider mb-2">💡 Рекомендации</div>
            <ul className="space-y-1.5">
              {analysis.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground">
                  <Icon name="ChevronRight" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => downloadAnalysis(analysis, form)}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border font-body text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-all"
        >
          <Icon name="Download" size={15} /> Скачать
        </button>
        <button
          onClick={onClose}
          className="py-2.5 rounded-xl bg-primary text-white font-body text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

export default function SelfAnalysisWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({
    subject: "", grade: "", topic: "", goal: "",
    technologies: "", difficulties: "", achievements: "",
  });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const canNext = () => {
    if (step === 0) return form.subject.trim() && form.grade.trim();
    if (step === 1) return form.topic.trim() && form.goal.trim();
    if (step === 2) return form.technologies.trim();
    return form.difficulties.trim() && form.achievements.trim();
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(ANALYSIS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analysis", ...form }),
      });
      const data = await res.json();
      if (data.ok) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Ошибка генерации");
      }
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-border bg-slate font-body text-sm focus:outline-none focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground";
  const textareaCls = inputCls + " resize-none";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-fade-in-up overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-teal flex items-center justify-center shadow-md">
                <Icon name="BarChart2" size={16} className="text-white" />
              </span>
              <span className="font-display text-lg font-bold text-foreground">Самоанализ урока</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate flex items-center justify-center transition-colors">
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>

          {!analysis && (
            <div className="flex gap-1">
              {STEPS.map((s, i) => (
                <div key={s.id} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? "bg-teal" : "bg-slate"}`} />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {analysis ? (
            <AnalysisResult analysis={analysis} form={form} onClose={onClose} />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon name={STEPS[step].icon} size={16} className="text-teal" />
                <span className="font-display text-base font-bold text-foreground">{STEPS[step].label}</span>
                <span className="ml-auto font-body text-xs text-muted-foreground">{step + 1} / {STEPS.length}</span>
              </div>

              {step === 0 && (
                <>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Предмет</label>
                    <input className={inputCls} placeholder="Например: Математика" value={form.subject} onChange={(e) => set("subject", e.target.value)} />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Класс</label>
                    <input className={inputCls} placeholder="Например: 8А" value={form.grade} onChange={(e) => set("grade", e.target.value)} />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Тема урока</label>
                    <input className={inputCls} placeholder="Например: Теорема Пифагора" value={form.topic} onChange={(e) => set("topic", e.target.value)} />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Цель урока</label>
                    <textarea className={textareaCls} rows={3} placeholder="Чего должны достичь ученики?" value={form.goal} onChange={(e) => set("goal", e.target.value)} />
                  </div>
                </>
              )}

              {step === 2 && (
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Методы и технологии</label>
                  <textarea className={textareaCls} rows={4} placeholder="Какие методы, приёмы и технологии использовали?" value={form.technologies} onChange={(e) => set("technologies", e.target.value)} />
                </div>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Что получилось хорошо?</label>
                    <textarea className={textareaCls} rows={2} placeholder="Достижения урока..." value={form.achievements} onChange={(e) => set("achievements", e.target.value)} />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Что вызвало затруднения?</label>
                    <textarea className={textareaCls} rows={2} placeholder="Трудности и проблемы..." value={form.difficulties} onChange={(e) => set("difficulties", e.target.value)} />
                  </div>
                </>
              )}

              {error && (
                <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2">
                  <Icon name="AlertCircle" size={16} className="text-destructive flex-shrink-0" />
                  <span className="font-body text-sm text-destructive">{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                {step > 0 && (
                  <button onClick={() => setStep((s) => s - 1)} className="flex-1 py-2.5 rounded-xl border border-border font-body text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-all">
                    ← Назад
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button
                    disabled={!canNext()}
                    onClick={() => setStep((s) => s + 1)}
                    className="flex-1 py-2.5 rounded-xl bg-teal text-white font-body text-sm font-semibold hover:bg-teal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Далее →
                  </button>
                ) : (
                  <button
                    disabled={!canNext() || loading}
                    onClick={generate}
                    className="flex-1 py-2.5 rounded-xl bg-teal text-white font-body text-sm font-semibold hover:bg-teal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Анализируем...</>
                    ) : (
                      <><Icon name="BarChart2" size={15} /> Создать самоанализ</>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}