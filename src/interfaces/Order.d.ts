interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  amount: string;
  status: "Processing" | "Completed" | "Awaiting Payment";
}
