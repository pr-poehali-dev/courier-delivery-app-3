export type OrderStatus = "active" | "pending" | "done" | "cancelled";

export interface Order {
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

export interface Payment {
  id: string;
  orderId: string;
  address: string;
  amount: number;
  type: "cash" | "card" | "online";
  date: string;
  status: "paid" | "pending" | "cancelled";
}

export type Tab = "orders" | "history" | "map" | "schedule" | "payments" | "profile";

export const INITIAL_ORDERS: Order[] = [
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

export const INITIAL_PAYMENTS: Payment[] = [
  { id: "p001", orderId: "004", address: "пр. Просвещения, 55", amount: 420, type: "cash", date: "2026-03-28", status: "paid" },
  { id: "p002", orderId: "005", address: "ул. Московская, 12", amount: 600, type: "card", date: "2026-03-27", status: "paid" },
  { id: "p003", orderId: "001", address: "ул. Ленина, 42", amount: 350, type: "cash", date: "2026-03-29", status: "pending" },
  { id: "p004", orderId: "002", address: "пр. Невский, 100", amount: 500, type: "card", date: "2026-03-29", status: "pending" },
];

export const statusLabel: Record<OrderStatus, string> = {
  active: "В пути",
  pending: "Ожидает",
  done: "Доставлено",
  cancelled: "Отменён",
};

export const statusClass: Record<OrderStatus, string> = {
  active: "status-active",
  pending: "status-pending",
  done: "status-done",
  cancelled: "status-cancelled",
};

export const paymentIcon: Record<string, string> = {
  cash: "Banknote",
  card: "CreditCard",
  online: "Smartphone",
};

export const paymentLabel: Record<string, string> = {
  cash: "Наличные",
  card: "Карта",
  online: "Онлайн",
};