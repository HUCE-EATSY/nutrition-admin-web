import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '../services/adminApiConfig';
import { useToast } from '../components/Toast';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const checkAuth = async () => {
      const isAuth = await adminAuth.checkAuth();
      if (isAuth) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Vui lòng điền đầy đủ thông tin đăng nhập', 'warning');
      return;
    }

    setLoading(true);
    try {
      await adminAuth.login(email, password);
      showToast('Đăng nhập thành công! Chào mừng bạn.', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Sai thông tin đăng nhập';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#090d16',
      backgroundImage: 'radial-gradient(circle at 50% 50%, #111e30 0%, #090d16 100%)',
      overflow: 'hidden',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--box-shadow-premium)',
        animation: 'fadeIn 0.5s ease-out',
        position: 'relative'
      }} className="glass">
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%)',
          zIndex: -1,
          animation: 'pulseGlow 4s infinite'
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '32px',
          gap: '12px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 0 20px var(--color-primary-glow)'
          }}>
            <ShieldCheck size={30} color="var(--bg-primary)" style={{ strokeWidth: 2.5 }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>DNT Nutrition App</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cổng thông tin quản trị hệ thống</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email / Tài khoản</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                <Mail size={16} />
              </span>
              <input
                type="text"
                placeholder="Nhập tài khoản admin..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="input-premium"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          {/* Password input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} />
              </span>
              <input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="input-premium"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-premium"
            style={{
              padding: '14px',
              fontSize: '15px',
              marginTop: '10px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--color-primary-glow)'
            }}
          >
            {loading ? (
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(9, 13, 22, 0.2)',
                borderTopColor: 'var(--bg-primary)',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite'
              }} />
            ) : (
              'Đăng nhập Hệ thống'
            )}
          </button>
        </form>

        {/* Demo Credentials Footer */}
        <div style={{
          marginTop: '28px',
          padding: '12px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed var(--border-color)',
          borderRadius: 'var(--border-radius-sm)',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          💡 <strong>Tài khoản Demo (Mock API):</strong><br />
          Tên đăng nhập: <code style={{ color: 'var(--color-primary)', fontWeight: 600 }}>namdinh</code><br />
          Mật khẩu: <code style={{ color: 'var(--color-primary)', fontWeight: 600 }}>123</code>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};
