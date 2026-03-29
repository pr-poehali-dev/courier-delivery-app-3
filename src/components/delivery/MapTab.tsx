import Icon from "@/components/ui/icon";
import { Order } from "./types";

export function MapTab({ orders }: { orders: Order[] }) {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-52 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute border-t border-slate-500" style={{ top: `${i * 14}%`, left: 0, right: 0 }} />
            ))}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute border-l border-slate-500" style={{ left: `${i * 17}%`, top: 0, bottom: 0 }} />
            ))}
          </div>
          <div className="relative text-center">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Icon name="Navigation" size={24} className="text-primary-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">Интеграция с картами</p>
            <p className="text-xs text-muted-foreground mt-1">Яндекс Карты / Google Maps</p>
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Маршрут на сегодня</p>
            <span className="text-xs text-muted-foreground">{orders.length} точек</span>
          </div>
          <button className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
            <Icon name="Navigation" size={16} />
            Построить маршрут
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Точки доставки</p>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="MapPin" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Нет активных заказов</p>
          </div>
        ) : (
          orders.map((order, i) => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{order.address}</p>
                <p className="text-xs text-muted-foreground">{order.timeFrom} — {order.timeTo}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-primary">{order.payment} ₽</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Итого по маршруту</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Точек</p>
            <p className="text-2xl font-bold text-foreground">{orders.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Выручка</p>
            <p className="text-2xl font-bold text-primary">{orders.reduce((s, o) => s + o.payment, 0)} ₽</p>
          </div>
        </div>
      </div>
    </div>
  );
}
