import { Navbar, Hero } from "@/components/sections/NavbarSection";
import { About, ChatDemo, FAQ, Articles } from "@/components/sections/ContentSections";
import { CTA, Contacts, Footer } from "@/components/sections/CtaFooter";

type Props = {
  onStart: () => void;
  onGame: () => void;
  onAnalysis: () => void;
  onAuth: () => void;
  onPayment: () => void;
};

export default function LandingLayout({ onStart, onGame, onAnalysis, onAuth, onPayment }: Props) {
  return (
    <>
      <Navbar onStart={onStart} onAuth={onAuth} />
      <Hero onStart={onStart} onGame={onGame} onAnalysis={onAnalysis} onPayment={onPayment} />
      <About />
      <ChatDemo />
      <FAQ />
      <Articles />
      <CTA onStart={onStart} />
      <Contacts />
      <Footer />
    </>
  );
}
