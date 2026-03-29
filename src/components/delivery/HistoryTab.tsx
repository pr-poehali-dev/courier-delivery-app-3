import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Order, statusLabel, statusClass, paymentIcon } from "./types";

export function HistoryTab({
  orders,
  onEdit,
  editMode,
}: {
  orders: Order[];
  onEdit: (o: Order) => void;
  editMode: boolean;
}) {
  const doneOrders = orders
    .filter((o) => o.status === "done" || o.status === "cancelled")
    .sort((a, b) => b.date.localeCompare(a.date));

  const [search, setSearch] = useState("");

  const filtered = doneOrders.filter(
    (o) =>
      o.address.toLowerCase().includes(search.toLowerCase()) ||
      o.recipient.toLowerCase().includes(search.toLowerCase())
  );

  const totalSum = doneOrders
    .filter((o) => o.status === "done")
    .reduce((s, o) => s + o.payment, 0);

  const totalDone = doneOrders.filter((o) => o.status === "done").length;
  const totalCancelled = doneOrders.filter((o) => o.status === "cancelled").length;

  const groupedByDate = filtered.reduce<Record<string, Order[]>>((acc, o) => {
    if (!acc[o.date]) acc[o.date] = [];
    acc[o.date].push(o);
    return acc;
  }, {});

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-");
    const months = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
    return `${day} ${months[Number(m) - 1]} ${y}`;
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-green-600">{totalDone}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Доставлено</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-primary">{totalSum} ₽</p>
          <p className="text-xs text-muted-foreground mt-0.5">Заработано</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-muted-foreground">{totalCancelled}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Отменено</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
          placeholder="Поиск по адресу или получателю..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Icon name="X" size={14} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {/* List grouped by date */}
      {Object.keys(groupedByDate).length === 0 ? (
        <div className="text-center py-12">
          <Icon name="ClipboardList" size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {search ? "Ничего не найдено" : "История пуста"}
          </p>
        </div>
      ) : (
        Object.entries(groupedByDate).map(([date, dayOrders]) => (
          <div key={date} className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {formatDate(date)}
              </p>
              <div className="flex-1 h-px bg-border" />
              <p className="text-xs text-muted-foreground">
                {dayOrders.filter((o) => o.status === "done").reduce((s, o) => s + o.payment, 0)} ₽
              </p>
            </div>
            {dayOrders.map((order, i) => (
              <div
                key={order.id}
                onClick={editMode ? () => onEdit(order) : undefined}
                className={`bg-card border rounded-xl p-4 animate-fade-in transition-all ${
                  editMode
                    ? "border-primary/40 cursor-pointer ring-1 ring-primary/20 hover:border-primary/70"
                    : "border-border"
                }`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">#{order.id}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusClass[order.status]}`}>
                      {statusLabel[order.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                      <Icon name={paymentIcon[order.paymentType]} size={13} className="text-muted-foreground" />
                      <span className={order.status === "cancelled" ? "text-muted-foreground line-through" : ""}>
                        {order.payment} ₽
                      </span>
                    </div>
                    {editMode && (
                      <Icon name="Pencil" size={11} className="text-primary animate-scale-in" />
                    )}
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
              </div>
            ))}
          </div>
        ))
      )}
      <div className="h-2" />
    </div>
  );
}