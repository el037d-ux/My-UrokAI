import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function Terms() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(220,15%,97%)]">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold font-body">У</span>
            </span>
            <span className="font-display text-xl font-semibold text-foreground">УрокАИ</span>
          </a>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            Назад
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-border">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Пользовательское соглашение (оферта)</h1>
          <p className="font-body text-sm text-muted-foreground mb-8">Редакция от 1 января 2025 г.</p>

          <div className="space-y-6 font-body text-foreground">

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">1. Общие положения</h2>
              <p className="text-muted-foreground leading-relaxed">Настоящее Пользовательское соглашение (далее — «Соглашение») является публичной офертой ООО «УрокАИ» (далее — «Компания») и регулирует отношения между Компанией и физическим лицом (далее — «Пользователь»), использующим сервис УрокАИ (далее — «Сервис»).</p>
              <p className="text-muted-foreground leading-relaxed mt-2">Регистрируясь или используя Сервис, Пользователь подтверждает полное и безоговорочное принятие условий настоящего Соглашения в соответствии со ст. 438 ГК РФ.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">2. Предмет соглашения</h2>
              <p className="text-muted-foreground leading-relaxed">Компания предоставляет Пользователю доступ к онлайн-сервису для создания планов уроков с использованием технологий искусственного интеллекта. Сервис доступен через веб-интерфейс на условиях, предусмотренных настоящим Соглашением.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">3. Регистрация и учётная запись</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Для использования Сервиса Пользователь обязан:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Пройти регистрацию, указав достоверные данные</li>
                <li>Хранить данные для входа в конфиденциальности</li>
                <li>Незамедлительно уведомить Компанию о несанкционированном доступе к учётной записи</li>
                <li>Не передавать доступ к учётной записи третьим лицам</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">Пользователь несёт ответственность за все действия, совершённые с использованием его учётной записи.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">4. Права и обязанности Пользователя</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Пользователь вправе:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-3">
                <li>Использовать Сервис в соответствии с его функциональным назначением</li>
                <li>Создавать, сохранять и экспортировать планы уроков</li>
                <li>Обращаться в службу поддержки</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-2">Пользователь обязан:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Не использовать Сервис в незаконных целях</li>
                <li>Не предпринимать попыток взлома, обхода защиты или иного неправомерного воздействия на Сервис</li>
                <li>Не распространять через Сервис материалы, нарушающие права третьих лиц</li>
                <li>Соблюдать нормы действующего законодательства РФ</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">5. Права и обязанности Компании</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Компания вправе:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-3">
                <li>Изменять функциональность Сервиса, тарифы и условия доступа</li>
                <li>Приостанавливать доступ к Сервису для технического обслуживания</li>
                <li>Блокировать учётные записи, нарушающие условия Соглашения</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-2">Компания обязуется:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Обеспечивать доступность Сервиса согласно выбранному тарифу</li>
                <li>Защищать персональные данные Пользователя в соответствии с Политикой конфиденциальности</li>
                <li>Уведомлять об изменениях условий Соглашения</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">6. Тарифы и оплата</h2>
              <p className="text-muted-foreground leading-relaxed">Сервис предоставляется на бесплатной основе с ограниченным функционалом. Расширенный доступ предоставляется на платной основе согласно актуальным тарифам, размещённым на сайте. Оплата производится в рублях РФ безналичным способом.</p>
              <p className="text-muted-foreground leading-relaxed mt-2">Возврат средств осуществляется в случаях, предусмотренных законодательством РФ о защите прав потребителей, в течение 14 дней с момента оплаты при условии неиспользования платного функционала.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">7. Интеллектуальная собственность</h2>
              <p className="text-muted-foreground leading-relaxed">Все права на Сервис, его дизайн, программный код и контент принадлежат Компании. Планы уроков, созданные Пользователем с помощью Сервиса, являются собственностью Пользователя. Пользователь предоставляет Компании неисключительную лицензию на использование созданных материалов в целях улучшения Сервиса.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">8. Ограничение ответственности</h2>
              <p className="text-muted-foreground leading-relaxed">Сервис предоставляется «как есть». Компания не гарантирует, что результаты работы ИИ будут соответствовать всем требованиям Пользователя. Ответственность Компании ограничена суммой, уплаченной Пользователем за последний расчётный период.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">9. Срок действия и расторжение</h2>
              <p className="text-muted-foreground leading-relaxed">Соглашение вступает в силу с момента регистрации и действует бессрочно. Пользователь вправе расторгнуть Соглашение, удалив учётную запись. Компания вправе расторгнуть Соглашение при систематическом нарушении его условий.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">10. Применимое право и разрешение споров</h2>
              <p className="text-muted-foreground leading-relaxed">Соглашение регулируется законодательством Российской Федерации. Все споры решаются путём переговоров, а при невозможности достижения соглашения — в судебном порядке по месту нахождения Компании.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">11. Контактные данные</h2>
              <p className="text-muted-foreground leading-relaxed">По всем вопросам, связанным с настоящим Соглашением, обращайтесь: <span className="text-green">hello@urokii.ru</span></p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
