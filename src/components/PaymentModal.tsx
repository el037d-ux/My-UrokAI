import Icon from "@/components/ui/icon";

const SBP_PHONE = "79083287309";
const SBP_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://qr.nspk.ru/AS100003AWW1BWBH5TBEFXZSNRIRZ7OD?type=01&bank=100000000007&sum=&cur=RUB&crc=F9E8`)}`;

const PLANS = [
  {
    id: "7days",
    label: "7 дней",
    price: 69,
    desc: "Доступ ко всем функциям на неделю",
    highlight: false,
  },
  {
    id: "30days",
    label: "30 дней",
    price: 260,
    desc: "Полный доступ на месяц — выгоднее",
    highlight: true,
  },
];

export default function PaymentModal({ onClose }: { onClose: () => void }) {
  const sbpLink = `https://qr.nspk.ru/AS100003AWW1BWBH5TBEFXZSNRIRZ7OD?type=01&bank=100000000007&sum=26000&cur=RUB`;
  const qr7 = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://qr.nspk.ru/AS100003AWW1BWBH5TBEFXZSNRIRZ7OD?type=01&bank=100000000007&sum=6900&cur=RUB&crc=F9E8`)}&bgcolor=ffffff&color=3730a3&qzone=1`;
  const qr30 = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://qr.nspk.ru/AS100003AWW1BWBH5TBEFXZSNRIRZ7OD?type=01&bank=100000000007&sum=26000&cur=RUB&crc=F9E8`)}&bgcolor=ffffff&color=3730a3&qzone=1`;

  // QR через СБП — номер телефона
  const qrPhone7 = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`https://qr.nspk.ru/AS1000034O3LH7LQHS93BH1QNLR7Q31Y?type=01&bank=100000000007&sum=6900&cur=RUB`)}&bgcolor=ffffff&color=3730a3&qzone=2`;
  const qrPhone30 = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`https://qr.nspk.ru/AS1000034O3LH7LQHS93BH1QNLR7Q31Y?type=01&bank=100000000007&sum=26000&cur=RUB`)}&bgcolor=ffffff&color=3730a3&qzone=2`;

  const sbpPhone7 = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`tel:+${SBP_PHONE}`)}&bgcolor=ffffff&color=3730a3&qzone=2`;
  const sbpPhone30 = sbpPhone7;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-7 pb-5 border-b border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-md bg-primary flex items-center justify-center">
                <Icon name="Crown" size={12} className="text-white" />
              </span>
              <span className="font-body text-xs font-semibold text-primary uppercase tracking-wider">Подписка</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Выберите тариф</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate flex items-center justify-center transition-colors">
            <Icon name="X" size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* Что входит */}
          <div className="p-4 rounded-2xl bg-indigo-light border border-indigo-mid">
            <div className="font-body text-xs font-semibold text-primary uppercase tracking-wider mb-2">С подпиской доступно</div>
            <ul className="space-y-1.5">
              {[
                "Неограниченные планы уроков",
                "Неограниченные игры",
                "Самоанализ урока (только для подписчиков)",
                "Приоритетная поддержка",
              ].map(f => (
                <li key={f} className="flex items-center gap-2 font-body text-sm text-foreground">
                  <Icon name="Check" size={14} className="text-teal flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Тарифы */}
          {PLANS.map(plan => (
            <div key={plan.id} className={`rounded-2xl border-2 p-5 ${plan.highlight ? "border-primary bg-indigo-light/30" : "border-border"}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xl font-bold text-foreground">{plan.label}</span>
                    {plan.highlight && <span className="px-2 py-0.5 rounded-full bg-primary text-white font-body text-xs font-semibold">Выгодно</span>}
                  </div>
                  <p className="font-body text-sm text-muted-foreground mt-0.5">{plan.desc}</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-3xl font-bold text-primary">{plan.price}₽</div>
                </div>
              </div>

              {/* QR-код СБП */}
              <div className="flex flex-col items-center gap-3 pt-3 border-t border-border">
                <div className="font-body text-xs text-muted-foreground text-center">Оплатите через СБП — наведите камеру на QR-код</div>
                <div className="p-2 rounded-2xl border border-border bg-white shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`https://qr.nspk.ru/AS1000034O3LH7LQHS93BH1QNLR7Q31Y?type=01&bank=100000000007&sum=${plan.price * 100}&cur=RUB`)}&bgcolor=ffffff&color=3730a3&qzone=2`}
                    alt={`QR ${plan.label}`}
                    className="w-[180px] h-[180px]"
                  />
                </div>


              </div>
            </div>
          ))}

          {/* Бесплатный тариф */}
          <div className="p-4 rounded-2xl bg-slate border border-border text-center">
            <div className="font-body text-sm font-semibold text-foreground mb-1">Бесплатно всегда</div>
            <div className="font-body text-xs text-muted-foreground">3 плана урока · 3 игры · без самоанализа</div>
          </div>
        </div>
      </div>
    </div>
  );
}