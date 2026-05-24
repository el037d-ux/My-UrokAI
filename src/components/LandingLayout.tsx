import { Navbar, Hero } from "@/components/sections/NavbarSection";
import { About, ChatDemo, FAQ } from "@/components/sections/ContentSections";
import { CTA, Contacts, Footer } from "@/components/sections/CtaFooter";

type Props = {
  onStart: () => void;
  onGame: () => void;
  onAnalysis: () => void;
  onAuth: () => void;
  onPayment: () => void;
  onProfile: () => void;
  lessonsLeft: number | null;
  gamesLeft: number | null;
  isPaid: boolean;
};

export default function LandingLayout({ onStart, onGame, onAnalysis, onAuth, onPayment, onProfile, lessonsLeft, gamesLeft, isPaid }: Props) {
  return (
    <>
      <Navbar onStart={onStart} onAuth={onAuth} onPayment={onPayment} onProfile={onProfile} />
      <Hero onStart={onStart} onGame={onGame} onAnalysis={onAnalysis} onPayment={onPayment} lessonsLeft={lessonsLeft} gamesLeft={gamesLeft} isPaid={isPaid} />
      <About />
      <ChatDemo onPayment={onPayment} />
      <FAQ />
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-primary text-xs font-body font-semibold uppercase tracking-wider mb-3">💬 Поддержка</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Остались вопросы?</h2>
            <p className="font-body text-sm text-muted-foreground mt-2">Напишите нам — ответим быстро</p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg border border-border">
            <iframe
              src="https://bothelp.io/f/e5af787a814"
              width="100%"
              height="600"
              style={{ border: 0, display: "block" }}
              title="Чат поддержки"
            />
          </div>
        </div>
      </section>
      <CTA onStart={onStart} onPayment={onPayment} />
      <Contacts />
      <Footer />
    </>
  );
}