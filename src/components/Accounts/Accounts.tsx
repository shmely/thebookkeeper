import './Accounts.css';
import { useKeeper } from '../../context/KeeperContext';
import AccountItem from './AccountItem';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';

import { useState } from 'react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function Accounts() {
    const { accounts, getAccounts, addAccount, deleteAccount, updateAccount } = useKeeper();
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

    const handleClickOpen = () => {
        setShowAddDialog(true);
    };
    const handleClose = () => {
        setShowAddDialog(false);
    };
    return (
        <main className='accounts-container'>
            {accounts.map((account) => (
                <AccountItem key={account.accountId} account={account} />
            ))}
            <Paper role='button' elevation={3} className='account-item' onClick={handleClickOpen}>
                <IconButton size='large' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    הוסף חשבון
                    <AddIcon fontSize='large' />
                </IconButton>
            </Paper>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={showAddDialog}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Modal title
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                        dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                        consectetur ac, vestibulum at eros.
                    </Typography>
                    <Typography gutterBottom>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
                        Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
                    </Typography>
                    <Typography gutterBottom>
                        Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
                        magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
                        ullamcorper nulla non metus auctor fringilla.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Save changes
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </main>
    )
}