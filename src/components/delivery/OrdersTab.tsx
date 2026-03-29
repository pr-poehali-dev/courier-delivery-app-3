import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Order, OrderStatus, Payment, statusLabel, statusClass, paymentIcon } from "./types";

/* ==================== FIELD WRAPPER ==================== */
function Field({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
        <Icon name={icon} size={11} />
        {label}
      </label>
      {children}
    </div>
  );
}

/* ==================== ORDER MODAL ==================== */
export function OrderModal({
  order,
  isNew,
  onSave,
  onDelete,
  onClose,
}: {
  order: Order;
  isNew: boolean;
  onSave: (o: Order) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Order>({ ...order });
  const set = <K extends keyof Order>(k: K, v: Order[K]) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end animate-fade-in" onClick={onClose}>
      <div
        className="bg-card w-full max-h-[92vh] rounded-t-2xl overflow-y-auto"
        style={{ animation: "slideUp 0.3s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border px-4 py-4 flex items-center justify-between z-10">
          <h2 className="text-base font-bold text-foreground">
            {isNew ? "Новый заказ" : `Заказ #${order.id}`}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Icon name="X" size={16} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {!isNew && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Статус</label>
              <div className="flex gap-1.5 mt-2">
                {(["pending", "active", "done", "cancelled"] as OrderStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => set("status", s)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      form.status === s
                        ? `${statusClass[s]} border-current`
                        : "bg-muted text-muted-foreground border-transparent"
                    }`}
                  >
                    {statusLabel[s]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Field label="Адрес доставки" icon="MapPin">
            <input
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-transparent"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="ул. Ленина, 42, кв. 15"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Получатель" icon="User">
              <input
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-transparent"
                value={form.recipient}
                onChange={(e) => set("recipient", e.target.value)}
                placeholder="Иванов С.И."
              />
            </Field>
            <Field label="Телефон" icon="Phone">
              <input
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-transparent"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+7 (900) 000-00-00"
              />
            </Field>
          </div>

          <Field label="Дата доставки" icon="Calendar">
            <input
              type="date"
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground border border-transparent"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Время с" icon="Clock">
              <input
                type="time"
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground border border-transparent"
                value={form.timeFrom}
                onChange={(e) => set("timeFrom", e.target.value)}
              />
            </Field>
            <Field label="Время до" icon="Clock">
              <input
                type="time"
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground border border-transparent"
                value={form.timeTo}
                onChange={(e) => set("timeTo", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Оплата (₽)" icon="Banknote">
              <input
                type="number"
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground border border-transparent"
                value={form.payment}
                onChange={(e) => set("payment", Number(e.target.value))}
                placeholder="0"
              />
            </Field>
            <Field label="Способ оплаты" icon="CreditCard">
              <select
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground border border-transparent"
                value={form.paymentType}
                onChange={(e) => set("paymentType", e.target.value as "cash" | "card" | "online")}
              >
                <option value="cash">Наличные</option>
                <option value="card">Карта</option>
                <option value="online">Онлайн</option>
              </select>
            </Field>
          </div>

          <Field label="Вес / Объём" icon="Package">
            <input
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-transparent"
              value={form.weight}
              onChange={(e) => set("weight", e.target.value)}
              placeholder="1.5 кг"
            />
          </Field>

          <Field label="Комментарий" icon="MessageSquare">
            <textarea
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border border-transparent resize-none"
              rows={2}
              value={form.comment}
              onChange={(e) => set("comment", e.target.value)}
              placeholder="Особые пожелания..."
            />
          </Field>

          <div className="flex gap-2 pt-2">
            {!isNew && (
              <button
                onClick={() => onDelete(order.id)}
                className="w-10 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0"
              >
                <Icon name="Trash2" size={16} className="text-red-500" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-muted text-foreground rounded-xl py-3 text-sm font-medium"
            >
              Отмена
            </button>
            <button
              onClick={() => onSave(form)}
              className="flex-1 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold"
            >
              {isNew ? "Создать" : "Сохранить"}
            </button>
          </div>
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}

/* ==================== ORDERS TAB ==================== */
export function OrdersTab({
  orders,
  filterStatus,
  setFilterStatus,
  onEdit,
  activeCount,
  doneCount,
}: {
  orders: Order[];
  filterStatus: string;
  setFilterStatus: (v: "all" | "active" | "done") => void;
  onEdit: (o: Order) => void;
  activeCount: number;
}) {
  return (
    <div className="p-4 space-y-3 animate-fade-in">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "В пути", value: activeCount - (orders.filter(o => o.status === "pending").length), color: "text-green-600" },
          { label: "Ожидают", value: orders.filter(o => o.status === "pending").length, color: "text-orange-500" },
          { label: "Всего", value: activeCount, color: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-3 border border-border text-center">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 bg-muted rounded-xl p-1">
        {[
          { id: "all", label: "Все" },
          { id: "active", label: "В пути" },
          { id: "pending", label: "Ожидают" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterStatus(f.id as "all" | "active" | "done")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all ${
              filterStatus === f.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="PackageX" size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Нет заказов</p>
        </div>
      ) : (
        orders.map((order, i) => (
          <div
            key={order.id}
            onClick={() => onEdit(order)}
            className="bg-card border border-border rounded-xl p-4 card-hover cursor-pointer animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">#{order.id}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusClass[order.status]}`}>
                  {statusLabel[order.status]}
                </span>
              </div>
              <div className="flex items-center gap-1 text-primary font-semibold text-sm">
                <Icon name={paymentIcon[order.paymentType]} size={14} />
                <span>{order.payment} ₽</span>
              </div>
            </div>
            <p className="text-sm font-medium text-foreground mb-1 leading-snug">{order.address}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{order.recipient}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="Clock" size={11} />
                <span>{order.timeFrom} — {order.timeTo}</span>
              </div>
            </div>
            {order.comment && (
              <p className="text-xs text-muted-foreground mt-2 bg-muted rounded-lg px-2 py-1">
                💬 {order.comment}
              </p>
            )}
          </div>
        ))
      )}
      <div className="h-2" />
    </div>
  );
}