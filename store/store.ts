import { create } from "zustand";
import { Spending } from "../models/spendings";

export interface SpendingStore {
  spendings: Spending[];
  spendingsTotal: number;
  spengingsByMonth: (month: number) => Spending[];
  setSpendings: (spendings: Spending[]) => void;
  addSpending: (spending: Spending) => void;
  deleteSpending: (id: number) => void;
  updateSpendingAmount: (id: number, newAmount: number) => void;
}

export const useSpendingStore = create<SpendingStore>((set, get) => ({
  spendings: [],
  spendingsTotal: 0,

  spengingsByMonth: (month) => {
    return get().spendings.filter(
      (spending) => spending.date.getMonth() === month
    );
  },

  setSpendings: (spendings) => {
    set((state) => ({
      spendings,
      spendingsTotal: spendings.reduce(
        (total, spending) => total + spending.amount,
        0
      ),
    }));
  },

  addSpending: (spending) => {
    set((state) => ({
      spendings: [...state.spendings, spending],
    }));
  },

  deleteSpending: (id) => {
    set((state) => ({
      spendings: state.spendings.filter((spending) => spending.id !== id),
    }));
  },

  updateSpendingAmount: (id, newAmount) => {
    set((state) => ({
      spendings: state.spendings.map((spending) =>
        spending.id === id ? { ...spending, amount: newAmount } : spending
      ),
    }));
  },
}));
