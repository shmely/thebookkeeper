import './Accounts.css';
import { useKeeper } from '../../context/KeeperContext';
import AccountItem from './AccountItem';

export default function Accounts() {
    const { accounts, getAccounts, addAccount, deleteAccount, updateAccount } = useKeeper();

    return (
        <main className='accounts-container'>
            {accounts.map((account) => (
                <AccountItem key={account.accountId} account={account} />
            ))}
            <div style={{ color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Add new account
            </div>
        </main>
    )
}