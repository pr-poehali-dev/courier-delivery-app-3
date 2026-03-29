import { useState } from "react";
import Icon from "@/components/ui/icon";

type OrderStatus = "active" | "pending" | "done" | "cancelled";

interface Order {
  id: string;
  address: string;
  recipient: string;
  phone: string;
  timeFrom: string;
  timeTo: string;
  date: string;
  payment: number;
  paymentType: "cash" | "card" | "online";
  status: OrderStatus;
  comment: string;
  weight: string;
}

interface Payment {
  id: string;
  orderId: string;
  address: string;
  amount: number;
  type: "cash" | "card" | "online";
  date: string;
  status: "paid" | "pending" | "cancelled";
}

const INITIAL_ORDERS: Order[] = [
  {
    id: "001",
    address: "ул. Ленина, 42, кв. 15",
    recipient: "Иванов Сергей",
    phone: "+7 (921) 123-45-67",
    timeFrom: "10:00",
    timeTo: "12:00",
    date: "2026-03-29",
    payment: 350,
    paymentType: "cash",
    status: "active",
    comment: "Позвонить за 15 минут",
    weight: "2.5 кг",
  },
  {
    id: "002",
    address: "пр. Невский, 100, оф. 201",
    recipient: "Петрова Анна",
    phone: "+7 (911) 987-65-43",
    timeFrom: "13:00",
    timeTo: "15:00",
    date: "2026-03-29",
    payment: 500,
    paymentType: "card",
    status: "pending",
    comment: "Хрупкое, осторожно",
    weight: "1.2 кг",
  },
  {
    id: "003",
    address: "ул. Садовая, 7, кв. 3",
    recipient: "Козлов Дмитрий",
    phone: "+7 (900) 111-22-33",
    timeFrom: "16:00",
    timeTo: "18:00",
    date: "2026-03-29",
    payment: 280,
    paymentType: "online",
    status: "active",
    comment: "",
    weight: "0.8 кг",
  },
  {
    id: "004",
    address: "пр. Просвещения, 55, кв. 80",
    recipient: "Смирнова Ольга",
    phone: "+7 (965) 444-55-66",
    timeFrom: "09:00",
    timeTo: "11:00",
    date: "2026-03-28",
    payment: 420,
    paymentType: "cash",
    status: "done",
    comment: "Код домофона: 1234",
    weight: "3.0 кг",
  },
  {
    id: "005",
    address: "ул. Московская, 12, кв. 5",
    recipient: "Новиков Павел",
    phone: "+7 (999) 777-88-99",
    timeFrom: "14:00",
    timeTo: "16:00",
    date: "2026-03-27",
    payment: 600,
    paymentType: "card",
    status: "done",
    comment: "",
    weight: "5.0 кг",
  },
];

const INITIAL_PAYMENTS: Payment[] = [
  { id: "p001", orderId: "004", address: "пр. Просвещения, 55", amount: 420, type: "cash", date: "2026-03-28", status: "paid" },
  { id: "p002", orderId: "005", address: "ул. Московская, 12", amount: 600, type: "card", date: "2026-03-27", status: "paid" },
  { id: "p003", orderId: "001", address: "ул. Ленина, 42", amount: 350, type: "cash", date: "2026-03-29", status: "pending" },
  { id: "p004", orderId: "002", address: "пр. Невский, 100", amount: 500, type: "card", date: "2026-03-29", status: "pending" },
];

const statusLabel: Record<OrderStatus, string> = {
  active: "В пути",
  pending: "Ожидает",
  done: "Доставлено",
  cancelled: "Отменён",
};

const statusClass: Record<OrderStatus, string> = {
  active: "status-active",
  pending: "status-pending",
  done: "status-done",
  cancelled: "status-cancelled",
};

const paymentIcon: Record<string, string> = {
  cash: "Banknote",
  card: "CreditCard",
  online: "Smartphone",
};

const paymentLabel: Record<string, string> = {
  cash: "Наличные",
  card: "Карта",
  online: "Онлайн",
};

type Tab = "orders" | "map" | "schedule" | "payments";

export default function Index() {
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "done">("all");
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const activeOrders = orders.filter((o) => o.status === "active" || o.status === "pending");
  const doneOrders = orders.filter((o) => o.status === "done" || o.status === "cancelled");
  const displayOrders = filterStatus === "all" ? orders : filterStatus === "active" ? activeOrders : doneOrders;

  const todayOrders = orders.filter((o) => o.date === "2026-03-29");
  const totalEarned = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  const saveOrder = (o: Order) => {
    if (orders.find((x) => x.id === o.id)) {
      setOrders((prev) => prev.map((x) => (x.id === o.id ? o : x)));
    } else {
      setOrders((prev) => [o, ...prev]);
      setPayments((prev) => [
        {
          id: "p" + Date.now(),
          orderId: o.id,
          address: o.address.split(",")[0],
          amount: o.payment,
          type: o.paymentType,
          date: o.date,
          status: "pending",
        },
        ...prev,
      ]);
    }
    setEditingOrder(null);
    setShowAddOrder(false);
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setPayments((prev) => prev.filter((p) => p.orderId !== id));
    setEditingOrder(null);
  };

  const savePayment = (p: Payment) => {
    setPayments((prev) => prev.map((x) => (x.id === p.id ? p : x)));
    setEditingPayment(null);
  };

  const newOrderTemplate = (): Order => ({
    id: String(Date.now()).slice(-4),
    address: "",
    recipient: "",
    phone: "",
    timeFrom: "",
    timeTo: "",
    date: "2026-03-29",
    payment: 0,
    paymentType: "cash",
    status: "pending",
    comment: "",
    weight: "",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 pt-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">КурьерПро</h1>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">29 марта 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Сегодня</p>
              <p className="text-sm font-semibold text-foreground">{todayOrders.length} заказов</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <Icon name="User" size={16} className="text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="flex gap-0">
          {([
            { id: "orders", label: "Заказы", icon: "Package" },
            { id: "map", label: "Маршрут", icon: "Map" },
            { id: "schedule", label: "Расписание", icon: "Clock" },
            { id: "payments", label: "Платежи", icon: "Wallet" },
          ] as { id: Tab; label: string; icon: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`nav-tab flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                tab === t.id ? "active text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {tab === "orders" && (
          <OrdersTab
            orders={displayOrders}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onEdit={setEditingOrder}
            activeCount={activeOrders.length}
            doneCount={doneOrders.length}
          />
        )}
        {tab === "map" && <MapTab orders={activeOrders} />}
        {tab === "schedule" && <ScheduleTab orders={orders} />}
        {tab === "payments" && (
          <PaymentsTab
            payments={payments}
            totalEarned={totalEarned}
            pendingAmount={pendingAmount}
            onEdit={setEditingPayment}
          />
        )}
      </main>

      {/* Add button */}
      {tab === "orders" && (
        <div className="p-4 bg-card border-t border-border">
          <button
            onClick={() => { setEditingOrder(newOrderTemplate()); setShowAddOrder(true); }}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Icon name="Plus" size={18} />
            Новый заказ
          </button>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <OrderModal
          order={editingOrder}
          isNew={showAddOrder}
          onSave={saveOrder}
          onDelete={deleteOrder}
          onClose={() => { setEditingOrder(null); setShowAddOrder(false); }}
        />
      )}

      {/* Edit Payment Modal */}
      {editingPayment && (
        <PaymentModal
          payment={editingPayment}
          onSave={savePayment}
          onClose={() => setEditingPayment(null)}
        />
      )}
    </div>
  );
}

/* ==================== ORDERS TAB ==================== */
function OrdersTab({
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
  doneCount: number;
}) {
  return (
    <div className="p-4 space-y-3 animate-fade-in">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Активных", value: activeCount, color: "text-green-600" },
          { label: "Всего", value: orders.length, color: "text-foreground" },
          { label: "Выполнено", value: doneCount, color: "text-muted-foreground" },
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
          { id: "active", label: "Активные" },
          { id: "done", label: "Выполненные" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterStatus(f.id)}
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

/* ==================== MAP TAB ==================== */
function MapTab({ orders }: { orders: Order[] }) {
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
            <div key={order.id} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
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

/* ==================== SCHEDULE TAB ==================== */
function ScheduleTab({ orders }: { orders: Order[] }) {
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

  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

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
          {hours.map((h) => {
            const slotOrders = dayOrders.filter((o) => {
              const oh = o.timeFrom.split(":")[0];
              const hh = h.split(":")[0];
              return oh === hh;
            });
            if (slotOrders.length === 0 && hours.indexOf(h) % 2 !== 0) return null;
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

/* ==================== PAYMENTS TAB ==================== */
function PaymentsTab({
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
            const val = payments.filter((p) => p.type === item.type && p.status === "paid").reduce((s, p) => s + p.amount, 0);
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

/* ==================== ORDER MODAL ==================== */
function OrderModal({
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

/* ==================== PAYMENT MODAL ==================== */
function PaymentModal({
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
                  onClick={() => set("status", s.v)}
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
            <Field label="Сумма (₽)" icon="Banknote">
              <input
                type="number"
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground border border-transparent"
                value={form.amount}
                onChange={(e) => set("amount", Number(e.target.value))}
              />
            </Field>
            <Field label="Способ" icon="CreditCard">
              <select
                className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground border border-transparent"
                value={form.type}
                onChange={(e) => set("type", e.target.value as "cash" | "card" | "online")}
              >
                <option value="cash">Наличные</option>
                <option value="card">Карта</option>
                <option value="online">Онлайн</option>
              </select>
            </Field>
          </div>

          <Field label="Дата" icon="Calendar">
            <input
              type="date"
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground border border-transparent"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </Field>

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