import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Payment, paymentIcon, paymentLabel } from "./types";

/* ==================== PAYMENT MODAL ==================== */
export function PaymentModal({
  payment,
  onSave,
  onClose,
}: {
  payment: Payment;
  onSave: (p: Payment) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Payment>({ ...payment });
  const set = <K extends keyof Payment>(k: K, v: Payment[K]) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end animate-fade-in" onClick={onClose}>
      <div
        className="bg-card w-full rounded-t-2xl overflow-y-auto"
        style={{ animation: "slideUp 0.3s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border px-4 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Платёж · Заказ #{payment.orderId}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Icon name="X" size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Статус оплаты</label>
            <div className="flex gap-2 mt-2">
              {[
                { v: "paid", label: "Оплачено", cls: "status-active" },
                { v: "pending", label: "Ожидает", cls: "status-pending" },
                { v: "cancelled", label: "Отменён", cls: "status-cancelled" },
              ].map((s) => (
                <button
                  key={s.v}
                  onClick={() => set("status", s.v as Payment["status"])}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                    form.status === s.v ? `${s.cls} border-current` : "bg-muted text-muted-foreground border-transparent"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                <Icon name="Banknote" size={11} />
                Сумма (₽)
              </label>
              <input
                type="number"
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground border border-transparent"
                value={form.amount}
                onChange={(e) => set("amount", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                <Icon name="CreditCard" size={11} />
                Способ
              </label>
              <select
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground border border-transparent"
                value={form.type}
                onChange={(e) => set("type", e.target.value as "cash" | "card" | "online")}
              >
                <option value="cash">Наличные</option>
                <option value="card">Карта</option>
                <option value="online">Онлайн</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              <Icon name="Calendar" size={11} />
              Дата
            </label>
            <input
              type="date"
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground border border-transparent"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 bg-muted text-foreground rounded-xl py-3 text-sm font-medium">
              Отмена
            </button>
            <button
              onClick={() => onSave(form)}
              className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold"
            >
              Сохранить
            </button>
          </div>
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}

/* ==================== PAYMENTS TAB ==================== */
export function PaymentsTab({
  payments,
  totalEarned,
  pendingAmount,
  onEdit,
}: {
  payments: Payment[];
  totalEarned: number;
  pendingAmount: number;
  onEdit: (p: Payment) => void;
}) {
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const displayed = filter === "all" ? payments : payments.filter((p) => p.status === filter);

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Icon name="TrendingUp" size={16} className="text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground">Получено</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalEarned} ₽</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Icon name="Clock" size={16} className="text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground">Ожидает</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{pendingAmount} ₽</p>
        </div>
      </div>

      <div className="flex gap-2 bg-muted rounded-xl p-1">
        {[
          { id: "all", label: "Все" },
          { id: "paid", label: "Оплачено" },
          { id: "pending", label: "Ожидает" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as "all" | "paid" | "pending")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all ${
              filter === f.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {displayed.map((p, i) => (
          <div
            key={p.id}
            onClick={() => onEdit(p)}
            className="bg-card border border-border rounded-xl p-4 cursor-pointer card-hover animate-fade-in"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                  <Icon name={paymentIcon[p.type]} size={14} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{p.address}</p>
                  <p className="text-xs text-muted-foreground">{paymentLabel[p.type]} · #{p.orderId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-foreground">{p.amount} ₽</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  p.status === "paid" ? "status-active" : "status-pending"
                }`}>
                  {p.status === "paid" ? "Оплачено" : "Ожидает"}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-9">
              {p.date.split("-").reverse().join(".")}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Март 2026</p>
        <div className="space-y-2.5">
          {[
            { label: "Наличными", icon: "Banknote", type: "cash" },
            { label: "Картой", icon: "CreditCard", type: "card" },
            { label: "Онлайн", icon: "Smartphone", type: "online" },
          ].map((item) => {
            const val = payments
              .filter((p) => p.type === item.type && p.status === "paid")
              .reduce((s, p) => s + p.amount, 0);
            return (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name={item.icon} size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{val} ₽</span>
              </div>
            );
          })}
          <div className="border-t border-border pt-2.5 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Итого получено</span>
            <span className="text-base font-bold text-primary">{totalEarned} ₽</span>
          </div>
        </div>
      </div>
      <div className="h-2" />
    </div>
  );
}
