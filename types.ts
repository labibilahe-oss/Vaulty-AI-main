
export type TransactionType = 'income' | 'expense';
export type TransactionSource = 'manual' | 'receipt' | 'bank_sync';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
  source?: TransactionSource;
}

export interface BudgetGoal {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

export interface UserProfile {
  baseSalary: number;
  otherIncome: number;
  initialAssets: number;
  initialLiabilities: number;
  currency: string;
  isPro: boolean;
  institutionLinked?: boolean;
}

export interface FinancialSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  netWorth: number;
  projectedAnnualIncome: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  sources?: { title: string; uri: string }[];
}

export interface GroundingSource {
  title?: string;
  uri?: string;
  web?: {
    uri: string;
    title: string;
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  impact: string;
}
