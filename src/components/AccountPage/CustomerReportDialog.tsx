import React, { useRef, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, Typography, Table, TableBody,
    TableCell, TableHead, TableRow, Grid
} from '@mui/material';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
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
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [customerName, setCustomerName] = useState(accountName);
    const [dateRange, setDateRange] = useState(initialDateRange);

    const filteredTransactions = transactions.filter(t => {
        const txDate = dayjs(t.date).valueOf();
        return txDate >= dateRange.from && txDate <= dateRange.to;
    });

    const totalAmount = filteredTransactions.reduce((acc, curr) => {
        return curr.transactionType === 'expense' ? acc - curr.amount : acc + curr.amount;
    }, 0);

    const printRef = useRef<HTMLDivElement>(null);

    // פונקציית הורדה ישירה
    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element) return;

        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // הורדה אוטומטית ישירות למכשיר (מחשב או מובייל)
            pdf.save(`דוח_חשבון_${customerName}.pdf`);
            
        } catch (error) {
            console.error("שגיאה ביצירת ה-PDF:", error);
        }
    };

    // פונקציה לייצור הטבלה (מונעת שכפול קוד בין התצוגה במסך לבין תבנית ה-PDF)
    const renderTable = (isForPrint: boolean) => {
        const textColor = isForPrint ? 'black' : 'inherit';

        return (
            <Table size="small" sx={{ direction: 'rtl' }}>
                <TableHead sx={{ direction: 'rtl' }}>
                    <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                        <TableCell align="center" sx={{ fontWeight: 'bold', direction: 'rtl', color: textColor }}>תאריך</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', direction: 'rtl', color: textColor }}>תיאור</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', direction: 'rtl', color: textColor }}>סכום</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ direction: 'rtl' }}>
                    {filteredTransactions.map((tx, index) => (
                        <TableRow key={tx.transactionId} sx={{ backgroundColor: index % 2 === 0 ? (isForPrint ? '#ffffff' : 'inherit') : '#f5f5f5' }}>
                            <TableCell sx={{ direction: 'rtl', color: textColor }} align="center">{tx.date}</TableCell>
                            <TableCell sx={{ direction: 'rtl', color: textColor }} align="center">{tx.comment}</TableCell>
                            <TableCell align="center" sx={{ color: tx.transactionType === 'expense' ? 'error.main' : textColor, direction: 'rtl', textAlign: 'center' }}>
                                <Typography
                                    variant="body1"
                                    component="div"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '90px',
                                        margin: '0 auto',
                                        direction: 'rtl',
                                        fontWeight: 700,
                                        color: tx.amount >= 0 ? '#2e7d32' : '#d32f2f',
                                        whiteSpace: 'nowrap',
                                        fontSize: 18
                                    }}
                                >
                                    <span>
                                        {tx.amount.toLocaleString('he-IL', { style: 'decimal', maximumFractionDigits: 0 })}
                                    </span>
                                    <span>₪</span>
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow sx={{ direction: 'rtl' }}>
                        <TableCell colSpan={2} sx={{ fontWeight: 'bold', textAlign: 'center', direction: 'rtl', color: textColor }}>
                            סיכום כולל:
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', direction: 'rtl', textAlign: 'center' }}>
                            <Typography
                                variant="body1"
                                component="div"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '90px',
                                    margin: '0 auto',
                                    direction: 'rtl',
                                    fontWeight: 700,
                                    color: totalAmount >= 0 ? '#2e7d32' : '#d32f2f',
                                    whiteSpace: 'nowrap',
                                    fontSize: 18
                                }}
                            >
                                <span>
                                    {totalAmount.toLocaleString('he-IL', { style: 'decimal', maximumFractionDigits: 0 })}
                                </span>
                                <span>₪</span>
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    };

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
                            slotProps={{ inputLabel: { shrink: true } }}
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
                            slotProps={{ inputLabel: { shrink: true } }}
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
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={rtlFieldStyle}
                        />
                    </Grid>
                </Grid>

                {/* === תצוגה מקדימה למשתמש (UI) === */}
                <Box sx={{ mt: 4, mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        תצוגה מקדימה:
                    </Typography>
                    <Box sx={{ overflowX: 'auto' }}>
                        {renderTable(false)} {/* קריאה לטבלה ללא הגדרות הדפסה נוקשות */}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        סה"כ {filteredTransactions.length} תנועות נמצאו בטווח התאריכים.
                    </Typography>
                </Box>

                {/* === תבנית נסתרת להפקת ה-PDF (A4) === */}
                <Box 
                    sx={{ 
                        position: 'absolute', 
                        top: '-9999px', 
                        left: '-9999px',
                        zIndex: -1
                    }}
                >
                    <Box
                        ref={printRef}
                        sx={{
                            p: 4,
                            direction: 'rtl',
                            fontFamily: 'Arial, sans-serif',
                            color: 'black',
                            backgroundColor: 'white',
                            width: '210mm',
                            minHeight: '297mm',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                            <Typography variant="body1" sx={{ color: 'black' }}>
                                תאריך: {invoiceDate}
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
                                חשבון לטווח תאריכים
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'black' }}>
                                {dayjs(dateRange.from).format('DD-MM-YYYY')} - {dayjs(dateRange.to).format('DD-MM-YYYY')}
                            </Typography>
                        </Box>

                        <Typography variant="body1" sx={{ mb: 3, color: 'black' }}>
                            לכבוד: <strong>{customerName}</strong>
                        </Typography>

                        {renderTable(true)} {/* קריאה לטבלה עם הגדרות הדפסה (צבע שחור ורקע לבן) */}
                    </Box>
                </Box>

            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">ביטול</Button>
                <Button onClick={handleDownloadPDF} variant="contained" color="primary">
                    הורד PDF
                </Button>
            </DialogActions>
        </Dialog>
    );
};