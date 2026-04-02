export interface Transaction {
    transactionId: string;
    accountId: string;
    amount: number;
    ilsAmount: number;
    /** Date string in YYYY-MM-DD format */
    date: string;
    comment: string;
    isRealBankAction: boolean;
}

export interface Account {
    accountId: string;
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

