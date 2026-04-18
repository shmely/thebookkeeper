import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Box,
    Collapse,
    Link,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    type SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { Account } from '../../interface/types';
import rtlFieldStyle from '../../style/rtlFieldStyle';
import { useKeeper } from '../../context/KeeperContext';


interface EditAccountDialog {
    open: boolean;
    onClose: () => void;
    account?: Account;
}

const EditAccountDialog: React.FC<EditAccountDialog> = ({ open, onClose, account }) => {
    const { addAccount, updateAccount } = useKeeper();
    const [showOptional, setShowOptional] = useState(false);
    const [formData, setFormData] = useState<Omit<Account, 'accountId'>>(() => {
        if (account) {
            const { accountId, ...rest } = account;
            return rest;
        }
        return {
            accountNickname: '',
            firstName: '',
            lastName: '',
            currencyCode: 'ILS',
            accountBalance: undefined,
        };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'accountBalance' ? (value === '' ? undefined : Number(value)) : value,
        }));
    };

    const handleCurrencyChange = (event: SelectChangeEvent) => {
        setFormData((prev) => ({ ...prev, currencyCode: event.target.value }));
    };

    const handleSubmit = () => {
        const newAccount: Account = {
            ...formData,
            accountId: crypto.randomUUID(), // Generating a temp ID
        };
        if (account) {
            updateAccount(account.accountId, formData);
        } else {
            addAccount(newAccount);
        }
        handleClose();
    };



    const handleClose = () => {
        setFormData({
            accountNickname: '',
            firstName: '',
            lastName: '',
            currencyCode: 'ILS',
            accountBalance: undefined,
        });
        setShowOptional(false);
        onClose();
    };

    const isFormValid = formData.accountNickname.trim() !== '';

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            dir=''
            slotProps={{ paper: { sx: { borderRadius: 3, p: 1, } } }}
        >
            <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center', fontWeight: 'bold' }}>
                הוסף ארנק חדש
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 1 }}>
                    {/* Icon Header */}
                    <Box
                        sx={{
                            backgroundColor: '#f0f2f5',
                            borderRadius: '50%',
                            p: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <AccountBalanceIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
                    </Box>

                    {/* Nickname Field */}
                    <TextField
                        fullWidth
                        label="כינוי לארנק"
                        name="accountNickname"
                        variant="outlined"
                        value={formData.accountNickname}
                        onChange={handleChange}
                        sx={rtlFieldStyle}
                    />

                    {/* Optional Fields Toggle */}
                    <Box sx={{ width: '100%', textAlign: 'left' }}>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => setShowOptional(!showOptional)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'underline',
                                color: 'text.secondary',
                                gap: 0.5
                            }}
                        >
                            {showOptional ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                            הוסף שם בעלים (אופציונלי)
                        </Link>
                    </Box>

                    {/* Collapsible Section */}
                    <Collapse in={showOptional} sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                fullWidth
                                label="שם פרטי"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                sx={rtlFieldStyle}
                            />
                            <TextField
                                fullWidth
                                label="שם משפחה"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                sx={rtlFieldStyle}
                            />
                        </Box>
                    </Collapse>

                    {/* Currency Select */}
                    <FormControl fullWidth sx={rtlFieldStyle} disabled >
                        <InputLabel id="currency-label">מטבע</InputLabel>
                        <Select
                            labelId="currency-label"
                            value={formData.currencyCode}
                            label="מטבע"
                            onChange={handleCurrencyChange}
                            renderValue={(value) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>₪ {value}</span>
                                </Box>
                            )}
                            sx={{ textAlign: 'right' }} // Aligns the selected value to the right
                        >
                            <MenuItem value="ILS">₪ ILS</MenuItem>
                            <MenuItem value="USD">$ USD</MenuItem>
                            <MenuItem value="EUR">€ EUR</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Initial Balance */}
                    <TextField
                        fullWidth
                        label="יתרה התחלתית (אופציונלי)"
                        name="accountBalance"
                        type="number"
                        value={formData.accountBalance ?? ''}
                        onChange={handleChange}
                        sx={rtlFieldStyle}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end' }}>
                <Button onClick={handleClose} color="primary" sx={{ fontWeight: 'bold' }}>
                    ביטול
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!isFormValid}
                    sx={{
                        px: 4,
                        borderRadius: 2,
                        boxShadow: 'none',
                        '&:disabled': { backgroundColor: '#e0e0e0' }
                    }}
                >
                    הוסף
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAccountDialog;