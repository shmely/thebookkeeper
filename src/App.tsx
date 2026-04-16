
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AccountsList from './components/Accounts/AccountsList';
import AccountPage from './components/AccountPage/AccountPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AccountsList />} />
        <Route path="base/account/:accountId" element={<AccountPage />} />

      </Routes>
    </BrowserRouter>

  )
}

export default App
