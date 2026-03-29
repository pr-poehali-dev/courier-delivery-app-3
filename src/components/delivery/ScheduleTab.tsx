import { useState } from "react";
import { Order, statusClass } from "./types";

export function ScheduleTab({ orders }: { orders: Order[] }) {
  const [selectedDate, setSelectedDate] = useState("2026-03-29");

  const dates = ["2026-03-27", "2026-03-28", "2026-03-29", "2026-03-30", "2026-03-31"];
  const dayLabels: Record<string, string> = {
    "2026-03-27": "Пт", "2026-03-28": "Сб", "2026-03-29": "Вс",
    "2026-03-30": "Пн", "2026-03-31": "Вт",
  };
  const dayNums: Record<string, string> = {
    "2026-03-27": "27", "2026-03-28": "28", "2026-03-29": "29",
    "2026-03-30": "30", "2026-03-31": "31",
  };

  const dayOrders = orders
    .filter((o) => o.date === selectedDate)
    .sort((a, b) => a.timeFrom.localeCompare(b.timeFrom));

  const hours = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
  ];

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {dates.map((d) => {
          const cnt = orders.filter((o) => o.date === d).length;
          return (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`flex-shrink-0 flex flex-col items-center w-14 py-2.5 rounded-xl border transition-all ${
                selectedDate === d
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-card border-border text-foreground hover:border-primary/30"
              }`}
            >
              <span className="text-xs font-medium opacity-70">{dayLabels[d]}</span>
              <span className="text-base font-bold mt-0.5">{dayNums[d]}</span>
              {cnt > 0 && (
                <span className={`text-xs mt-0.5 font-semibold ${selectedDate === d ? "text-primary-foreground/80" : "text-primary"}`}>
                  {cnt}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            {selectedDate === "2026-03-29" ? "Сегодня" : selectedDate.split("-").reverse().slice(0, 2).join(".")}
          </p>
          <span className="text-xs text-muted-foreground">{dayOrders.length} заказов</span>
        </div>
        <div className="p-4 space-y-0.5">
          {hours.map((h, idx) => {
            const slotOrders = dayOrders.filter((o) => {
              const oh = o.timeFrom.split(":")[0];
              const hh = h.split(":")[0];
              return oh === hh;
            });
            if (slotOrders.length === 0 && idx % 2 !== 0) return null;
            return (
              <div key={h} className="flex gap-3 min-h-[40px]">
                <div className="w-12 flex-shrink-0 pt-2">
                  <span className="text-xs font-mono text-muted-foreground">{h}</span>
                </div>
                <div className={`flex-1 border-l pl-3 pb-1 space-y-1 ${slotOrders.length > 0 ? "border-primary/30" : "border-border"}`}>
                  {slotOrders.map((order) => (
                    <div key={order.id} className={`rounded-lg px-3 py-2 text-xs ${statusClass[order.status]}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate max-w-[140px]">{order.address.split(",")[0]}</span>
                        <span className="font-semibold ml-2 flex-shrink-0">{order.payment} ₽</span>
                      </div>
                      <span className="opacity-70">{order.timeFrom}–{order.timeTo} · {order.recipient.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-foreground">{dayOrders.length}</p>
          <p className="text-xs text-muted-foreground">Заказов</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-primary">{dayOrders.reduce((s, o) => s + o.payment, 0)} ₽</p>
          <p className="text-xs text-muted-foreground">Выручка</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-foreground">
            {dayOrders.filter((o) => o.status === "active" || o.status === "pending").length}
          </p>
          <p className="text-xs text-muted-foreground">Активных</p>
        </div>
      </div>
    </div>
  );
}
