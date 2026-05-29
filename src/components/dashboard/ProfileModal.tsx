import React, { useState, useEffect } from 'react';
import { X, User, Mail, DollarSign, Target, AlertTriangle, Check, Award, ShieldCheck, LogOut, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import ProgressBar from '../ui/ProgressBar';
import { authClient } from '../../lib/auth-client';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  monthlyIncomeGoal: number;
  monthlyExpenseLimit: number;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  totalIncome: number;
  totalExpense: number;
}

const AVATAR_OPTIONS = ['👤', '👨‍💻', '👩‍💻', '💼', '🍕', '🎮', '🌟', '🦄', '🦁', '🚀', '🎨', '💸'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  totalIncome,
  totalExpense
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [incomeGoal, setIncomeGoal] = useState(profile.monthlyIncomeGoal.toString());
  const [expenseLimit, setExpenseLimit] = useState(profile.monthlyExpenseLimit.toString());
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Sync state with prop updates
  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setAvatar(profile.avatar);
    setIncomeGoal(profile.monthlyIncomeGoal.toString());
    setExpenseLimit(profile.monthlyExpenseLimit.toString());
    setErrors({});
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = '/';
          }
        }
      });
    } catch (err: any) {
      alert("Gagal keluar dari akun.");
      setLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; } = {};

    if (!name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      email: email.trim(),
      avatar,
      monthlyIncomeGoal: parseFloat(incomeGoal) || 0,
      monthlyExpenseLimit: parseFloat(expenseLimit) || 0
    });
    onClose();
  }

  const incomeGoalNum = parseFloat(incomeGoal) || 0;
  const expenseLimitNum = parseFloat(expenseLimit) || 0;

  // Calculating progress
  const incomeProgressPercent = incomeGoalNum > 0 ? Math.round((totalIncome / incomeGoalNum) * 100) : 0;
  const expenseProgressPercent = expenseLimitNum > 0 ? Math.round((totalExpense / expenseLimitNum) * 100) : 0;
  const isExpenseOverLimit = expenseLimitNum > 0 && totalExpense > expenseLimitNum;

  // Net balance calculations
  const remainingBudget = expenseLimitNum - totalExpense;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-3xl bg-bg-custom rounded-[28px] shadow-neumorph-out overflow-hidden flex flex-col max-h-[90vh] z-10 border border-white/20 transform transition-all duration-300 scale-100 font-sans"
      >
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-5 border-b border-neutral-300/40 select-none">
          <div>
            <h2 className="text-xl font-extrabold text-dark-custom">Profil Finansial</h2>
            <p className="text-xs font-semibold text-secondary-custom">Atur preferensi & pantau batas anggaran Anda</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-[14px] bg-bg-custom shadow-neumorph-sm-out hover:shadow-neumorph-out active:shadow-neumorph-sm-in text-secondary-custom hover:text-danger-custom transition-all duration-200 outline-none cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </header>

        {/* Form & Stats Panel */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Personal Data & Avatar */}
            <div className="flex flex-col gap-6">
              <h3 className="text-sm font-bold text-primary-custom select-none uppercase tracking-wider">Data Diri</h3>
              
              {/* Avatar Selector */}
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-secondary-custom select-none px-1">Pilih Avatar</span>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[20px] bg-bg-custom shadow-neumorph-in flex items-center justify-center text-4xl select-none">
                    {avatar}
                  </div>
                  <div className="flex-1 grid grid-cols-6 gap-2">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setAvatar(emoji)}
                        className={`w-9 h-9 rounded-[10px] bg-bg-custom flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer ${
                          avatar === emoji 
                            ? 'shadow-neumorph-sm-in text-primary-custom border border-primary-custom/20' 
                            : 'shadow-neumorph-sm-out hover:shadow-neumorph-out'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <Input
                label="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                icon={<User className="w-4 h-4" />}
                error={errors.name}
              />

              {/* Email Input */}
              <Input
                label="Alamat Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: nama@domain.com"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email}
              />
            </div>

            {/* Right Column: Financial Goals & Limits */}
            <div className="flex flex-col gap-6">
              <h3 className="text-sm font-bold text-primary-custom select-none uppercase tracking-wider">Target & Batas Bulanan</h3>

              {/* Monthly Income Goal Input */}
              <Input
                label="Target Pemasukan Bulanan (Rp)"
                type="number"
                value={incomeGoal}
                onChange={(e) => setIncomeGoal(e.target.value)}
                placeholder="Contoh: 10000000"
                icon={<Target className="w-4 h-4 text-success-custom" />}
              />

              {/* Monthly Expense Limit Input */}
              <Input
                label="Batas Pengeluaran Bulanan (Rp)"
                type="number"
                value={expenseLimit}
                onChange={(e) => setExpenseLimit(e.target.value)}
                placeholder="Contoh: 5000000"
                icon={<AlertTriangle className={`w-4 h-4 ${isExpenseOverLimit ? 'text-danger-custom' : 'text-warning-custom'}`} />}
              />

              {/* Realtime Alert Card */}
              {expenseLimitNum > 0 && (
                <div className="mt-2">
                  {isExpenseOverLimit ? (
                    <div className="p-4 rounded-[20px] bg-bg-custom shadow-neumorph-sm-in border border-danger-custom/20 flex gap-3.5 items-start">
                      <div className="p-2 rounded-[12px] bg-danger-custom/10 text-danger-custom shadow-neumorph-sm-out">
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="flex-1 select-none">
                        <h4 className="text-xs font-bold text-danger-custom uppercase tracking-wide">Peringatan Anggaran</h4>
                        <p className="text-xs font-semibold text-secondary-custom mt-1 leading-normal">
                          Pengeluaran Anda bulan ini (Rp {totalExpense.toLocaleString('id-ID')}) telah melebihi batas yang ditentukan sebesar 
                          <span className="text-danger-custom font-extrabold ml-1">Rp {Math.abs(remainingBudget).toLocaleString('id-ID')}</span>!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-[20px] bg-bg-custom shadow-neumorph-sm-in border border-success-custom/20 flex gap-3.5 items-start">
                      <div className="p-2 rounded-[12px] bg-success-custom/10 text-success-custom shadow-neumorph-sm-out">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1 select-none">
                        <h4 className="text-xs font-bold text-success-custom uppercase tracking-wide">Anggaran Aman</h4>
                        <p className="text-xs font-semibold text-secondary-custom mt-1 leading-normal">
                          Pengeluaran Anda terkendali! Sisa anggaran belanja Anda bulan ini adalah 
                          <span className="text-success-custom font-extrabold ml-1">Rp {remainingBudget.toLocaleString('id-ID')}</span>.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Realtime Performance Visualization Card */}
          <Card className="bg-bg-custom shadow-neumorph-out p-6 rounded-[22px] border border-white/40 flex flex-col gap-5 mt-2 select-none">
            <h4 className="text-xs font-bold text-dark-custom uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-primary-custom" />
              Progress Finansial Bulan Ini
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income Progress */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold px-1">
                  <span className="text-secondary-custom">Pemasukan vs Target</span>
                  <span className="text-success-custom">{incomeProgressPercent}%</span>
                </div>
                <ProgressBar
                  value={totalIncome}
                  max={incomeGoalNum || 1}
                  variant={incomeProgressPercent >= 100 ? 'success' : 'primary'}
                />
                <div className="flex justify-between text-[10px] font-semibold text-secondary-custom px-1">
                  <span>Rp {totalIncome.toLocaleString('id-ID')}</span>
                  <span>Target: Rp {incomeGoalNum.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Expense Progress */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold px-1">
                  <span className="text-secondary-custom">Pengeluaran vs Limit</span>
                  <span className={isExpenseOverLimit ? 'text-danger-custom animate-pulse' : 'text-warning-custom'}>
                    {expenseProgressPercent}%
                  </span>
                </div>
                <ProgressBar
                  value={totalExpense}
                  max={expenseLimitNum || 1}
                  variant={isExpenseOverLimit ? 'danger' : 'warning'}
                />
                <div className="flex justify-between text-[10px] font-semibold text-secondary-custom px-1">
                  <span>Rp {totalExpense.toLocaleString('id-ID')}</span>
                  <span>Limit: Rp {expenseLimitNum.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </Card>
        </form>

        {/* Footer Actions */}
        <footer className="px-8 py-5 border-t border-neutral-300/40 bg-neutral-100/10 flex justify-between items-center select-none">
          <Button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            variant="danger"
            className="px-5 py-2.5 rounded-[14px] font-bold"
            size="sm"
            disabled={loggingOut}
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? 'Keluar...' : 'Keluar Akun'}</span>
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-[14px]"
              size="sm"
            >
              Batal
            </Button>
            <Button
              type="submit"
              onClick={handleSave}
              variant="primary"
              className="px-6 py-2.5 rounded-[14px] shadow-neumorph-primary-out font-bold"
              size="sm"
            >
              Simpan Perubahan
            </Button>
          </div>
        </footer>
      </div>

      {/* Premium Neumorphic Logout Confirmation Modal Overlay */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300"
            onClick={() => setShowLogoutConfirm(false)}
          />

          {/* Modal Container */}
          <div 
            className="relative w-full max-w-sm bg-bg-custom rounded-[28px] shadow-neumorph-out p-6 z-10 border border-white/20 flex flex-col gap-6 text-center font-sans animate-fade-in"
          >
            {/* Warning Icon Container */}
            <div className="w-16 h-16 rounded-full bg-bg-custom shadow-neumorph-sm-in flex items-center justify-center text-danger-custom mx-auto border border-white/20">
              <LogOut className="w-8 h-8" />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-extrabold text-dark-custom leading-tight">Keluar dari Akun</h3>
              <p className="text-xs font-semibold text-secondary-custom leading-relaxed">
                Apakah Anda yakin ingin keluar dari akun Anda? Sesi Anda akan dihentikan secara aman.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 select-none">
              <Button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 text-xs font-bold rounded-[14px]"
                disabled={loggingOut}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 py-3 text-xs font-bold rounded-[14px] shadow-neumorph-danger-out bg-danger-custom text-white hover:brightness-105 active:scale-95 transition-all duration-200"
              >
                {loggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  <span>Keluar</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;
