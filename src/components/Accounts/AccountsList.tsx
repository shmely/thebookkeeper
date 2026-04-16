import './Accounts.css';
import { useKeeper } from '../../context/KeeperContext';
import AccountItem from './AccountItem';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import AddAccountDialog from '../EditAccountDialog/EditAccountDialog';

export default function AccountsList() {
    const { getAccounts } = useKeeper();
    const [showEditAccountDialog, setshowEditAccountDialog] = useState<boolean>(false);

    const handleClickOpen = () => {
        setshowEditAccountDialog(true);
    };
    const handleClose = () => {
        setshowEditAccountDialog(false);
    };


    return (
        <main className='accounts-container'>
            {getAccounts().map((account) => (
                <AccountItem key={account.accountId} account={account} />
            ))}
            <Paper role='button' elevation={3} className='account-item' onClick={handleClickOpen}>
                <IconButton size='large' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', borderRadius: 0 }}>
                    הוסף חשבון
                    <AddIcon fontSize='large' />
                </IconButton>
            </Paper>
            <AddAccountDialog open={showEditAccountDialog} onClose={handleClose} />
        </main>
    )
}