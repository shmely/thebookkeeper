import './Accounts.css';
import type { Account } from '../../interface/types';
import { currencies } from '../../interface/currencies';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function AccountItem({ account }: { account: Account }) {
    const currencyInfo = currencies[account.currencyCode];
    const fontClass = (account?.accountBalance ?? 0) >= 0 ? 'plus' : 'minus';
    return (
        <Paper elevation={3} className='account-item'>
            <div role='button' className='account-button'>
                <div className='account-button-title'>
                    <h2>{account.accountNickname}</h2>
                    <IconButton size='small' style={{ marginLeft: '8px' }} >
                        <MoreVertIcon fontSize='small' />
                    </IconButton>
                </div>
                <div className='account-button-subtitle'>
                    <p>{account.firstName} {account.lastName}</p>
                </div>
                <div className={'account-button-balance ' + fontClass}>
                    <span className='balance-text' style={{ marginLeft: 0 }}>{account.accountBalance ?? 0}</span>
                    <span className='balance-text'>{currencyInfo?.symbol}</span>
                    <span dangerouslySetInnerHTML={{ __html: currencyInfo?.flag }} />
                </div>
            </div>

        </Paper>
    )
}