import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { authClient } from '../../lib/auth-client';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Verification states
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('verified') === 'true') {
        setVerifySuccess(true);
      }
      if (params.get('error') === 'email-not-verified') {
        setError('Akses ditolak. Silakan verifikasi email Anda terlebih dahulu.');
        setShowResend(true);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setVerifySuccess(false);
    setResendSuccess(false);

    if (!email.trim() || !password) {
      setError('Email dan kata sandi wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      await authClient.signIn.email({
        email: email.trim(),
        password: password,
        rememberMe: rememberMe,
        callbackURL: '/dashboard'
      }, {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        },
        onError: (ctx) => {
          if (ctx.error.code === 'EMAIL_NOT_VERIFIED') {
            setError('Email Anda belum diverifikasi. Silakan periksa email Anda.');
            setShowResend(true);
          } else {
            setError(ctx.error.message || 'Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.');
          }
        }
      });
    } catch (err: any) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setVerifySuccess(false);
    setResendSuccess(false);
    try {
      setGoogleLoading(true);
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard'
      });
    } catch (err: any) {
      setError('Google OAuth gagal atau tidak dikonfigurasi di server.');
      setGoogleLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setError('Silakan masukkan alamat email Anda terlebih dahulu untuk mengirim ulang link verifikasi.');
      return;
    }

    try {
      setResendLoading(true);
      setError('');
      setResendSuccess(false);
      await authClient.sendVerificationEmail({
        email: email.trim(),
        callbackURL: '/login?verified=true'
      }, {
        onSuccess: () => {
          setResendSuccess(true);
          setShowResend(false);
        },
        onError: (ctx) => {
          setError(ctx.error.message || 'Gagal mengirim ulang link verifikasi.');
        }
      });
    } catch (err: any) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center select-none animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-bg-custom shadow-neumorph-in flex items-center justify-center text-success-custom mb-6 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-dark-custom">Berhasil Masuk!</h2>
        <p className="text-sm font-semibold text-secondary-custom mt-2 max-w-xs">
          Mempersiapkan dashboard finansial Uangku Anda...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto select-none p-4">
      <Card className="bg-bg-custom shadow-neumorph-out p-8 rounded-[28px] border border-white/20">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-[16px] bg-bg-custom shadow-neumorph-sm-out flex items-center justify-center text-2xl font-bold mx-auto mb-3">
            💸
          </div>
          <h2 className="text-2xl font-extrabold text-dark-custom tracking-tight leading-tight">Selamat Datang Kembali</h2>
          <p className="text-xs font-bold text-primary-custom tracking-widest uppercase mt-1">Masuk ke Akun Uangku</p>
        </div>

        {verifySuccess && (
          <div className="p-3.5 mb-4 rounded-[14px] bg-success-custom/10 border border-success-custom/20 text-xs font-bold text-success-custom flex gap-2 items-center animate-fade-in shadow-inner">
            <span>🎉</span>
            <span>Email Anda berhasil diverifikasi! Silakan masuk ke akun Anda.</span>
          </div>
        )}

        {resendSuccess && (
          <div className="p-3.5 mb-4 rounded-[14px] bg-success-custom/10 border border-success-custom/20 text-xs font-bold text-success-custom flex gap-2 items-center animate-fade-in shadow-inner">
            <span>📨</span>
            <span>Link verifikasi baru telah dikirimkan ke email Anda!</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email */}
          <Input
            label="Alamat Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@domain.com"
            icon={<Mail className="w-4 h-4 text-secondary-custom" />}
            required
            disabled={loading || googleLoading || resendLoading}
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              icon={<Lock className="w-4 h-4 text-secondary-custom" />}
              required
              disabled={loading || googleLoading || resendLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-3.5 p-1 rounded-full text-secondary-custom hover:text-primary-custom cursor-pointer transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Remember Me & Forgot Password links */}
          <div className="flex justify-between items-center px-1 text-xs font-bold select-none">
            <label className="flex items-center gap-2 text-secondary-custom cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-primary-custom cursor-pointer w-4 h-4"
                disabled={loading || googleLoading || resendLoading}
              />
              <span>Ingat saya</span>
            </label>
            <a href="#" className="text-primary-custom hover:underline transition-all" onClick={(e) => { e.preventDefault(); alert("Fitur reset sandi sedang dikonfigurasi.")}}>
              Lupa sandi?
            </a>
          </div>

          {error && (
            <div className="flex flex-col gap-2">
              <div className="p-3.5 rounded-[14px] bg-danger-custom/10 border border-danger-custom/20 text-xs font-bold text-danger-custom flex gap-2 items-center">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
              {showResend && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="w-full text-center text-xs font-bold text-primary-custom hover:underline transition-all cursor-pointer flex items-center justify-center gap-2 py-2.5 px-4 rounded-[14px] bg-bg-custom shadow-neumorph-sm-out active:shadow-neumorph-sm-in hover:brightness-105 border border-white/20"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengirim Ulang...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Ulang Link Verifikasi</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full shadow-neumorph-primary-out font-bold mt-2"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* OAuth Divider */}
        <div className="relative my-6 select-none flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300"></div>
          </div>
          <span className="relative px-3 bg-bg-custom text-xs font-semibold text-secondary-custom">
            atau gunakan metode alternatif
          </span>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full font-sans font-semibold rounded-[18px] py-3.5 px-6 min-h-[46px] bg-bg-custom text-dark-custom shadow-neumorph-sm-out hover:shadow-neumorph-out active:shadow-neumorph-sm-in hover:-translate-y-[1px] transition-all duration-200 cursor-pointer outline-none select-none flex items-center justify-center gap-2 border border-white/20"
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-primary-custom" />
              <span>Menghubungkan ke Google...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 3.03-.77 4.14l3.08 2.39c1.8-1.66 2.84-4.1 2.84-7.08z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.08-2.39c-1.12.75-2.52 1.2-4.88 1.2-3.77 0-6.97-2.54-8.12-5.97H.75v2.48C2.72 20.35 7.02 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.88 14.13c-.3-.9-.47-1.85-.47-2.83s.17-1.93.47-2.83V5.99H.75C-.25 7.99-.8 10.25-.8 12.75s.55 4.76 1.55 6.76l3.13-2.48c-.3-.9-.47-1.85-.47-2.83z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.02 0 2.72 3.65.75 7.99l3.13 2.48c1.15-3.43 4.35-5.97 8.12-5.97z"
                />
              </svg>
              <span>Masuk dengan Google</span>
            </>
          )}
        </button>

        <div className="mt-6 text-center text-xs font-bold text-secondary-custom">
          <span>Belum memiliki akun? </span>
          <a
            href="/register"
            className="text-primary-custom hover:underline transition-all"
          >
            Daftar Gratis
          </a>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
