import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';

import Splash from './pages/Splash';
import SignIn from './pages/SignIn';
import Otp from './pages/Otp';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import PaymentHub from './pages/PaymentHub';
import WalletPage from './pages/Wallet';
import Groups from './pages/Groups';
import Sacco from './pages/Sacco';
import Emergency from './pages/Emergency';
import Investments from './pages/Investments';
import Trust from './pages/Trust';
import Community from './pages/Community';
import Admin from './pages/Admin';
import Settings from './pages/Settings';

function Page({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

function RequireAuth({ children }) {
  const { state } = useApp();
  if (!state.auth.isAuthenticated) return <Navigate to="/signin" replace />;
  if (!state.auth.onboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  const { state } = useApp();
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/splash" element={<Page><Splash /></Page>} />
        <Route path="/signin" element={<Page><SignIn /></Page>} />
        <Route path="/otp" element={<Page><Otp /></Page>} />
        <Route path="/onboarding" element={<Page><Onboarding /></Page>} />

        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/" element={<Page><Dashboard /></Page>} />
          <Route path="/pay" element={<Page><PaymentHub /></Page>} />
          <Route path="/wallet" element={<Page><WalletPage /></Page>} />
          <Route path="/groups" element={<Page><Groups /></Page>} />
          <Route path="/sacco" element={<Page><Sacco /></Page>} />
          <Route path="/emergency" element={<Page><Emergency /></Page>} />
          <Route path="/invest" element={<Page><Investments /></Page>} />
          <Route path="/trust" element={<Page><Trust /></Page>} />
          <Route path="/community" element={<Page><Community /></Page>} />
          <Route path="/admin" element={<Page><Admin /></Page>} />
          <Route path="/settings" element={<Page><Settings /></Page>} />
        </Route>

        <Route path="*" element={<Navigate to={state.auth.isAuthenticated ? '/' : '/splash'} replace />} />
      </Routes>
    </AnimatePresence>
  );
}
