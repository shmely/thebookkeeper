// src/components/Accounts/AccountsList.tsx
import './Accounts.css';
import { useKeeper } from '../../context/KeeperContext';
import AccountItem from './AccountItem'; // Assuming this exists
import { IconButton, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import AddAccountDialog from '../EditAccountDialog/EditAccountDialog'; // Assuming this exists

export default function AccountsList() {
    const { getAccounts } = useKeeper();
    const [showEditAccountDialog, setShowEditAccountDialog] = useState<boolean>(false);

    const handleClickOpen = () => setShowEditAccountDialog(true);
    const handleClose = () => setShowEditAccountDialog(false);

    // Get the dynamic accounts (which now come from Firebase via context!)
    const accounts = getAccounts();

    return (
        <main className='accounts-container'>
            {accounts.map((account) => (
                <AccountItem key={account.accountId} account={account} />
            ))}
            
            <Paper role='button' elevation={3} className='account-item' onClick={handleClickOpen}>
                <IconButton 
                    size='large' 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        width: '100%', 
                        height: '100%', 
                        borderRadius: 0 
                    }}
                >
                    הוסף חשבון
                    <AddIcon fontSize='large' />
                </IconButton>
            </Paper>
            
            <AddAccountDialog open={showEditAccountDialog} onClose={handleClose} />
        </main>
    );
}