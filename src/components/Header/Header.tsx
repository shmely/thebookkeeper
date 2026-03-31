import './header.css';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
export default function Header() {
    return (
        <header className='app-header'>
            <div className='header-content'>
                <div className='header-menu'>
                    <IconButton size='large'>
                        <MenuIcon  sx={{color: 'white'}} />
                    </IconButton>
                </div>
                <div className='header-logo'>The Bookkeeper</div>
                
                <div className='language-selector'>
                    <IconButton size='large'>
                        <LanguageIcon sx={{color: 'white'}} />
                    </IconButton>
                </div>
            </div>
        </header>
    )
}