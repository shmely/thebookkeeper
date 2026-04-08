import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface AccountActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

const AccountActions = ({ onEdit, onDelete }: AccountActionsProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        onEdit();
        handleClose();
    }

    const handleDelete = () => {
        onDelete();
        handleClose();
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                id="wallet-menu-button"
                aria-controls={open ? 'wallet-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                size="small"
            >
                <MoreVertIcon sx={{ color: 'text.secondary' }} />
            </IconButton>

            <Menu
                id="wallet-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'wallet-menu-button',
                    sx: { py: 0.5 }
                }}
                // Position the menu to open from the right side (RTL friendly)
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 2,
                            minWidth: '150px',
                            mt: 0.5
                        }
                    }
                }}
            >
                <MenuItem
                    onClick={handleEdit}
                    sx={{
                        justifyContent: 'flex-end', // Aligns text to the right
                        textAlign: 'right',
                        direction: 'rtl'
                    }}
                >
                    <Typography variant="body2">ערוך פרטי ארנק</Typography>
                </MenuItem>

                <MenuItem
                    onClick={handleClose}
                    sx={{
                        justifyContent: 'flex-end',
                        textAlign: 'right',
                        direction: 'rtl'
                    }}
                >
                    <Typography variant="body2">שתף ארנק</Typography>
                </MenuItem>

                <MenuItem
                    onClick={handleDelete}
                    sx={{
                        justifyContent: 'flex-end',
                        textAlign: 'right',
                        direction: 'rtl'
                    }}
                >
                    <Typography variant="body2">מחק ארנק</Typography>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default AccountActions;