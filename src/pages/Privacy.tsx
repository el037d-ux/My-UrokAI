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
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Политика конфиденциальности</h1>
          <p className="font-body text-sm text-muted-foreground mb-8">Редакция от 1 января 2025 г.</p>

          <div className="prose prose-sm max-w-none space-y-6 font-body text-foreground">

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">1. Общие положения</h2>
              <p className="text-muted-foreground leading-relaxed">Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки и защиты персональных данных пользователей сервиса УрокАИ (далее — «Сервис»), доступного по адресу urokii.ru.</p>
              <p className="text-muted-foreground leading-relaxed mt-2">Используя Сервис, вы соглашаетесь с условиями настоящей Политики. Если вы не согласны с её условиями, пожалуйста, прекратите использование Сервиса.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">2. Оператор персональных данных</h2>
              <p className="text-muted-foreground leading-relaxed">Оператором персональных данных является ООО «УрокАИ», осуществляющее обработку персональных данных в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».</p>
              <p className="text-muted-foreground leading-relaxed mt-2">Контактные данные оператора: <span className="text-green">hello@urokii.ru</span></p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">3. Какие данные мы собираем</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">При регистрации и использовании Сервиса мы собираем следующие персональные данные:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Фамилия, имя, отчество</li>
                <li>Адрес электронной почты</li>
                <li>Номер телефона</li>
                <li>Данные об использовании Сервиса (созданные уроки, настройки)</li>
                <li>Технические данные (IP-адрес, тип браузера, cookies)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">4. Цели обработки данных</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Ваши персональные данные обрабатываются в следующих целях:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Предоставление доступа к Сервису и его функциям</li>
                <li>Идентификация пользователя при авторизации</li>
                <li>Направление уведомлений, связанных с использованием Сервиса</li>
                <li>Улучшение качества Сервиса и пользовательского опыта</li>
                <li>Выполнение требований законодательства Российской Федерации</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">5. Правовые основания обработки</h2>
              <p className="text-muted-foreground leading-relaxed">Обработка персональных данных осуществляется на основании вашего согласия, выраженного при регистрации в Сервисе, а также в целях исполнения договора (пользовательского соглашения), стороной которого вы являетесь.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">6. Передача данных третьим лицам</h2>
              <p className="text-muted-foreground leading-relaxed">Мы не передаём ваши персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством РФ, а также случаев, когда это необходимо для предоставления Сервиса (например, облачные провайдеры, аналитические системы) при условии соблюдения ими конфиденциальности.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">7. Хранение и защита данных</h2>
              <p className="text-muted-foreground leading-relaxed">Персональные данные хранятся на защищённых серверах, расположенных на территории Российской Федерации. Мы применяем технические и организационные меры для защиты данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>
              <p className="text-muted-foreground leading-relaxed mt-2">Срок хранения персональных данных — в течение всего срока действия учётной записи пользователя, а также 3 года после её удаления, если иное не предусмотрено законодательством.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">8. Права пользователя</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Вы имеете право:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Получить информацию об обработке ваших персональных данных</li>
                <li>Требовать уточнения, блокирования или уничтожения данных</li>
                <li>Отозвать согласие на обработку персональных данных</li>
                <li>Обжаловать действия оператора в Роскомнадзоре</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">Для реализации своих прав обратитесь по адресу: <span className="text-green">hello@urokii.ru</span></p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">9. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">Сервис использует файлы cookies для обеспечения функциональности, аналитики и улучшения пользовательского опыта. Вы можете отключить cookies в настройках браузера, однако это может повлиять на работу Сервиса.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold mb-3">10. Изменения в Политике</h2>
              <p className="text-muted-foreground leading-relaxed">Мы вправе вносить изменения в настоящую Политику. Актуальная версия всегда доступна на данной странице. Продолжение использования Сервиса после публикации изменений означает ваше согласие с обновлённой Политикой.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
