import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Order, Payment, Tab, INITIAL_ORDERS, INITIAL_PAYMENTS } from "@/components/delivery/types";
import { OrdersTab, OrderModal } from "@/components/delivery/OrdersTab";
import { HistoryTab } from "@/components/delivery/HistoryTab";
import { MapTab } from "@/components/delivery/MapTab";
import { ScheduleTab } from "@/components/delivery/ScheduleTab";
import { PaymentsTab, PaymentModal } from "@/components/delivery/PaymentsTab";

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
  const displayOrders = filterStatus === "all" ? activeOrders : activeOrders.filter((o) => o.status === filterStatus);

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
          status: "pending" as const,
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
            <h1 className="text-xl font-bold text-foreground tracking-tight">Достависта</h1>
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
            { id: "history", label: "История", icon: "ClipboardList" },
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
          />
        )}
        {tab === "history" && (
          <HistoryTab
            orders={orders}
            onEdit={setEditingOrder}
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