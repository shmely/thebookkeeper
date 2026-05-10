import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
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
            onClose={onClose} // Closes if user clicks outside the dialog
            dir="rtl"
        >
            <DialogTitle alignSelf={'center'}>בחר טווח תאריכים</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2, minWidth: '300px', alignItems: 'flex-start' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Typography variant="subtitle1" align="center" color='#1a237e' fontWeight="bold" marginRight={5}>
                        מתאריך
                    </Typography>
                    <DateCalendar
                        value={tempFromDate}
                        onChange={(newValue) => { if (newValue) setTempFromDate(newValue); }}
                        slots={{
                            rightArrowIcon: ChevronLeftIcon, // Point Left
                            leftArrowIcon: ChevronRightIcon, // Point Right
                        }}
                        sx={{
                            // 1. Center the whole header block
                            '& .MuiPickersCalendarHeader-root': {
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'relative',
                            },
                            // 2. THE FIX: Remove the default margin that pushes the text to the side
                            '& .MuiPickersCalendarHeader-labelContainer': {
                                margin: 0,
                            },
                            // 3. Keep your arrows split and functional
                            '& .MuiPickersArrowSwitcher-root': {
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                pointerEvents: 'none',
                            },
                            '& .MuiIconButton-root': {
                                pointerEvents: 'auto',
                            }
                        }}

                    />
                    <Typography variant="subtitle1" align="center" color='#1a237e' fontWeight="bold" marginRight={5}>
                        עד תאריך
                    </Typography>
                    <DateCalendar
                        value={tempToDate}
                        onChange={(newValue) => { if (newValue) setTempToDate(newValue); }}
                        minDate={tempFromDate || undefined}
                        slots={{
                            rightArrowIcon: ChevronLeftIcon, // Point Left
                            leftArrowIcon: ChevronRightIcon, // Point Right
                        }}
                        sx={{
                            // 1. Center the whole header block
                            '& .MuiPickersCalendarHeader-root': {
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'relative',
                            },
                            // 2. THE FIX: Remove the default margin that pushes the text to the side
                            '& .MuiPickersCalendarHeader-labelContainer': {
                                margin: 0,
                            },
                            // 3. Keep your arrows split and functional
                            '& .MuiPickersArrowSwitcher-root': {
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                pointerEvents: 'none',
                            },
                            '& .MuiIconButton-root': {
                                pointerEvents: 'auto',
                            }
                        }}
                    />
                </LocalizationProvider>

            </DialogContent>
            <DialogActions sx={{ pb: 2, px: 3 }}>
                <Button onClick={onClose} color="inherit">
                    ביטול
                </Button>
                <Button onClick={handleConfirm} variant="contained">
                    אישור
                </Button>
            </DialogActions>
        </Dialog>
    );
}