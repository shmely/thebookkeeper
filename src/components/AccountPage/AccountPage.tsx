import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Container, Typography, Card, CardContent, Button, IconButton,
    List, ListItem, ListItemIcon, ListItemText, Chip, Menu, MenuItem, Fab
} from '@mui/material';
import {
    ArrowForward, Add, Refresh, CalendarToday,
    AccountBalanceWallet, TrendingUp, WhatsApp,
    TrendingDown
} from '@mui/icons-material';
import { useKeeper } from '../../context/KeeperContext';
import AddTransactionModal from './AddTransactionModal';
import type { Transaction } from '../../interface/types';
type RouteParams = {
    accountId: string;
};

interface DateRange {
    from: Date;
    to: Date;
}


const getCurrentMonthRange = (): DateRange => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // יום ראשון של החודש הנוכחי
    const from = new Date(year, month, 1);

    // יום אחרון של החודש הנוכחי (יום 0 של החודש הבא)
    const to = new Date(year, month + 1, 0);

    // הגדרת השעה לסוף היום (23:59:59) כדי שהטווח יכלול את כל היום האחרון
    to.setHours(23, 59, 59, 999);

    return { from, to };
};

const AccountPage: React.FC = () => {
    const { accountId } = useParams<RouteParams>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { getTransactions, getAccounts } = useKeeper();
    const navigate = useNavigate();
    const transactions: Transaction[] = getTransactions(accountId);
    const dateRange = getCurrentMonthRange();
    const currentAccount = getAccounts().find(account => account.accountId === accountId);
    const isBalancePositive = currentAccount?.accountBalance !== undefined && currentAccount.accountBalance >= 0;

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);

    return (
        <Box sx={{ direction: 'rtl', bgcolor: '#f9f9f9', minHeight: '100vh', pt: 2, pb: 10 }}>
            <Container maxWidth="sm">

                {/* Back Button Section */}
                <Box role="button" onClick={() => navigate(-1)} sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer', width: 'fit-content' }}>
                    <ArrowForward fontSize="small" sx={{ color: '#6200ea', ml: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#6200ea', fontWeight: 500 }}>חזור</Typography>
                </Box>

                {/* Balance Card */}
                <Card sx={{ borderRadius: 4, mb: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <CardContent sx={{ pt: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>{currentAccount?.accountNickname}</Typography>
                        <Typography variant="overline" color="text.secondary">יתרה נוכחית</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: isBalancePositive ? '#2e7d32' : '#d32f2f', my: 1 }}>₪{currentAccount?.accountBalance?.toLocaleString('he-IL')}</Typography>
                        <Chip
                            icon={isBalancePositive ? <TrendingUp style={{ color: isBalancePositive ? '#2e7d32' : '#d32f2f' }} /> : <TrendingDown style={{ color: isBalancePositive ? '#2e7d32' : '#d32f2f' }} />}
                            label={isBalancePositive ? 'יתרה חיובית' : 'יתרה שלילית'}
                            color="success"
                            variant="outlined"
                            sx={{ fontWeight: 'bold', border: 'none' }}
                        />
                    </CardContent>
                </Card>

                {/* Actions Row */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<Add />}
                        onClick={() => setIsModalOpen(true)}
                        sx={{ bgcolor: '#7c4dff', borderRadius: 2, height: 48, '&:hover': { bgcolor: '#651fff' } }}
                    >
                        הוסף עסקה
                    </Button>

                    <IconButton sx={{ bgcolor: '#eeeeee', borderRadius: 2, p: 1.5 }}>
                        <Refresh />
                    </IconButton>

                    <Button
                        variant="outlined"
                        startIcon={<CalendarToday />}
                        onClick={handleMenuOpen}
                        sx={{ borderRadius: 2, height: 48, borderColor: '#7c4dff', color: '#7c4dff', whiteSpace: 'nowrap', minWidth: '150px', gap: 1.5 }}
                    >
                        חודש אחרון
                    </Button>
                </Box>

                {/* Date Filter Dropdown */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{ sx: { width: 200, borderRadius: 2, boxShadow: 3 } }}
                >
                    {['חודש אחרון', '3 חודשים אחרונים', '6 חודשים אחרונים', '12 חודשים אחרונים', 'מתחילת השנה', 'טווח מותאם אישית'].map((text) => (
                        <MenuItem key={text} onClick={handleMenuClose} sx={{ textAlign: 'right', py: 1.5 }}>
                            {text}
                        </MenuItem>
                    ))}
                </Menu>

                {/* Transactions List */}
                <List sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    {transactions.filter((transaction) => {
                        const date = new Date(transaction.date);
                        return date >= dateRange.from && date <= dateRange.to;
                    }).map((item) => (
                        <ListItem
                            key={item.transactionId}
                            divider
                            sx={{ py: 1.5, '&:last-child': { borderBottom: 'none' } }}
                        >
                            <ListItemIcon sx={{ minWidth: 44 }}>
                                <Box sx={{ bgcolor: '#f3e5f5', p: 1, borderRadius: 1.5, display: 'flex' }}>
                                    <AccountBalanceWallet sx={{ color: '#7c4dff', fontSize: 20 }} />
                                </Box>
                            </ListItemIcon>
                            <ListItemText
                                primary={item.comment}
                                secondary={item.date}
                                primaryTypographyProps={{ fontWeight: 500, variant: 'body2' }}
                                sx={{ textAlign: 'right' }}
                            />
                            <Typography
                                variant="body1"
                                sx={{ fontWeight: 700, color: item.ilsAmount >= 0 ? '#2e7d32' : '#d32f2f' }}
                            >
                                ₪{Math.abs(item.ilsAmount)}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Container>

            {/* Floating Action Button */}
            <Fab color="success" sx={{ position: 'fixed', bottom: 20, left: 20, bgcolor: '#4caf50' }}>
                <WhatsApp />
            </Fab>

            <AddTransactionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Box>
    );
};

export default AccountPage;

