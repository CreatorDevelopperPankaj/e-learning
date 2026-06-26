export interface PaymentModel {
  id: string;
  userId: string;
  amount: number;
  currency?: string;
  status?: string;
  createdAt?: string;
}
