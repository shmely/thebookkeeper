import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Transaction, Account } from '../interface/types';
import { auth, db } from '../fireebaseConfig';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';

interface KeeperContextType {
  getAccounts: () => Account[];
  addAccount: (account: Omit<Account, 'accountId'>) => Promise<void>;
  updateAccount: (accountId: string, updates: Partial<Account>) => Promise<void>;
  deleteAccount: (accountId: string) => Promise<void>;
  transactions: Transaction[];
  getTransactions: (accountId: string | undefined) => Transaction[];
  addTransaction: (accountId: string, transaction: Omit<Transaction, 'transactionId' | 'accountId'>) => Promise<void>;
  updateTransaction: (transactionId: string | undefined, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (transactionId: string | undefined) => Promise<void>;
}

// ===== Context Creation =====
const KeeperContext = createContext<KeeperContextType | undefined>(undefined);

// ===== Provider Component =====
interface KeeperProviderProps {
  children: ReactNode;
}

export const KeeperProvider: React.FC<KeeperProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // This forces React to update when they log in!
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setAccounts([]);
      setTransactions([]);
      return;
    }

    // 1. Listen to this user's Accounts
    const accountsRef = collection(db, 'users', user.uid, 'accounts');
    const unsubscribeAccounts = onSnapshot(accountsRef, (snapshot) => {
      const fetchedAccounts = snapshot.docs.map(doc => ({
        accountId: doc.id, // FIREBASE GENERATED ID
        ...doc.data()
      })) as Account[];
      setAccounts(fetchedAccounts);
    });

    // 2. Listen to this user's Transactions
    const transactionsRef = collection(db, 'users', user.uid, 'transactions');
    const unsubscribeTransactions = onSnapshot(transactionsRef, (snapshot) => {
      const fetchedTransactions = snapshot.docs.map(doc => ({
        transactionId: doc.id, // FIREBASE GENERATED ID
        ...doc.data()
      })) as Transaction[];
      setTransactions(fetchedTransactions);
    });

    // Cleanup listeners when component unmounts
    return () => {
      unsubscribeAccounts();
      unsubscribeTransactions();
    };
  }, [user]);


  // ===== Account Methods =====
  const getAccounts = (): Account[] => {
    return accounts.map(account => {
      const accountTransactions = transactions.filter(t => t.accountId === account.accountId);
      const transactionsSum = accountTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const initialBalance = account.accountBalance ?? 0;

      return {
        ...account,
        accountBalance: initialBalance + transactionsSum
      };
    });
  };

  const addAccount = async (account: Omit<Account, 'accountId'>) => {
    if (!user) return;
    if (!account.accountBalance) {
      account.accountBalance = 0; // Default to 0 if not provided
    }
    const accountsRef = collection(db, 'users', user.uid, 'accounts');
    await addDoc(accountsRef, account);
  };

  const updateAccount = async (accountId: string, updates: Partial<Account>) => {
    if (!user) return;
    const accountDocRef = doc(db, 'users', user.uid, 'accounts', accountId);
    await updateDoc(accountDocRef, updates);
  };

  const deleteAccount = async (accountId: string) => {
    if (!user) return;

    // 1. Delete the account document
    const accountDocRef = doc(db, 'users', user.uid, 'accounts', accountId);
    await deleteDoc(accountDocRef);

    // 2. Delete all transactions belonging to this account using a Batch
    const batch = writeBatch(db);
    const txnsToDelete = transactions.filter(t => t.accountId === accountId);

    txnsToDelete.forEach(txn => {
      if (!txn.transactionId) return; // Safety check
      const txnRef = doc(db, 'users', user.uid, 'transactions', txn?.transactionId);
      batch.delete(txnRef);
    });

    await batch.commit();
  };

  // ===== Transaction Methods =====
  const getTransactions = (accountId: string | undefined): Transaction[] => {
    if (!accountId) return [];
    return transactions.filter(t => t.accountId === accountId);
  };

  const addTransaction = async (accountId: string | undefined, transaction: Omit<Transaction, 'transactionId' | 'accountId'>) => {
    if (!user || !accountId) return;
    const transactionsRef = collection(db, 'users', user.uid, 'transactions');
    await addDoc(transactionsRef, {
      ...transaction,
      accountId // Attach the accountId to the transaction
    });
  };

  const updateTransaction = async (transactionId: string | undefined, updates: Partial<Transaction>) => {
    if (!user || !transactionId) return;
    const txnDocRef = doc(db, 'users', user.uid, 'transactions', transactionId);
    await updateDoc(txnDocRef, updates);
  };

  const deleteTransaction = async (transactionId: string | undefined) => {
    if (!user || !transactionId) return;
    const txnDocRef = doc(db, 'users', user.uid, 'transactions', transactionId);
    await deleteDoc(txnDocRef);
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
