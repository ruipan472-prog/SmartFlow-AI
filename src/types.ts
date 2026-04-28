/**
 * Shared types for SmartFlow AI
 */

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: 'Business' | 'Personal' | 'Uncategorized';
  source: 'Bank' | 'PayPal' | 'WeChat Pay';
  confidence: number;
}

export interface CreditHealth {
  score: number;
  label: 'Good' | 'Fair' | 'Needs Improvement';
  lastUpdated: string;
  factors: {
    name: string;
    value: number;
    description: string;
  }[];
}

export type UserRole = 'proprietor' | 'bank';

export interface Applicant {
  id: string;
  businessName: string;
  ownerName: string;
  score: number;
  status: 'Pending' | 'Approved' | 'Review';
  lastUpdated: string;
  sector: string;
}

export interface AppState {
  role: UserRole;
  isPremium: boolean;
  transactions: Transaction[];
  creditHealth?: CreditHealth;
  isClassifying: boolean;
  view: 'upload' | 'dashboard' | 'transactions' | 'bank_dashboard' | 'applicant_detail';
  selectedApplicant?: Applicant;
}
