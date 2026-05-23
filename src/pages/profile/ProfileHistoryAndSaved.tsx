import { useState, useCallback, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Icon from "@/components/ui/icon";
import { USER_STATUS_URL, TYPE_META, LoadingCard, EmptyCard, ErrorCard } from "./ProfileShared";

type HistoryItem = {
  id: number;
  type: string;
  title: string;
  prompt?: string;
  created_at: string;
};

type SavedItem = {
  id: number;
  type: string;
  title: string;
  history_id?: number;
  created_at: string;
};

export function HistoryTab() {
  const { token } = useUser();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 10;

  const load = useCallback(async (p: number) => {
    if (!token) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${USER_STATUS_URL}?action=get_history&page=${p}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setItems(data.items);
        setTotal(data.total);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(page); }, [load, page]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  const totalPages = Math.ceil(total / PER_PAGE);

  if (loading) return <LoadingCard text="Загружаем историю..." />;
  if (error) return <ErrorCard onRetry={() => load(page)} />;
  if (items.length === 0) return (
    <EmptyCard icon="Clock" title="История пуста" desc="Здесь появятся созданные уроки, игры и анализы" />
  );

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
          </div>
          <span className="font-display text-base font-bold text-foreground">История активности</span>
        </div>
        <span className="font-body text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {total} записей
        </span>
      </div>
      <div className="divide-y divide-border">
        {items.map((item) => {
          const meta = TYPE_META[item.type] || TYPE_META.lesson;
          return (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors">
              <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon name={meta.icon} fallback="BookOpen" size={16} className={meta.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body text-sm font-semibold text-foreground truncate">{item.title}</div>
                {item.prompt && (
                  <div className="font-body text-xs text-muted-foreground mt-0.5 truncate">{item.prompt}</div>
                )}
                <div className="font-body text-xs text-muted-foreground mt-0.5">{meta.label}</div>
              </div>
              <div className="font-body text-xs text-muted-foreground flex-shrink-0">{formatDate(item.created_at)}</div>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border font-body text-xs text-muted-foreground disabled:opacity-40 hover:border-primary hover:text-primary transition-all"
          >
            <Icon name="ChevronLeft" size={14} /> Назад
          </button>
          <span className="font-body text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border font-body text-xs text-muted-foreground disabled:opacity-40 hover:border-primary hover:text-primary transition-all"
          >
            Далее <Icon name="ChevronRight" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export function SavedTab() {
  const { token } = useUser();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 10;

  const load = useCallback(async (p: number) => {
    if (!token) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${USER_STATUS_URL}?action=get_saved&page=${p}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setItems(data.items);
        setTotal(data.total);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(page); }, [load, page]);

  const handleUnsave = async (id: number) => {
    if (!token) return;
    setRemovingId(id);
    try {
      const res = await fetch(USER_STATUS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "unsave_material", id }),
      });
      const data = await res.json();
      if (data.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setTotal((t) => t - 1);
      }
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });

  const totalPages = Math.ceil(total / PER_PAGE);

  if (loading) return <LoadingCard text="Загружаем сохранённые..." />;
  if (error) return <ErrorCard onRetry={() => load(page)} />;
  if (items.length === 0) return (
    <EmptyCard icon="Bookmark" title="Нет сохранённых материалов" desc="Сохраняйте уроки, игры и анализы — они появятся здесь" />
  );

  return (
    <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-light flex items-center justify-center">
            <Icon name="Bookmark" size={16} className="text-primary" />
          </div>
          <span className="font-display text-base font-bold text-foreground">Сохранённые материалы</span>
        </div>
        <span className="font-body text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {total} материалов
        </span>
      </div>
      <div className="divide-y divide-border">
        {items.map((item) => {
          const meta = TYPE_META[item.type] || TYPE_META.lesson;
          return (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors group">
              <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon name={meta.icon} fallback="BookOpen" size={16} className={meta.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body text-sm font-semibold text-foreground truncate">{item.title}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs font-body font-medium px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
                    {meta.label}
                  </span>
                  <span className="font-body text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
                </div>
              </div>
              <button
                onClick={() => handleUnsave(item.id)}
                disabled={removingId === item.id}
                className="flex-shrink-0 w-8 h-8 rounded-xl border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:border-destructive/30 hover:bg-destructive/5 disabled:opacity-40"
              >
                {removingId === item.id
                  ? <div className="w-3.5 h-3.5 rounded-full border-2 border-destructive/20 border-t-destructive animate-spin" />
                  : <Icon name="X" size={14} className="text-muted-foreground hover:text-destructive" />
                }
              </button>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border font-body text-xs text-muted-foreground disabled:opacity-40 hover:border-primary hover:text-primary transition-all"
          >
            <Icon name="ChevronLeft" size={14} /> Назад
          </button>
          <span className="font-body text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border font-body text-xs text-muted-foreground disabled:opacity-40 hover:border-primary hover:text-primary transition-all"
          >
            Далее <Icon name="ChevronRight" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
