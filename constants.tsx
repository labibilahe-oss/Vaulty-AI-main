
import React from 'react';

export const CATEGORIES = [
  'Housing',
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Utilities',
  'Income',
  'Investment',
  'Other'
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' }
];

export const MOCK_TRANSACTIONS = [
  { id: '1', date: '2024-05-01', amount: 5000, category: 'Income', description: 'Salary', type: 'income' },
  { id: '2', date: '2024-05-02', amount: 1200, category: 'Housing', description: 'Monthly Rent', type: 'expense' },
  { id: '3', date: '2024-05-05', amount: 150, category: 'Food', description: 'Grocery Store', type: 'expense' },
  { id: '4', date: '2024-05-07', amount: 80, category: 'Transportation', description: 'Gas Station', type: 'expense' },
  { id: '5', date: '2024-05-10', amount: 200, category: 'Entertainment', description: 'Concert Tickets', type: 'expense' },
];

export const INITIAL_BUDGETS = [
  { id: 'b1', category: 'Food', limit: 600, spent: 150 },
  { id: 'b2', category: 'Housing', limit: 1200, spent: 1200 },
  { id: 'b3', category: 'Transportation', limit: 300, spent: 80 },
];
