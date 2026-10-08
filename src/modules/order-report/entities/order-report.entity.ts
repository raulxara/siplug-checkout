export type OrderCartItem = {
  id: string;
  checkoutSessionId: string;
  itemRef: string | null;
  name: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
};
export type OrderReportRow = {
  id: string;
  code: string;
  customer: string;
  email: string | null;
  createdAt: string;
  items: number;
  cart: OrderCartItem[];
  amount: number;
  currency: string;
  method: string;
  requestedMethod: string | null;
  actualMethod: string | null;
  status: string;
};
export type OrderReportFilters = {
  view?: 'orders' | 'abandoned';
  q?: string;
  start?: string;
  end?: string;
  methods?: string[];
  statuses?: string[];
  sort?: string;
  direction?: string;
  page?: number;
  perPage?: number;
  asOf?: string;
};
