import type { Dayjs } from "dayjs";

export type TransactionType = 'income' | 'expense';

export interface Transaction {
    transactionId?: string;
    accountId: string;
    amount: number;
    transactionType: TransactionType;
    date: string;
    comment: string;
}

export interface Account {
    accountId?: string;
    accountNumber?: number;
    accountNickname: string;
    firstName?: string;
    lastName?: string;
    currencyCode: string; // e.g., "ILS"
    accountBalance?: number;
    todayILSRate?: number;
    isOwner?: boolean;
    hasWriteAccess?: boolean;
    sharedUsers?: string[];
}

export interface DateRange {
    from: Dayjs;
    to: Dayjs;
}
