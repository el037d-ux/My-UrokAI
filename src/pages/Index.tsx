import { useState, useEffect } from "react";
import LandingLayout from "@/components/LandingLayout";
import LessonWizard from "@/components/LessonWizard";
import GameWizard from "@/components/GameWizard";
import SelfAnalysisWizard from "@/components/SelfAnalysisWizard";
import AuthModal from "@/components/AuthModal";
import PaymentModal from "@/components/PaymentModal";
import { useUser } from "@/context/UserContext";

function useSectionFade() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-fade");
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function Index() {
  useSectionFade();
  const { status, token, logout } = useUser();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const handleStart = () => {
    if (!token) { setAuthOpen(true); return; }
    if (status && !status.can_use.lessons) { setPaymentOpen(true); return; }
    setWizardOpen(true);
  };

  const handleGame = () => {
    if (!token) { setAuthOpen(true); return; }
    if (status && !status.can_use.games) { setPaymentOpen(true); return; }
    setGameOpen(true);
  };

  const handleAnalysis = () => {
    if (!token) { setAuthOpen(true); return; }
    if (status && !status.can_use.analyses) { setPaymentOpen(true); return; }
    setAnalysisOpen(true);
  };

  return (
    <div className="min-h-screen">
      {wizardOpen && <LessonWizard onClose={() => setWizardOpen(false)} />}
      {gameOpen && <GameWizard onClose={() => setGameOpen(false)} />}
      {analysisOpen && <SelfAnalysisWizard onClose={() => setAnalysisOpen(false)} />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      {paymentOpen && <PaymentModal onClose={() => setPaymentOpen(false)} />}

      {/* Плашка статуса */}
      {token && status && (
        <div className="fixed bottom-4 right-4 z-50 bg-white rounded-2xl shadow-xl border border-border px-4 py-3 flex items-center gap-3 animate-fade-in">
          <div>
            <div className="font-body text-xs font-semibold text-foreground">{status.user?.name || status.user?.email}</div>
            <div className="font-body text-xs text-muted-foreground">
              {status.plan === "free"
                ? `Уроки: ${status.usage.lessons}/3 · Игры: ${status.usage.games}/3`
                : `Подписка активна`}
            </div>
          </div>
          {status.plan === "free" && (
            <button onClick={() => setPaymentOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-primary text-white font-body text-xs font-semibold hover:bg-primary/90 transition-colors">
              Купить
            </button>
          )}
          <button onClick={logout} className="w-6 h-6 rounded-lg hover:bg-slate flex items-center justify-center transition-colors">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}

      <LandingLayout
        onStart={handleStart}
        onGame={handleGame}
        onAnalysis={handleAnalysis}
        onAuth={() => setAuthOpen(true)}
        onPayment={() => setPaymentOpen(true)}
      />
    </div>
  );
}
