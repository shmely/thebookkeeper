import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { DateCalendar, DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import type { DateRange } from '../../interface/types';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


interface CustomDateRangeDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (dateRange: DateRange) => void;
    dateRange: DateRange;
}



export default function CustomDateRangeDialog({
    open,
    onClose,
    onConfirm,
    dateRange

}: CustomDateRangeDialogProps) {
    const [tempFromDate, setTempFromDate] = useState<Dayjs>(dayjs(dateRange.from));
    const [tempToDate, setTempToDate] = useState<Dayjs>(dayjs(dateRange.to));

    const handleConfirm = () => {
        if (tempFromDate && tempToDate) {

            onConfirm({
                from: tempFromDate,
                to: tempToDate
            });
        }
    };

    useEffect(() => {
        if (open) {
            setTempFromDate(dayjs(dateRange.from));
            setTempToDate(dayjs(dateRange.to));
        }
    }, [open, dateRange]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            dir="rtl"
            sx={{ '& .MuiDialogContent-root': { padding: '0', alignItems: 'center !important', gap: 2 } }}
        >
            <DialogTitle alignSelf={'center'} color='#1a237e'>בחר טווח תאריכים</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', pt: 2, minWidth: '300px', alignItems: 'flex-start' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Typography variant="subtitle1" align="center" color='#1a237e' fontWeight="bold" marginRight={5}>
                        מתאריך
                    </Typography>
                    <DatePicker
                        value={tempFromDate}
                        onChange={(newValue) => { if (newValue) setTempFromDate(newValue); }}
                        slots={{
                            rightArrowIcon: ChevronLeftIcon, // Point Left
                            leftArrowIcon: ChevronRightIcon, // Point Right
                        }}
                        sx={{
                            // Target the wrapper holding the calendar icon
                            '& .MuiInputAdornment-root': {
                                marginInlineStart: '1rem !important', // Pushes the icon away from the text (respects RTL)
                            }
                        }}

                    />
                    <Typography variant="subtitle1" align="center" color='#1a237e' fontWeight="bold" marginRight={5}>
                        עד תאריך
                    </Typography>
                    <DatePicker
                        value={tempToDate}
                        onChange={(newValue) => { if (newValue) setTempToDate(newValue); }}
                        minDate={tempFromDate || undefined}
                        slots={{
                            rightArrowIcon: ChevronLeftIcon, // Point Left
                            leftArrowIcon: ChevronRightIcon, // Point Right
                        }}
                        sx={{
                            // Target the wrapper holding the calendar icon
                            '& .MuiInputAdornment-root': {
                                marginInlineStart: '1rem !important', // Pushes the icon away from the text (respects RTL)
                            }
                        }}
                    />
                </LocalizationProvider>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    ביטול
                </Button>
                <Button onClick={handleConfirm} variant="contained" sx={{ ml: '0 !important' }}>
                    אישור
                </Button>
            </DialogActions>
        </Dialog>
    );
}