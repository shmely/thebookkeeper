import './Header.css';
import { auth } from '../../fireebaseConfig';
import { signOut } from 'firebase/auth';
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import ShareIcon from '@mui/icons-material/Share';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export default function Header() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showIosInstruction, setShowIosInstruction] = useState(false);
    const user = auth.currentUser;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setDrawerOpen(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        // 1. Listen for Android/Chrome install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
            setDeferredPrompt(e as BeforeInstallPromptEvent); // Save the event so we can trigger it later
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = () => {
        // שלב 1: הבאת האירוע מיד! (ללא תנאים וללא עיכובים)
        const promptEvent = window.deferredPrompt || deferredPrompt;

        if (!promptEvent) {
            // אם אין אירוע, נבדוק בבטחה למה ונציג פתרון
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

            setDrawerOpen(false);

            if (isStandalone) {
                alert("האפליקציה כבר מותקנת!");
            } else if (isIOS) {
                setShowIosInstruction(true);
            } else {
                alert("כדי להתקין, פתח את התפריט בדפדפן ולחץ על 'התקן אפליקציה' או 'הוסף למסך הבית'.");
            }
            return;
        }

        // שלב 2: הפעלה מיידית של הפרומפט (בדיוק מה שכרום דורש בקליק)
        try {
            promptEvent.prompt();

            // שלב 3: ניקוי וסגירת התפריט יקרו רק *אחרי* שהפרומפט נפתח
            setDrawerOpen(false);

            if (window.deferredPrompt) window.deferredPrompt = null;
            if (deferredPrompt) setDeferredPrompt(null);
        } catch (err) {
            console.error("שגיאה בהפעלת הפרומפט:", err);
            setDrawerOpen(false);
        }
    };

    return (
        <header className='app-header'>
            <div className='header-content'>
                <div className='header-menu'>
                    <IconButton size='large' onClick={() => setDrawerOpen(true)}>
                        <MenuIcon sx={{ color: 'white' }} />
                    </IconButton>
                </div>
                <div className='header-logo'>מנהל החשבונות</div>

                <div className='language-selector'>
                    <IconButton size='large'>
                        <LanguageIcon sx={{ color: 'white' }} />
                    </IconButton>
                </div>
            </div>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            width: 300,
                            bgcolor: '#fafafa', // Light gray background matching screenshot
                            borderTopLeftRadius: 16,
                            borderBottomLeftRadius: 16
                        }
                    }
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        direction: 'rtl',
                        height: '100%'
                    }}
                >
                    {/* User Profile Section */}
                    <Avatar
                        src={user?.photoURL || undefined}
                        slotProps={{
                            img: {
                                referrerPolicy: "no-referrer" as const
                            }
                        }}
                        sx={{
                            width: 64,
                            height: 64,
                            mb: 1,
                            boxShadow: 1,
                            bgcolor: '#3949ab', // A nice background color if there is no image
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {/* Fallback: Show the first letter of the email if photoURL is missing/fails */}
                        {user?.email ? user.email.charAt(0).toUpperCase() : ''}
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 2, color: '#333' }}>
                        {user?.email || 'user@gmail.com'}
                    </Typography>

                    <Divider sx={{ width: '100%', mb: 3 }} />

                    {/* Light Blue Button: Install App */}
                    <Button
                        variant="contained"
                        fullWidth
                        endIcon={<InstallMobileIcon sx={{ mr: 1 }} />} // endIcon puts it on the right side
                        onClick={handleInstallClick}
                        sx={{
                            bgcolor: '#4fc3f7',
                            color: 'white',
                            '&:hover': { bgcolor: '#29b6f6' },
                            borderRadius: 2,
                            py: 1.2,
                            mb: 3,
                            boxShadow: '0 4px 6px rgba(79, 195, 247, 0.3)',
                            fontWeight: 600
                        }}
                    >
                        התקן את האפליקציה
                    </Button>

                    <Divider sx={{ width: '100%', mb: 3 }} />

                    {/* Dark Blue Button: Share */}
                    <Button
                        variant="contained"
                        fullWidth
                        endIcon={<ShareIcon sx={{ mr: 1 }} />}
                        sx={{
                            bgcolor: '#3949ab',
                            color: 'white',
                            '&:hover': { bgcolor: '#283593' },
                            borderRadius: 2,
                            py: 1.2,
                            boxShadow: '0 4px 6px rgba(57, 73, 171, 0.3)',
                            fontWeight: 600
                        }}
                    >
                        שתפו עם חברים
                    </Button>

                    {/* Spacer to push logout to the bottom */}
                    <Box sx={{ flexGrow: 1, minHeight: '80px' }} />

                    {/* Purple Button: Logout */}
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleLogout}
                        sx={{
                            bgcolor: '#5e35b1',
                            color: 'white',
                            '&:hover': { bgcolor: '#4527a0' },
                            borderRadius: 2,
                            py: 1.2,
                            boxShadow: '0 4px 6px rgba(94, 53, 177, 0.3)',
                            fontWeight: 600
                        }}
                    >
                        התנתק
                    </Button>

                </Box>
            </Drawer>
            <Dialog
                open={showIosInstruction}
                onClose={() => setShowIosInstruction(false)}
                dir="rtl"
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>התקנה באייפון (iOS)</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        כדי להתקין את האפליקציה על האייפון שלך:
                        <br /><br />
                        1. לחץ על כפתור ה-<b>שתף (Share)</b> בתחתית המסך בדפדפן הספארי (אייקון של ריבוע עם חץ למעלה).
                        <br /><br />
                        2. גלול למטה ובחר ב-<b>"הוסף למסך הבית" (Add to Home Screen)</b>.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowIosInstruction(false)}>הבנתי</Button>
                </DialogActions>
            </Dialog>
        </header>
    )
}