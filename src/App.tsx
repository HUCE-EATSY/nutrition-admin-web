import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { AdminLayout } from './components/AdminLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Exercises } from './pages/Exercises';
import Subscriptions from './pages/Subscriptions';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/foods" element={<Navigate to="/" replace />} />
            <Route path="/premium" element={<Navigate to="/subscriptions" replace />} />
            <Route path="/vip" element={<Navigate to="/subscriptions" replace />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
