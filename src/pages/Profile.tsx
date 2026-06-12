import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import Icon from "@/components/ui/icon";
import { Spinner, PLAN_LABELS, PLAN_COLORS, TABS, EXPORT_EXCEL_URL, ADMIN_EMAIL, type Tab } from "./profile/ProfileShared";
import { ProfileTab } from "./profile/ProfileTab";
import { HistoryTab, SavedTab } from "./profile/ProfileHistoryAndSaved";
import { SettingsTab } from "./profile/ProfileSettings";

export default function Profile() {
  const { status, token, loading, logout } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    if (!token) return;
    setExporting(true);
    try {
      const res = await fetch(EXPORT_EXCEL_URL, { headers: { Authorization: `Bearer ${token}` } });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "УрокАИ.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (!loading && !token) navigate("/");
  }, [loading, token, navigate]);

  if (loading || !status) return <Spinner />;

  const { user, plan } = status;

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-indigo-light/30 to-teal-light/20">
      <nav className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
              <Icon name="GraduationCap" size={16} className="text-white" />
            </span>
            <span className="font-display text-xl font-bold text-foreground tracking-tight">УрокАИ</span>
          </button>
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={15} /> На главную
          </button>
        </div>
      </nav>

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="bg-white rounded-3xl border border-border shadow-sm p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 flex-shrink-0">
            <span className="font-display text-2xl font-bold text-white">
              {(user?.name || user?.email || "?")[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-xl font-bold text-foreground truncate">{user?.name || "Пользователь"}</div>
            <div className="font-body text-sm text-muted-foreground mt-0.5 truncate">{user?.email}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2.5 py-0.5 rounded-full border text-xs font-body font-semibold ${PLAN_COLORS[plan] || PLAN_COLORS.free}`}>
                {plan !== "free" && <Icon name="Crown" size={10} className="inline mr-1" />}
                {PLAN_LABELS[plan] || plan}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {user?.email === ADMIN_EMAIL && (
              <button
                onClick={handleExportExcel}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-teal/40 bg-teal-light text-teal text-sm font-body font-medium hover:bg-teal/10 transition-all disabled:opacity-60"
              >
                <Icon name={exporting ? "Loader" : "FileDown"} size={15} />
                <span className="hidden sm:inline">{exporting ? "Загрузка..." : "Excel"}</span>
              </button>
            )}
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-body font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all">
              <Icon name="LogOut" size={15} /> <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>

        <div className="flex gap-1 p-1 bg-white rounded-2xl border border-border shadow-sm overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl font-body text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={t.icon} size={15} fallback="User" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === "profile" && <ProfileTab />}
        {tab === "history" && <HistoryTab />}
        {tab === "saved" && <SavedTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}