import type { Account } from '../../interface/types';
import './Accounts.css';

export default function AccountItem( { account }: { account: Account }) {
    return (
        <div className='account-item'>
            <h3>{account.accountNickname}</h3>
            <p>Account Number: {account.accountNumber}</p>
            <p>Balance: {account.accountBalance} {account.currencyCode}</p>
        </div>
    )
}