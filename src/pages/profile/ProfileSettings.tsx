import { useState } from "react";
import { useUser } from "@/context/UserContext";
import Icon from "@/components/ui/icon";
import { AUTH_URL } from "./ProfileShared";

export function SettingsTab() {
  const { status, token, refreshStatus } = useUser();
  const [name, setName] = useState(status?.user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState("");

  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState("");

  const saveName = async () => {
    if (!name.trim()) { setNameError("Имя не может быть пустым"); return; }
    if (name.trim().length < 2) { setNameError("Минимум 2 символа"); return; }
    setNameError("");
    setNameLoading(true);
    setNameSuccess(false);
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action: "update_name", name: name.trim() }),
      });
      const data = await res.json();
      if (data.ok) { setNameSuccess(true); await refreshStatus(); setTimeout(() => setNameSuccess(false), 3000); }
      else setNameError(data.error || "Ошибка сохранения");
    } catch { setNameError("Ошибка соединения"); }
    finally { setNameLoading(false); }
  };

  const savePassword = async () => {
    if (!oldPwd) { setPwdError("Введите текущий пароль"); return; }
    if (newPwd.length < 6) { setPwdError("Новый пароль — минимум 6 символов"); return; }
    setPwdError("");
    setPwdLoading(true);
    setPwdSuccess(false);
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ action: "change_password", old_password: oldPwd, new_password: newPwd }),
      });
      const data = await res.json();
      if (data.ok) { setPwdSuccess(true); setOldPwd(""); setNewPwd(""); setTimeout(() => setPwdSuccess(false), 3000); }
      else setPwdError(data.error || "Неверный текущий пароль");
    } catch { setPwdError("Ошибка соединения"); }
    finally { setPwdLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-indigo-light flex items-center justify-center">
            <Icon name="UserPen" size={16} className="text-primary" />
          </div>
          <span className="font-display text-base font-bold text-foreground">Имя профиля</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1.5 block">Отображаемое имя</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); setNameSuccess(false); }}
              placeholder="Введите имя"
              className={`w-full px-4 py-2.5 rounded-xl border font-body text-sm text-foreground bg-background outline-none transition-all ${nameError ? "border-destructive" : "border-border focus:border-primary"}`}
            />
            {nameError && <p className="font-body text-xs text-destructive mt-1.5">{nameError}</p>}
          </div>
          <button
            onClick={saveName}
            disabled={nameLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-body text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60"
          >
            {nameLoading
              ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Сохраняем...</>
              : nameSuccess
              ? <><Icon name="Check" size={15} /> Сохранено!</>
              : "Сохранить имя"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
            <Icon name="Lock" size={16} className="text-muted-foreground" />
          </div>
          <span className="font-display text-base font-bold text-foreground">Смена пароля</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1.5 block">Текущий пароль</label>
            <input
              type="password"
              value={oldPwd}
              onChange={(e) => { setOldPwd(e.target.value); setPwdError(""); setPwdSuccess(false); }}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-xl border font-body text-sm text-foreground bg-background outline-none transition-all ${pwdError ? "border-destructive" : "border-border focus:border-primary"}`}
            />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1.5 block">Новый пароль</label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => { setNewPwd(e.target.value); setPwdError(""); setPwdSuccess(false); }}
              placeholder="Минимум 6 символов"
              className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary font-body text-sm text-foreground bg-background outline-none transition-all"
            />
          </div>
          {pwdError && <p className="font-body text-xs text-destructive">{pwdError}</p>}
          <button
            onClick={savePassword}
            disabled={pwdLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-body text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-all active:scale-95 disabled:opacity-60"
          >
            {pwdLoading
              ? <><div className="w-4 h-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin" /> Меняем...</>
              : pwdSuccess
              ? <><Icon name="Check" size={15} className="text-primary" /> Пароль изменён!</>
              : <><Icon name="Lock" size={15} /> Изменить пароль</>}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-destructive/20 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Icon name="Mail" size={16} className="text-destructive" />
          </div>
          <span className="font-display text-base font-bold text-foreground">Аккаунт</span>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-1">
          Email: <span className="text-foreground font-medium">{status?.user?.email}</span>
        </p>
        <p className="font-body text-xs text-muted-foreground">Для смены email обратитесь в поддержку</p>
      </div>
    </div>
  );
}
