import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function Privacy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(220,15%,97%)]">
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

      <div className="container max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-border">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Политика обработки персональных данных</h1>
          <p className="font-body text-sm text-muted-foreground mb-8">Редакция от 24 мая 2025 г. · Соответствует Федеральному закону № 152-ФЗ «О персональных данных»</p>

          <div className="prose prose-sm max-w-none space-y-6 font-body text-foreground">

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">1. Кто мы и зачем эта политика</h2>
              <p className="text-muted-foreground leading-relaxed">
                УрокАИ — образовательный портал для педагогов. Оператор персональных данных — ООО «УрокАИ» (далее «мы»).
                Эта политика объясняет простым языком: какие данные мы собираем, зачем, как храним и какие права есть у вас.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Регистрируясь на портале, вы подтверждаете, что ознакомились с этим документом и даёте согласие на обработку
                ваших данных в описанных целях.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">2. Какие данные мы собираем</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">При регистрации и использовании портала мы запрашиваем:</p>
              <div className="space-y-2">
                {[
                  { icon: "User", label: "Имя", desc: "чтобы обращаться к вам лично и отображать в профиле" },
                  { icon: "Mail", label: "Email", desc: "для входа в аккаунт и отправки важных уведомлений" },
                  { icon: "Phone", label: "Телефон", desc: "для восстановления доступа и оперативной связи" },
                  { icon: "Building2", label: "Учебное заведение", desc: "чтобы подбирать релевантные материалы и курсы" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={item.icon} size={15} className="text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-sm">{item.label}</span>
                      <span className="text-muted-foreground text-sm"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                Также автоматически фиксируются технические данные: IP-адрес, тип браузера, файлы cookie — для обеспечения
                безопасности и корректной работы сайта. Мы не собираем специальные категории данных (медицинские, биометрические и т.п.).
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">3. Для чего мы используем ваши данные</h2>
              <ul className="space-y-1.5 text-muted-foreground">
                {[
                  "Создание и ведение вашего аккаунта на портале",
                  "Предоставление доступа к курсам, тренажёрам и материалам",
                  "Отправка уведомлений о новых курсах, обновлениях и технических сообщений",
                  "Восстановление доступа к аккаунту при необходимости",
                  "Улучшение качества сервиса на основе обезличенной статистики",
                  "Исполнение требований законодательства РФ",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={15} className="text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                Мы не используем ваши данные для продажи третьим лицам и не передаём их рекламным агентствам.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">4. Кому мы передаём данные</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Ваши данные могут быть переданы только в трёх случаях:
              </p>
              <ul className="mt-2 space-y-1.5 text-muted-foreground">
                {[
                  "Технические партнёры (хостинг, облачная инфраструктура) — только в объёме, необходимом для работы портала, на условиях строгой конфиденциальности",
                  "Государственные органы — если это прямо предусмотрено законом",
                  "С вашего явного согласия — в любых иных случаях",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon name="Shield" size={15} className="text-teal flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">5. Сроки хранения данных</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { period: "Весь срок действия аккаунта", desc: "Данные профиля, история курсов" },
                  { period: "3 года после удаления аккаунта", desc: "Резервные копии и архивы" },
                  { period: "До отзыва согласия", desc: "Данные для рассылки уведомлений" },
                  { period: "Установлен законом", desc: "Данные по финансовым операциям (5 лет)" },
                ].map((item) => (
                  <div key={item.period} className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="font-semibold text-sm text-foreground">{item.period}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                После истечения сроков данные безвозвратно удаляются или обезличиваются.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">6. Ваши права</h2>
              <p className="text-muted-foreground leading-relaxed mb-3 text-sm">
                В соответствии с 152-ФЗ вы вправе в любой момент:
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { icon: "Eye", label: "Узнать", desc: "какие данные о вас хранятся" },
                  { icon: "PenLine", label: "Исправить", desc: "неточные или устаревшие данные" },
                  { icon: "Trash2", label: "Удалить", desc: "свои данные («право на забвение»)" },
                  { icon: "Ban", label: "Ограничить", desc: "обработку данных в спорных ситуациях" },
                  { icon: "XCircle", label: "Отозвать согласие", desc: "на обработку в любой момент" },
                  { icon: "Flag", label: "Пожаловаться", desc: "в Роскомнадзор (rkn.gov.ru)" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-slate-50">
                    <div className="w-7 h-7 rounded-lg bg-white border border-border flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon} size={14} className="text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-foreground">{item.label}</span>
                      <span className="text-xs text-muted-foreground"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                Для реализации любого из прав напишите нам на{" "}
                <a href="mailto:hello@urokii.ru" className="text-primary hover:underline">hello@urokii.ru</a>.
                Мы ответим в течение 30 дней.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">7. Как мы защищаем данные</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Данные хранятся на серверах на территории России. Мы используем шифрование при передаче (HTTPS),
                разграничение прав доступа и регулярное резервное копирование. Сотрудники, имеющие доступ к данным,
                подписывают соглашение о неразглашении.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">8. Согласие при регистрации</h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                При регистрации на портале вы проставляете чек-боксы согласия. Каждое согласие — отдельное и добровольное:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-primary/20 bg-indigo-50/50">
                  <div className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Обязательное согласие</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Я соглашаюсь на обработку персональных данных (имя, email, телефон, учебное заведение)
                      в целях создания аккаунта и предоставления доступа к курсам в соответствии с{" "}
                      <a href="/privacy" className="text-primary hover:underline">Политикой конфиденциальности</a>.
                      Без этого согласия регистрация невозможна.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-slate-50">
                  <div className="w-5 h-5 rounded border-2 border-border flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Согласие на информирование (необязательное)</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Я соглашаюсь получать на указанный email новости портала, анонсы курсов и полезные материалы.
                      Отписаться можно в любой момент по ссылке в письме или через настройки профиля.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-xs mt-3">
                Отзыв согласия не влияет на законность обработки, осуществлённой до его отзыва.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">9. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Портал использует файлы cookie для авторизации, аналитики посещаемости (Яндекс.Метрика)
                и корректной работы интерфейса. Вы можете отключить cookie в настройках браузера,
                однако некоторые функции портала могут работать некорректно.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">10. Контакты и обратная связь</h2>
              <div className="p-4 rounded-xl bg-slate-50 border border-border space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Mail" size={15} className="text-primary flex-shrink-0" />
                  <span>Email: <a href="mailto:hello@urokii.ru" className="text-primary hover:underline">hello@urokii.ru</a></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Globe" size={15} className="text-primary flex-shrink-0" />
                  <span>Сайт: <a href="https://urokii.ru" className="text-primary hover:underline">urokii.ru</a></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={15} className="text-primary flex-shrink-0" />
                  <span>Срок ответа на обращения — не более 30 календарных дней</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">11. Изменения в политике</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Мы можем обновлять этот документ. О существенных изменениях уведомим вас по email
                минимум за 7 дней до вступления в силу. Актуальная версия всегда на этой странице.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
