import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Transaction, Account } from '../interface/types';

// ===== Dummy Data =====
const DUMMY_ACCOUNTS: Account[] = [
  {
    accountId: 'acc-001',
    accountNickname: 'אלון ומעין יערי',
    firstName: 'אלון',
    lastName: 'יערי',
    currencyCode: 'ILS',
    accountBalance: 1000
  },
  {
    accountId: 'acc-002',
    accountNickname: 'איתמר יתרה',
    firstName: 'איתמר',
    lastName: 'יערי',
    currencyCode: 'ILS',
    accountBalance: 15000
  },
  {
    accountId: 'acc-003',
    accountNumber: 9876543210,
    accountNickname: ' יותם',
    currencyCode: 'ILS'
  },
];

const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    transactionId: 'txn-001',
    accountId: 'acc-001',
    amount: 100,
    ilsAmount: 360,
    date: '2026-03-25',
    comment: 'Grocery shopping',
    isRealBankAction: true,
  },
  {
    transactionId: 'txn-002',
    accountId: 'acc-001',
    amount: 50,
    ilsAmount: 180,
    date: '2026-03-26',
    comment: 'Gas station',
    isRealBankAction: true,
  },
  {
    transactionId: 'txn-003',
    accountId: 'acc-001',
    amount: 200,
    ilsAmount: 720,
    date: '2026-03-27',
    comment: 'Restaurant',
    isRealBankAction: false,
  },
  {
    transactionId: 'txn-004',
    accountId: 'acc-002',
    amount: 500,
    ilsAmount: 500,
    date: '2026-03-24',
    comment: 'Salary deposit',
    isRealBankAction: true,
  },
  {
    transactionId: 'txn-005',
    accountId: 'acc-002',
    amount: 75,
    ilsAmount: 75,
    date: '2026-03-28',
    comment: 'Utility bill',
    isRealBankAction: true,
  },
];

// ===== Context Types =====
interface KeeperContextType {
  getAccounts: () => Account[];
  addAccount: (account: Account) => void;
  updateAccount: (accountId: string, account: Partial<Account>) => void;
  deleteAccount: (accountId: string) => void;

  // Transaction Methods
  transactions: Transaction[];
  getTransactions: (
    accountId: string,
    dateFrom?: string,
    dateTo?: string
  ) => Transaction[];
  addTransaction: (accountId: string, transaction: Transaction) => void;
  updateTransaction: (transactionId: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (transactionId: string) => void;
}

// ===== Context Creation =====
const KeeperContext = createContext<KeeperContextType | undefined>(undefined);

// ===== Provider Component =====
interface KeeperProviderProps {
  children: ReactNode;
}

export const KeeperProvider: React.FC<KeeperProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(DUMMY_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(DUMMY_TRANSACTIONS);

  // ===== Account Methods =====
  const getAccounts = (): Account[] => {
    return [...accounts];
  };

  const addAccount = (account: Account): void => {
    setAccounts((prevAccounts) => [...prevAccounts, account]);
  };

  const updateAccount = (accountId: string, updates: Partial<Account>): void => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account.accountId === accountId ? { ...account, ...updates } : account
      )
    );
  };

  const deleteAccount = (accountId: string): void => {
    setAccounts((prevAccounts) =>
      prevAccounts.filter((account) => account.accountId !== accountId)
    );
    // Also delete all transactions for this account
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.accountId !== accountId)
    );
  };

  // ===== Transaction Methods =====
  const getTransactions = (
    accountId: string,
    dateFrom?: string,
    dateTo?: string
  ): Transaction[] => {
    return transactions.filter((transaction) => {
      const accountMatch = transaction.accountId === accountId;
      const dateMatch =
        (!dateFrom || transaction.date >= dateFrom) &&
        (!dateTo || transaction.date <= dateTo);
      return accountMatch && dateMatch;
    });
  };

  const addTransaction = (accountId: string, transaction: Transaction): void => {
    const newTransaction: Transaction = {
      ...transaction,
      accountId,
    };
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  };

  const updateTransaction = (
    transactionId: string,
    updates: Partial<Transaction>
  ): void => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.transactionId === transactionId
          ? { ...transaction, ...updates }
          : transaction
      )
    );
  };

  const deleteTransaction = (transactionId: string): void => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.transactionId !== transactionId)
    );
  };

  const value: KeeperContextType = {
    getAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    transactions,
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return <KeeperContext.Provider value={value}>{children}</KeeperContext.Provider>;
};

// ===== Custom Hook =====
export const useKeeper = (): KeeperContextType => {
  const context = useContext(KeeperContext);
  if (context === undefined) {
    throw new Error('useKeeper must be used within a KeeperProvider');
  }
  return context;
};
