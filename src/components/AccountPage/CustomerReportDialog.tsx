import React, { useRef, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, Typography, Table, TableBody,
    TableCell, TableHead, TableRow, Grid
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import type { Transaction } from '../../interface/types';
import dayjs from 'dayjs';
import rtlFieldStyle from '../../style/rtlFieldStyle';



interface CustomerReportDialogProps {
    open: boolean;
    onClose: () => void;
    accountName: string;
    initialDateRange: { from: number; to: number };
    transactions: Transaction[];
}

export const CustomerReportDialog: React.FC<CustomerReportDialogProps> = ({
    open,
    onClose,
    accountName,
    initialDateRange,
    transactions
}) => {
    // ניהול הסטייט בתוך המודל
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [customerName, setCustomerName] = useState(accountName);
    const [dateRange, setDateRange] = useState(initialDateRange);

    // סינון עסקאות לפי טווח התאריכים (בהנחה שהתאריכים בפורמט YYYY-MM-DD)
    const filteredTransactions = transactions.filter(t => {
        const txDate = dayjs(t.date).valueOf();
        return txDate >= dateRange.from && txDate <= dateRange.to;
    });

    // חישוב סיכום החשבון
    const totalAmount = filteredTransactions.reduce((acc, curr) => {
        return curr.transactionType === 'expense' ? acc - curr.amount : acc + curr.amount;
    }, 0);

    // רפרנס לאזור ההדפסה
    const printRef = useRef<HTMLDivElement>(null);

    // פונקציית יצירת ה-PDF
    const handlePrint = useReactToPrint({
        contentRef: printRef, // הרפרנס מועבר ישירות כאובייקט
        documentTitle: `דוח_חשבון_${customerName}`,
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth dir="rtl">
            <DialogTitle>הפקת פירוט ללקוח</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="לכבוד"
                            fullWidth
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            sx={rtlFieldStyle} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="תאריך חשבון"
                            type="date"
                            fullWidth
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            sx={rtlFieldStyle}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="מתאריך"
                            type="date"
                            fullWidth
                            value={dayjs(dateRange.from).format('YYYY-MM-DD')}
                            onChange={(e) => {
                                const newTimestamp = dayjs(e.target.value).valueOf();
                                setDateRange({ ...dateRange, from: newTimestamp });
                            }}
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            sx={rtlFieldStyle}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="עד תאריך"
                            type="date"
                            fullWidth
                            value={dayjs(dateRange.to).format('YYYY-MM-DD')}
                            onChange={(e) => {
                                const newTimestamp = dayjs(e.target.value).valueOf();
                                setDateRange({ ...dateRange, to: newTimestamp });
                            }}
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                            sx={rtlFieldStyle}
                        />
                    </Grid>
                </Grid>

                {/* תצוגה מקדימה מוסתרת שמשמשת רק ליצירת ה-PDF */}
                <Box>
                    <Box
                        ref={printRef}
                        sx={{
                            p: 4,
                            direction: 'rtl',
                            fontFamily: 'Arial, sans-serif',
                            color: 'black', // חובה: הבטחת צבע שחור שלא ייעלם בהדפסה
                            '@media print': {
                                paddingTop: '25mm', // חובה: דוחף את התוכן למטה כדי שהמדפסת לא תחתוך אותו
                            }
                        }}
                    >
                        {/* תאריך מיושר לשמאל בצורה בטוחה באמצעות Flex */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                            <Typography variant="body1" sx={{ color: 'black' }}>
                                תאריך: {invoiceDate}
                            </Typography>
                        </Box>

                        {/* כותרת מרכזית (פוצל ל-2 שורות כדי למנוע שבירת שורות מכוערת ב-PDF) */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
                                חשבון לטווח תאריכים
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'black' }}>
                                {dayjs(dateRange.from).format('DD-MM-YYYY')} - {dayjs(dateRange.to).format('DD-MM-YYYY')}
                            </Typography>
                        </Box>

                        {/* לכבוד */}
                        <Typography variant="body1" sx={{ mb: 3, color: 'black' }}>
                            לכבוד: <strong>{customerName}</strong>
                        </Typography>

                        {/* טבלת הנתונים המודפסת */}
                        <Table size="small" sx={{ direction: 'rtl' }}>
                            <TableHead sx={{ direction: 'rtl' }}>
                                <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', direction: 'rtl' }}>תאריך</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', direction: 'rtl' }}>תיאור</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', direction: 'rtl' }}>סכום</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ direction: 'rtl' }}>
                                {filteredTransactions.map((tx, index) => (
                                    <TableRow key={tx.transactionId} sx={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5' }}>
                                        <TableCell sx={{ direction: 'rtl' }} align="center">{tx.date}</TableCell>
                                        <TableCell sx={{ direction: 'rtl' }} align="center">{tx.comment}</TableCell>
                                        <TableCell align="center" sx={{ color: tx.transactionType === 'expense' ? 'error.main' : 'inherit', direction: 'rtl', textAlign: 'center' }}>
                                            <Typography
                                                variant="body1"
                                                component="div" // Changes the underlying element to a div to act as a flex container
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between', // Pushes the number and symbol apart
                                                    alignItems: 'center',
                                                    width: '90px', // **The Magic Fix:** Fixed width forces all rows to align perfectly
                                                    margin: '0 auto', // Centers this fixed-width box perfectly inside the TableCell
                                                    direction: 'rtl',
                                                    fontWeight: 700,
                                                    color: tx.amount >= 0 ? '#2e7d32' : '#d32f2f',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: 18
                                                }}
                                            >
                                                <span>
                                                    {tx.amount.toLocaleString('he-IL', {
                                                        style: 'decimal', // Use decimal instead of currency
                                                        maximumFractionDigits: 0
                                                    })}
                                                </span>
                                                <span>₪</span>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* שורת סיכום */}
                                <TableRow sx={{ direction: 'rtl' }}>
                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold', textAlign: 'center', direction: 'rtl' }}>
                                        סיכום כולל:
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', direction: 'rtl', textAlign: 'center' }}>
                                        <Typography
                                            variant="body1"
                                            component="div" // Changes the underlying element to a div to act as a flex container
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between', // Pushes the number and symbol apart
                                                alignItems: 'center',
                                                width: '90px', // **The Magic Fix:** Fixed width forces all rows to align perfectly
                                                margin: '0 auto', // Centers this fixed-width box perfectly inside the TableCell
                                                direction: 'rtl',
                                                fontWeight: 700,
                                                color: totalAmount >= 0 ? '#2e7d32' : '#d32f2f',
                                                whiteSpace: 'nowrap',
                                                fontSize: 18
                                            }}
                                        >
                                            <span>
                                                {totalAmount.toLocaleString('he-IL', {
                                                    style: 'decimal', // Use decimal instead of currency
                                                    maximumFractionDigits: 0
                                                })}
                                            </span>
                                            <span>₪</span>
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary">
                    סה"כ {filteredTransactions.length} תנועות נמצאו בטווח התאריכים.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">ביטול</Button>
                <Button onClick={handlePrint} variant="contained" color="primary">
                    הפק PDF
                </Button>
            </DialogActions>
        </Dialog>
    );
};