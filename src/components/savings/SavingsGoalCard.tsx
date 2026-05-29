import React, { useState } from 'react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Target, Calendar, Plus, ChevronRight, Trash2 } from 'lucide-react';

interface SavingsGoalCardProps {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  onAddSavings?: (id: string, amount: number) => void;
  onDeleteSavingsGoal?: (id: string) => void;
  className?: string;
}

export const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({
  id,
  title,
  targetAmount,
  currentAmount,
  deadline,
  onAddSavings,
  onDeleteSavingsGoal,
  className = ''
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const percentage = Math.min(100, Math.max(0, targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0));

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amt = parseFloat(depositAmount);
    if (!depositAmount || isNaN(amt) || amt <= 0) {
      setError('Nominal harus > 0');
      return;
    }

    if (onAddSavings) {
      onAddSavings(id, amt);
    }

    setDepositAmount('');
    setShowAddForm(false);
  };

  return (
    <Card className={`bg-bg-custom hoverable flex flex-col gap-5 ${className}`}>
      {/* Target Details Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-[16px] bg-bg-custom shadow-neumorph-in text-primary-custom shrink-0 select-none">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-dark-custom text-base leading-snug">{title}</h4>
            <span className="flex items-center gap-1 text-xs font-semibold text-secondary-custom mt-1 select-none">
              <Calendar className="w-3.5 h-3.5" />
              Tenggat: {formatDate(deadline)}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Percentage badge */}
          <div className="px-3 py-1.5 rounded-full bg-bg-custom shadow-neumorph-sm-in text-xs font-black text-primary-custom select-none">
            {percentage.toFixed(0)}%
          </div>
          {onDeleteSavingsGoal && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2.5 rounded-[12px] bg-bg-custom text-danger-custom shadow-neumorph-sm-out hover:shadow-neumorph-out active:shadow-neumorph-sm-in hover:text-red-500 transition-all duration-200 cursor-pointer outline-none select-none border border-white/20"
              title="Hapus Target Tabungan"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Info & Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end text-xs font-bold select-none">
          <span className="text-secondary-custom">
            Kumpul: <strong className="text-dark-custom">{formatIDR(currentAmount)}</strong>
          </span>
          <span className="text-secondary-custom">
            Target: <strong className="text-primary-custom">{formatIDR(targetAmount)}</strong>
          </span>
        </div>
        <ProgressBar
          value={currentAmount}
          max={targetAmount}
          variant={percentage >= 100 ? 'success' : 'primary'}
        />
      </div>

      {/* Interactive Savings addition */}
      {onAddSavings && (
        <div className="pt-2 border-t border-neutral-300/30">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[14px] bg-bg-custom shadow-neumorph-sm-out hover:shadow-neumorph-out text-xs font-bold text-primary-custom active:shadow-neumorph-sm-in transition-all duration-200 select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Tabung Uang Tambahan</span>
            </button>
          ) : (
            <form onSubmit={handleDepositSubmit} className="flex gap-3 items-end">
              <Input
                type="number"
                placeholder="Nominal..."
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                error={error}
                className="py-2.5 text-xs font-bold rounded-[14px]"
                wrapperClassName="flex-1"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setError('');
                  }}
                  size="sm"
                  className="px-3.5 py-2.5 text-xs rounded-[14px]"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="px-4 py-2.5 text-xs rounded-[14px] shadow-neumorph-primary-out"
                >
                  Simpan
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Premium Neumorphic Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-all duration-300"
            onClick={() => setShowDeleteConfirm(false)}
          />

          {/* Modal Container */}
          <div 
            className="relative w-full max-w-sm bg-bg-custom rounded-[28px] shadow-neumorph-out p-6 z-10 border border-white/20 flex flex-col gap-6 text-center font-sans animate-fade-in"
          >
            {/* Warning Icon Container */}
            <div className="w-16 h-16 rounded-full bg-bg-custom shadow-neumorph-sm-in flex items-center justify-center text-danger-custom mx-auto border border-white/20">
              <Trash2 className="w-8 h-8" />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-extrabold text-dark-custom leading-tight">Hapus Target Tabungan</h3>
              <p className="text-xs font-semibold text-secondary-custom leading-relaxed">
                Apakah Anda yakin ingin menghapus target tabungan <strong>"{title}"</strong>? Data tabungan ini akan dihapus secara permanen.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-xs font-bold rounded-[14px]"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  if (onDeleteSavingsGoal) {
                    onDeleteSavingsGoal(id);
                  }
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-3 text-xs font-bold rounded-[14px] shadow-neumorph-danger-out bg-danger-custom text-white hover:brightness-105 active:scale-95 transition-all duration-200"
              >
                Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SavingsGoalCard;
