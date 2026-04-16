import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, ToggleButtonGroup, ToggleButton, Typography
} from '@mui/material';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import {type TransactionType } from '../../interface/types';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const AddTransactionModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');

  const handleTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: TransactionType | null
  ) => {
    if (newType !== null) setType(newType);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 4, direction: 'rtl', p: 1 } }}
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
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            variant="outlined" 
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
                gap: 1,
                '&.Mui-selected': { bgcolor: '#3f51b5', color: 'white', '&:hover': { bgcolor: '#303f9f' } }
              }}
            >
              <ArrowDownward fontSize="small" color="error" />
              <Typography variant="button">הוצאה</Typography>
            </ToggleButton>
            
            <ToggleButton 
              value="income" 
              sx={{ 
                py: 1.5, 
                gap: 1,
                '&.Mui-selected': { bgcolor: '#f5f5f5', color: 'rgba(0,0,0,0.6)' } 
              }}
            >
              <ArrowUpward fontSize="small" color="success" />
              <Typography variant="button">הוספה</Typography>
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField 
            label="תאריך" 
            type="date" 
            defaultValue="2026-04-16"
            fullWidth 
            InputLabelProps={{ shrink: true }} 
          />

          <TextField 
            label="הערה" 
            fullWidth 
            multiline 
            rows={3} 
            placeholder="הערה..."
          />

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, justifyContent: 'space-between', gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          fullWidth
          sx={{ borderRadius: 2, height: 45 }}
        >
          ביטול
        </Button>
        <Button 
          variant="contained" 
          fullWidth
          disabled={!amount}
          sx={{ borderRadius: 2, height: 45, bgcolor: '#e0e0e0' }}
        >
          הוסף
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionModal;