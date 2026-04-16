import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Container, Typography, Card, CardContent, Button, IconButton,
    List, ListItem, ListItemIcon, ListItemText, Chip, Menu, MenuItem, Fab
} from '@mui/material';
import {
    ArrowForward, Add, Refresh, CalendarToday,
    AccountBalanceWallet, TrendingUp, WhatsApp
} from '@mui/icons-material';
import { useKeeper } from '../../context/KeeperContext';
import AddTransactionModal from './AddTransactionModal';
type RouteParams = {
  accountId: string;
};

const AccountPage: React.FC = () => {
    const { accountId } = useParams<RouteParams>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { getTransactions } = useKeeper();


    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);

    return (
        <Box sx={{ direction: 'rtl', bgcolor: '#f9f9f9', minHeight: '100vh', pt: 2, pb: 10 }}>
            <Container maxWidth="sm">

                {/* Back Button Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer', width: 'fit-content' }}>
                    <ArrowForward fontSize="small" sx={{ color: '#6200ea', ml: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#6200ea', fontWeight: 500 }}>חזור</Typography>
                </Box>

                {/* Balance Card */}
                <Card sx={{ borderRadius: 4, mb: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <CardContent sx={{ pt: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mb: 1 }}>
                            מזהה# 002
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>איתמר יתרה</Typography>
                        <Typography variant="overline" color="text.secondary">יתרה נוכחית</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#2e7d32', my: 1 }}>₪980</Typography>
                        <Chip
                            icon={<TrendingUp style={{ color: 'inherit' }} />}
                            label="יתרה חיובית"
                            color="success"
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
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
                        sx={{ borderRadius: 2, height: 48, borderColor: '#7c4dff', color: '#7c4dff', whiteSpace: 'nowrap' }}
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
                    {getTransactions(accountId, new Date(2025, 1, 1).toDateString(), new Date(2026, 12, 31).toDateString()).map((item) => (
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
                                sx={{ fontWeight: 700, color: item.amount > 0 ? '#2e7d32' : '#d32f2f' }}
                            >
                                ₪{item.amount}
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

