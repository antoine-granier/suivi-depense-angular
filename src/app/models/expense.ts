export interface Expense {
    id: number;
    groupId: number;
    description: string;
    amount: number;
    category: string;
    recurring: boolean;
    date: Date;
  }
  