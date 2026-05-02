import React from 'react';
import { auth, db, googleProvider } from '../../fireebaseConfig'; // Make sure this path points to your firebase.ts file
import { signInWithPopup } from 'firebase/auth';
import { Button, Box, Typography, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { doc, getDoc, setDoc } from 'firebase/firestore/lite';

const Login: React.FC = () => {

  const handleLogin = async () => {
    try {
      // 1. Trigger the Google Sign-in popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // 2. Reference to where this user's data SHOULD be in the database
      const userRef = doc(db, 'users', user.uid);
      
      // 3. Check if they already exist
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // 4. If they don't exist, create a new profile for them!
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date()
        });
        console.log("New user profile created in Firestore!");
      } else {
        console.log("User already exists in Firestore. Welcome back!");
      }
      
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', // Takes up the full height of the screen
        backgroundColor: '#f5f5f5' // Light gray background
      }}
    >
      <Paper 
        elevation={4} 
        sx={{ 
          p: 5, 
          textAlign: 'center', 
          borderRadius: 4, 
          maxWidth: 400, 
          width: '100%',
          direction: 'rtl' // Keeps your Hebrew text aligned correctly
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: '#3f51b5' }}>
          Keeper App
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, mt: 2 }}>
          ניהול הוצאות והכנסות חכם.<br />
          אנא התחבר עם חשבון הגוגל שלך כדי להמשיך.
        </Typography>
        
        <Button 
          variant="contained" 
          fullWidth 
          size="large"
          startIcon={<GoogleIcon sx={{ ml: 1 }} />} // ml: 1 adds space in RTL
          onClick={handleLogin}
          sx={{ 
            bgcolor: '#4285F4', 
            '&:hover': { bgcolor: '#3367D6' },
            py: 1.5, 
            borderRadius: 2,
            fontSize: '1.1rem'
          }}
        >
          התחבר עם Google
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;