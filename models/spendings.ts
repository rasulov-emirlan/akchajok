export interface Spending {
  id: number;
  name: string;
  amount: number;
  currency: Currency;
  date: Date;
}

export type Currency = "KGS" | "USD" | "EUR";
