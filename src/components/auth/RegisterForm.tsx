import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { authClient } from '../../lib/auth-client';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

export const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Strength checks
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isMatch = password === confirmPassword && confirmPassword !== '';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    if (!hasMinLength) {
      setError('Kata sandi harus minimal 8 karakter.');
      return;
    }

    if (!isMatch) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    try {
      setLoading(true);
      await authClient.signUp.email({
        email: email.trim(),
        password: password,
        name: name.trim(),
        callbackURL: '/login?verified=true'
      }, {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: (ctx) => {
          setError(ctx.error.message || 'Pendaftaran gagal. Silakan periksa kembali data Anda.');
        }
      });
    } catch (err: any) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center select-none animate-fade-in w-full max-w-md mx-auto">
        <Card className="bg-bg-custom shadow-neumorph-out p-8 rounded-[28px] border border-white/20 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-bg-custom shadow-neumorph-in flex items-center justify-center text-primary-custom mb-6 animate-pulse">
            <Mail className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-dark-custom">Pendaftaran Sukses! 📨</h2>
          <p className="text-[10px] font-bold text-primary-custom tracking-widest uppercase mt-1">Verifikasi Email Anda</p>
          <p className="text-xs font-semibold text-secondary-custom mt-4 leading-relaxed">
            Kami telah mengirimkan link verifikasi ke alamat email <strong className="text-dark-custom">{email}</strong>.
            Silakan periksa kotak masuk (atau folder spam) Anda dan klik link tersebut untuk mengaktifkan akun.
          </p>
          <div className="mt-8 w-full">
            <a
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[18px] bg-primary-custom text-white font-bold text-xs shadow-neumorph-primary-out hover:brightness-105 active:scale-[0.98] transition-all duration-200"
            >
              <span>Kembali ke Halaman Masuk</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Card>
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
          <h2 className="text-2xl font-extrabold text-dark-custom tracking-tight leading-tight">Buat Akun Baru</h2>
          <p className="text-xs font-bold text-primary-custom tracking-widest uppercase mt-1">Mulai Kelola Keuangan</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {/* Name */}
          <Input
            label="Nama Lengkap"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap"
            icon={<User className="w-4 h-4 text-secondary-custom" />}
            required
            disabled={loading}
          />

          {/* Email */}
          <Input
            label="Alamat Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@domain.com"
            icon={<Mail className="w-4 h-4 text-secondary-custom" />}
            required
            disabled={loading}
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              icon={<Lock className="w-4 h-4 text-secondary-custom" />}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-3.5 p-1 rounded-full text-secondary-custom hover:text-primary-custom cursor-pointer transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm Password */}
          <Input
            label="Konfirmasi Kata Sandi"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi kata sandi Anda"
            icon={<Lock className="w-4 h-4 text-secondary-custom" />}
            required
            disabled={loading}
          />

          {/* Password Strength Indicators */}
          {password && (
            <div className="px-1 flex flex-col gap-1.5 text-xs font-semibold text-secondary-custom">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${hasMinLength ? 'bg-success-custom' : 'bg-neutral-300'}`} />
                <span>Minimal 8 karakter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${hasLetter && hasNumber ? 'bg-success-custom' : 'bg-neutral-300'}`} />
                <span>Kombinasi huruf & angka</span>
              </div>
              {confirmPassword && (
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isMatch ? 'bg-success-custom' : 'bg-danger-custom'}`} />
                  <span className={isMatch ? 'text-success-custom' : 'text-danger-custom'}>
                    {isMatch ? 'Kata sandi cocok' : 'Kata sandi tidak cocok'}
                  </span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-[14px] bg-danger-custom/10 border border-danger-custom/20 text-xs font-bold text-danger-custom flex gap-2 items-center">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full shadow-neumorph-primary-out font-bold mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Mendaftar Akun...</span>
              </>
            ) : (
              <>
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs font-bold text-secondary-custom">
          <span>Sudah memiliki akun? </span>
          <a
            href="/login"
            className="text-primary-custom hover:underline transition-all"
          >
            Masuk di sini
          </a>
        </div>
      </Card>
    </div>
  );
};

export default RegisterForm;
