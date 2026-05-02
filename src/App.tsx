
import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from './fireebaseConfig'; // Make sure this path points to your firebase.ts file
import AccountsList from './components/Accounts/AccountsList';
import AccountPage from './components/AccountPage/AccountPage';
import Header from './components/Header/Header';
import Login from './components/Login/Login';



function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, []);

  // 1. Show a simple loading state while checking Firebase
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>טוען... (Loading...)</div>;
  }

  // 2. If no user is logged in, show ONLY the login screen
  if (!user) {
    return <Login />;
  }
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<AccountsList />} />
        <Route path="base/account/:accountId" element={<AccountPage />} />

      </Routes>
    </BrowserRouter>

  )
}

export default App
