interface Customer {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  lastPurchaseDate: string;
  lastPurchaseItem: string;
  avatar?: string;
  initials?: string;
  avatarColor?: string;
}
