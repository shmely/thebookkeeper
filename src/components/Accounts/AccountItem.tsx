import { useState } from 'react';
import './Accounts.css';
import { useNavigate } from 'react-router-dom';
import type { Account } from '../../interface/types';
import { currencies } from '../../interface/currencies';
import Paper from '@mui/material/Paper';
import AccountActions from '../AccountActions/AccountActions';
import EditAccountDialog from '../EditAccountDialog/EditAccountDialog';
import { useKeeper } from '../../context/KeeperContext';


export default function AccountItem({ account }: { account: Account }) {
    const navigate = useNavigate();
    const { deleteAccount } = useKeeper();
    const [showEditAccountDialog, setshowEditAccountDialog] = useState<boolean>(false);
    const currencyInfo = currencies[account.currencyCode];
    const fontClass = (account?.accountBalance ?? 0) >= 0 ? 'plus' : 'minus';

    const handleClose = () => {
        setshowEditAccountDialog(false);
    };

    const handleClickOpen = () => {
        setshowEditAccountDialog(true);
    };

    const handleDelete = () => {
        deleteAccount(account.accountId);
    }

    const handleTransactionDialog = (accountId: string) => {
        navigate(`base/account/${accountId}`);
    }



    return (
        <Paper elevation={3} className='account-item'>
            <div role='button'  className='account-button' onClick={() => handleTransactionDialog(account.accountId)}>
                <div className='account-button-title'>
                    <h2>{account.accountNickname}</h2>
                    <AccountActions onEdit={handleClickOpen} onDelete={handleDelete} />
                </div>
                <div className='account-button-subtitle'>
                    <p>{account.firstName} {account.lastName}</p>
                </div>
                <div className={'account-button-balance ' + fontClass}>
                    <span className='balance-text' style={{ marginLeft: 0 }}>{account.accountBalance ?? 0}</span>
                    <span className='balance-text'>{currencyInfo?.symbol}</span>
                    <span dangerouslySetInnerHTML={{ __html: currencyInfo?.flag }} />
                </div>
            </div>
            <EditAccountDialog open={showEditAccountDialog} onClose={handleClose} account={account} />
        </Paper>
    )
}