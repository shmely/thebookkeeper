import React, { useState, useEffect } from 'react';
import { useKeeper } from '../../context/KeeperContext';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, ToggleButtonGroup, ToggleButton, Typography
} from '@mui/material';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { type Transaction, type TransactionType } from '../../interface/types';
import rtlFieldStyle from '../../style/rtlFieldStyle';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  accountId: string;
  transaction?: Transaction | undefined;
}

const AddTransactionModal: React.FC<ModalProps> = ({ open, onClose, accountId, transaction }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const { addTransaction, deleteTransaction, updateTransaction } = useKeeper();
  const [amount, setAmount] = useState<string | number>(transaction?.amount || '');
  const [comment, setComment] = useState(transaction?.comment || '');
  const [transactionDate, setTransactionDate] = useState<string>(transaction?.date || new Date().toISOString().split('T')[0]); // Default to today


  useEffect(() => {
    if (transaction) {
      // If editing an existing transaction
      setAmount(Math.abs(transaction.amount)); // Use Math.abs so -50 becomes 50 in the input
      setComment(transaction.comment || '');
      setType(transaction.transactionType);
      setTransactionDate(transaction.date);
    } else {
      // If adding a new transaction, reset to defaults
      setAmount('');
      setComment('');
      setType('expense');
      setTransactionDate(new Date().toISOString().split('T')[0]);
    }
  }, [transaction, open]);

  const handleTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: TransactionType | null
  ) => {
    if (newType !== null) setType(newType);
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setAmount('');
      return;
    }  // 2. Only update if it's a valid integer
    if (Number.isInteger(Number(val))) {
      setAmount(parseInt(val, 10));
    }
  };

  const handleChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleClose = () => {
    setType('expense');
    setAmount('');
    setComment('');
    onClose();
  }

  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionDate(e.target.value);
  }

  const handleSubmit = () => {
    // Here you would typically send the new transaction data to your backend or state management
    if (amount === '') return;
    const transactionId: string = crypto.randomUUID();
    const finalAmount = type === 'expense' ? Number(amount) * -1 : Number(amount);
    if (transaction) {
      updateTransaction(transaction.transactionId, { accountId, transactionType: type, amount: finalAmount, comment, date: transactionDate });
    } else {
      addTransaction(accountId, { accountId, transactionType: type, amount: finalAmount, comment, date: transactionDate, transactionId });
    }
    handleClose();
  }


  const onDeleteTransaction = () => {
    if (transaction) {
      deleteTransaction(transaction.transactionId);
    }
    handleClose();
  }


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            direction: 'rtl',
            p: 1
          }
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, pb: 1 }}>
        הוסף עסקה חדשה
      </DialogTitle>


      <DialogContent sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          <TextField
            label="סכום"
            fullWidth
            value={amount}
            onChange={handleChangeAmount}
            type="number"
            variant="outlined"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e') {
                e.preventDefault();
              }
            }}
            sx={rtlFieldStyle}
          />

          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleTypeChange}
            fullWidth
          >
            <ToggleButton
              value="expense"
              sx={{
                py: 1.5,
                borderRadius: '5px',
                gap: 1,
                '&.Mui-selected': { marginLeft: '10px', borderRadius: '5px', bgcolor: '#3f51b5', color: 'white', '&:hover': { bgcolor: '#303f9f' } },
                '& .MuiToggleButton-root': {
                  borderRadius: '5px !important', // Forces all corners to 5px
                  border: '1px solid #ccc !important', // Optional: gives each button its own border
                },
              }}
            >
              <ArrowDownward fontSize="small" color="error" />
              <Typography variant="button">הוצאה</Typography>
            </ToggleButton>

            <ToggleButton
              value="income"
              sx={{
                py: 1.5,
                borderRadius: '5px',
                gap: 1,
                '&.Mui-selected': { borderRadius: '5px', bgcolor: '#3f51b5', color: 'rgba(0,0,0,0.6)', '&:hover': { bgcolor: '#303f9f' } },
                '&.MuiToggleButton-root': {
                  borderRadius: '5px !important', // Forces all corners to 5px
                  border: '1px solid #ccc !important', // Optional: gives each button its own border
                },
              }}
            >
              <ArrowUpward fontSize="small" color="success" />
              <Typography variant="button">הוספה</Typography>
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="תאריך"
            type="date"
            defaultValue={transactionDate}
            onChange={onChangeDate}
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: 0 } // Note: 'inputProps' became 'htmlInput' in slotProps
            }}
            sx={rtlFieldStyle}
          />

          <TextField
            label="הערה"
            fullWidth
            multiline
            rows={3}
            value={comment}
            onChange={handleChangeComment}
            placeholder="הערה..."
            sx={rtlFieldStyle}
          />

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, justifyContent: 'space-between', gap: 2 }}>
        {transaction &&
          <Button
            color="error"
            variant="outlined"
            fullWidth
            onClick={onDeleteTransaction}>
            מחק
          </Button>
        }
        <Button
          onClick={handleClose}
          variant="outlined"
          fullWidth
          sx={{ borderRadius: 2, height: 45 }}
        >
          ביטול
        </Button>
        <Button
          variant="contained"
          fullWidth
          disabled={amount === '' || amount === 0 || comment.trim().length < 3}
          sx={{ borderRadius: 2, height: 45 }}
          onClick={handleSubmit}
        >
          {transaction ? 'עדכן' : 'הוסף'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionModal;