import { useState } from "react";
import Icon from "@/components/ui/icon";

const ANALYSIS_URL = "https://functions.poehali.dev/a0cc3d7b-8fde-40d8-8f4a-4f526582751f";

const STEPS = [
  { label: "Предмет и класс", icon: "BookOpen" },
  { label: "Тема и цель", icon: "Target" },
  { label: "Технология", icon: "Layers" },
  { label: "Рефлексия", icon: "MessageSquare" },
];

const CLASS_OPTIONS = ["1 класс","2 класс","3 класс","4 класс","5 класс","6 класс","7 класс","8 класс","9 класс","10 класс","11 класс","Студенты / взрослые"];
const SUBJECTS = ["Биология","История","Математика","Русский язык","Физика","Химия","Литература","География","Информатика","Английский язык"];
const ACTIVITY_OPTIONS = ["Очень высокая","Высокая","Средняя","Низкая"];
const GOAL_OPTIONS = ["Да, полностью","Да, частично","Нет, не достигнута"];

type Analysis = {
  title: string;
  subject: string;
  grade: string;
  topic: string;
  goal_analysis: string;
  content_analysis: string;
  methods_analysis: string;
  student_activity_analysis: string;
  achievements: string[];
  difficulties: string[];
  improvement_suggestions: string[];
  self_assessment: string;
  rating: number;
};

function downloadAnalysis(a: Analysis) {
  const sep = "=".repeat(60);
  const lines = [
    sep, a.title, sep,
    `Предмет: ${a.subject} | Класс: ${a.grade}`, `Тема: ${a.topic}`, "",
    "АНАЛИЗ ЦЕЛИ:", a.goal_analysis, "",
    "АНАЛИЗ СОДЕРЖАНИЯ:", a.content_analysis, "",
    "АНАЛИЗ МЕТОДОВ:", a.methods_analysis, "",
    "АКТИВНОСТЬ УЧЕНИКОВ:", a.student_activity_analysis, "",
    sep, "ДОСТИЖЕНИЯ:", sep,
    ...a.achievements.map((x, i) => `${i + 1}. ${x}`), "",
    sep, "ЗАТРУДНЕНИЯ:", sep,
    ...a.difficulties.map((x, i) => `${i + 1}. ${x}`), "",
    sep, "РЕКОМЕНДАЦИИ:", sep,
    ...a.improvement_suggestions.map((x, i) => `${i + 1}. ${x}`), "",
    sep, "САМООЦЕНКА:", sep,
    a.self_assessment,
    `\nОценка урока: ${"★".repeat(a.rating)}${"☆".repeat(5 - a.rating)} (${a.rating}/5)`,
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a2 = document.createElement("a");
  a2.href = url;
  a2.download = `самоанализ_${a.topic.slice(0, 30)}.txt`;
  a2.click();
  URL.revokeObjectURL(url);
}

function AnalysisResult({ analysis, onClose }: { analysis: Analysis; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="px-8 pt-7 pb-5 border-b border-border flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-md bg-teal flex items-center justify-center">
                  <Icon name="FileText" size={12} className="text-white" />
                </span>
                <span className="font-body text-xs font-semibold text-teal uppercase tracking-wider">Самоанализ готов</span>
              </div>
              <h2 className="font-display text-xl font-bold text-foreground leading-tight">{analysis.title}</h2>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="Star" size={14} className={i < analysis.rating ? "text-amber" : "text-slate-mid"} />
                ))}
                <span className="font-body text-xs text-muted-foreground ml-1">{analysis.rating}/5</span>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate flex items-center justify-center transition-colors flex-shrink-0">
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-5">
          {[
            { label: "Анализ цели", text: analysis.goal_analysis, color: "bg-indigo-light border-indigo-mid text-primary" },
            { label: "Анализ содержания", text: analysis.content_analysis, color: "bg-slate border-border text-foreground" },
            { label: "Анализ методов", text: analysis.methods_analysis, color: "bg-teal-light border-teal/20 text-teal" },
            { label: "Активность учеников", text: analysis.student_activity_analysis, color: "bg-amber-light border-amber-mid text-amber" },
          ].map(({ label, text, color }) => (
            <div key={label} className={`p-4 rounded-2xl border ${color.split(" ")[0]} ${color.split(" ")[1]}`}>
              <div className={`font-body text-xs font-semibold uppercase tracking-wider mb-1 ${color.split(" ")[2]}`}>{label}</div>
              <p className="font-body text-sm text-foreground leading-relaxed">{text}</p>
            </div>
          ))}

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="font-body text-xs font-semibold text-teal uppercase tracking-wider mb-2">Достижения</div>
              <ul className="space-y-1.5">
                {analysis.achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={14} className="text-teal flex-shrink-0 mt-0.5" />
                    <span className="font-body text-xs text-foreground">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-body text-xs font-semibold text-amber uppercase tracking-wider mb-2">Затруднения</div>
              <ul className="space-y-1.5">
                {analysis.difficulties.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Icon name="AlertCircle" size={14} className="text-amber flex-shrink-0 mt-0.5" />
                    <span className="font-body text-xs text-foreground">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-body text-xs font-semibold text-primary uppercase tracking-wider mb-2">Рекомендации</div>
              <ul className="space-y-1.5">
                {analysis.improvement_suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Icon name="Lightbulb" size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    <span className="font-body text-xs text-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate border border-border">
            <div className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Самооценка</div>
            <p className="font-body text-sm text-foreground leading-relaxed">{analysis.self_assessment}</p>
          </div>
        </div>

        <div className="px-8 py-4 border-t border-border flex-shrink-0">
          <button
            onClick={() => downloadAnalysis(analysis)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal text-white font-body text-sm font-bold hover:bg-teal/90 transition-all active:scale-95 shadow-md shadow-teal/25"
          >
            <Icon name="Download" size={16} />
            Скачать самоанализ
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SelfAnalysisWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const [form, setForm] = useState({
    subject: "", grade: "", topic: "", goal: "", technology: "",
    what_went_well: "", what_was_hard: "", student_activity: "", goal_achieved: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const goTo = (next: number, dir: "next" | "prev") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => { setStep(next); setAnimating(false); }, 220);
  };

  const handleNext = async () => {
    if (step < 4) { goTo(step + 1, "next"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(ANALYSIS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setError("Не удалось создать самоанализ. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка соединения.");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!form.subject && !!form.grade;
    if (step === 2) return !!form.topic.trim() && !!form.goal.trim();
    if (step === 3) return !!form.technology.trim();
    if (step === 4) return !!form.student_activity && !!form.goal_achieved;
    return true;
  };

  const progress = (step / 4) * 100;
  const slideClass = animating
    ? direction === "next" ? "opacity-0 translate-x-4" : "opacity-0 -translate-x-4"
    : "opacity-100 translate-x-0";

  if (analysis) return <AnalysisResult analysis={analysis} onClose={onClose} />;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-fade-in-up overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-teal flex items-center justify-center shadow-md shadow-teal/30">
                <Icon name="FileText" size={16} className="text-white" />
              </span>
              <span className="font-display text-lg font-bold text-foreground">Самоанализ урока</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate flex items-center justify-center transition-colors">
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>

          <div className="h-2 bg-slate rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal to-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i + 1 < step ? "bg-teal" : i + 1 === step ? "bg-teal scale-150" : "bg-slate-mid"}`} />
            ))}
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className={`transition-all duration-200 ease-out ${slideClass}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center">
                <Icon name={STEPS[step - 1].icon} fallback="BookOpen" size={20} className="text-teal" />
              </div>
              <div>
                <div className="font-body text-xs text-muted-foreground uppercase tracking-wider">Шаг {step} из 4</div>
                <div className="font-display text-xl font-bold text-foreground">{STEPS[step - 1].label}</div>
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Предмет</label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map(s => (
                      <button key={s} onClick={() => setForm(f => ({ ...f, subject: s }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-body border transition-all ${form.subject === s ? "bg-teal text-white border-teal" : "bg-white border-border text-muted-foreground hover:border-teal/40 hover:bg-teal-light"}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Класс</label>
                  <div className="grid grid-cols-4 gap-2">
                    {CLASS_OPTIONS.map(c => (
                      <button key={c} onClick={() => setForm(f => ({ ...f, grade: c }))}
                        className={`px-2 py-2 rounded-xl text-xs font-body font-medium border transition-all ${form.grade === c ? "bg-teal text-white border-teal" : "bg-white border-border text-foreground hover:border-teal/40"}`}
                      >{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Тема урока</label>
                  <input type="text" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} autoFocus
                    placeholder="Например: Фотосинтез" className="w-full px-4 py-3 rounded-xl border border-border bg-slate font-body text-sm focus:outline-none focus:border-teal/40 focus:bg-white focus:ring-2 focus:ring-teal/10 transition-all placeholder:text-muted-foreground" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Цель урока</label>
                  <textarea value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} rows={3}
                    placeholder="Что должны знать и уметь ученики после урока?" className="w-full px-4 py-3 rounded-xl border border-border bg-slate font-body text-sm focus:outline-none focus:border-teal/40 focus:bg-white focus:ring-2 focus:ring-teal/10 transition-all placeholder:text-muted-foreground resize-none" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Технология обучения</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {["Проблемное обучение","ИКТ","Игровая","Кейс-метод","Проектная","Традиционная"].map(t => (
                      <button key={t} onClick={() => setForm(f => ({ ...f, technology: t }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-body border transition-all ${form.technology === t ? "bg-teal text-white border-teal" : "bg-white border-border text-muted-foreground hover:border-teal/40"}`}
                      >{t}</button>
                    ))}
                  </div>
                  <input type="text" value={form.technology} onChange={e => setForm(f => ({ ...f, technology: e.target.value }))}
                    placeholder="Или введите свою" className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate font-body text-sm focus:outline-none focus:border-teal/40 focus:bg-white transition-all placeholder:text-muted-foreground" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Что прошло хорошо?</label>
                  <textarea value={form.what_went_well} onChange={e => setForm(f => ({ ...f, what_went_well: e.target.value }))} rows={2}
                    placeholder="Что получилось особенно удачно на уроке?" className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate font-body text-sm focus:outline-none focus:border-teal/40 focus:bg-white transition-all placeholder:text-muted-foreground resize-none" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Что вызвало затруднения?</label>
                  <textarea value={form.what_was_hard} onChange={e => setForm(f => ({ ...f, what_was_hard: e.target.value }))} rows={2}
                    placeholder="С чем столкнулись трудности?" className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate font-body text-sm focus:outline-none focus:border-teal/40 focus:bg-white transition-all placeholder:text-muted-foreground resize-none" />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-2 block">Активность учеников</label>
                  <div className="flex flex-wrap gap-2">
                    {ACTIVITY_OPTIONS.map(a => (
                      <button key={a} onClick={() => setForm(f => ({ ...f, student_activity: a }))}
                        className={`px-4 py-2 rounded-xl text-sm font-body font-medium border transition-all ${form.student_activity === a ? "bg-teal text-white border-teal" : "bg-white border-border text-foreground hover:border-teal/40 hover:bg-teal-light"}`}
                      >{a}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-2 block">Цель урока достигнута?</label>
                  <div className="flex flex-col gap-2">
                    {GOAL_OPTIONS.map(g => (
                      <button key={g} onClick={() => setForm(f => ({ ...f, goal_achieved: g }))}
                        className={`px-4 py-2.5 rounded-xl text-sm font-body font-medium border transition-all text-left ${form.goal_achieved === g ? "bg-teal text-white border-teal" : "bg-white border-border text-foreground hover:border-teal/40 hover:bg-teal-light"}`}
                      >{g}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2">
                <Icon name="AlertCircle" size={16} className="text-destructive flex-shrink-0" />
                <span className="font-body text-sm text-destructive">{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 && !loading && (
                <button onClick={() => goTo(step - 1, "prev")}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border font-body text-sm font-medium text-foreground hover:bg-slate transition-colors">
                  <Icon name="ChevronLeft" size={16} />Назад
                </button>
              )}
              <button onClick={handleNext} disabled={loading || !canProceed()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal text-white font-body text-sm font-bold hover:bg-teal/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal/25">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Создаю самоанализ...</>
                ) : step === 4 ? (
                  <><Icon name="FileText" size={16} />Создать самоанализ</>
                ) : (
                  <>Далее<Icon name="ChevronRight" size={16} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
