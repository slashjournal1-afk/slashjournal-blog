'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, CheckCircle2, Loader2, AlertCircle, Lock, UserRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ProfileSettingsFormProps {
  initialDisplayName: string;
  initialName: string | null;
  initialAvatarUrl: string | null;
  isLocalAccount: boolean;
}

export function ProfileSettingsForm({
  initialDisplayName,
  initialName,
  initialAvatarUrl,
  isLocalAccount,
}: ProfileSettingsFormProps) {
  const { refreshUser } = useAuth();

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [name, setName] = useState(initialName || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingAvatar(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'avatar');

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Gagal mengunggah avatar');

      const patchRes = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: displayName.trim(), name: name.trim() || null, avatarUrl: uploadData.url }),
      });
      const patchData = await patchRes.json();
      if (!patchRes.ok) throw new Error(patchData.error || 'Gagal menyimpan avatar');

      setAvatarUrl(uploadData.url);
      setProfileSuccess(true);
      await refreshUser();
    } catch (err: any) {
      setProfileError(err.message || 'Terjadi kesalahan saat mengunggah avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: displayName.trim(), name: name.trim() || null, avatarUrl: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus avatar');
      setAvatarUrl(null);
      setProfileSuccess(true);
      await refreshUser();
    } catch (err: any) {
      setProfileError(err.message || 'Terjadi kesalahan');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: displayName.trim(), name: name.trim() || null, avatarUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan profil');
      setDisplayName(data.user.displayName);
      setName(data.user.name || '');
      setAvatarUrl(data.user.avatarUrl);
      setProfileSuccess(true);
      await refreshUser();
    } catch (err: any) {
      setProfileError(err.message || 'Terjadi kesalahan');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memperbarui kata sandi');
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Terjadi kesalahan');
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-[12px] bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] outline-none transition-colors';

  return (
    <div className="space-y-6">
      {/* Profile Data Card */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6 shadow-xs"
      >
        <div className="border-b border-[var(--border-color)] pb-4">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)] flex items-center gap-2">
            <UserRound className="w-4 h-4 text-[var(--accent)]" />
            Data Profil
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Nama dan foto ini tampil pada komentar, diskusi, dan naskah yang Anda tulis.
          </p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-[20px] overflow-hidden bg-[var(--bg-card-muted)] border border-[var(--border-color)] shrink-0 flex items-center justify-center">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Foto profil" fill sizes="80px" className="object-cover" />
            ) : (
              <span className="text-2xl font-extrabold text-[var(--accent)]">
                {(displayName || '?').charAt(0).toUpperCase()}
              </span>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="avatar-upload"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-bold text-[var(--text-primary)] transition-colors cursor-pointer ${uploadingAvatar ? 'opacity-60 pointer-events-none' : ''}`}
              >
                <Camera className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{avatarUrl ? 'Ganti Foto' : 'Unggah Foto'}</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
              />
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={savingProfile || uploadingAvatar}
                  className="px-3.5 py-2 rounded-[12px] text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-60"
                >
                  Hapus
                </button>
              )}
            </div>
            <p className="text-[10.5px] text-[var(--text-muted)]">
              JPG, PNG, WebP, GIF, atau AVIF • Maksimal 2 MB
            </p>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="display-name" className="text-xs font-bold text-[var(--text-primary)]">
              Nama Tampilan <span className="text-rose-500">*</span>
            </label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={80}
              required
              placeholder="Nama yang tampil di publik"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="full-name" className="text-xs font-bold text-[var(--text-primary)]">
              Nama Lengkap <span className="font-normal text-[var(--text-muted)]">(opsional)</span>
            </label>
            <input
              id="full-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="Nama lengkap Anda"
              className={inputClass}
            />
          </div>
        </div>

        {profileError && (
          <p className="flex items-center gap-2 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-[12px] px-3.5 py-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {profileError}
          </p>
        )}
        {profileSuccess && (
          <p className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-[12px] px-3.5 py-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Profil berhasil diperbarui.
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={savingProfile || uploadingAvatar}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
          >
            {savingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Simpan Perubahan
          </button>
        </div>
      </form>

      {/* Password Card */}
      <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-[var(--border-color)] pb-4">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[var(--accent)]" />
            Kata Sandi
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Perbarui kata sandi akun Anda secara berkala untuk menjaga keamanan.
          </p>
        </div>

        {isLocalAccount ? (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label htmlFor="current-password" className="text-xs font-bold text-[var(--text-primary)]">
                Kata Sandi Saat Ini
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="new-password" className="text-xs font-bold text-[var(--text-primary)]">
                  Kata Sandi Baru
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  placeholder="Minimal 8 karakter"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="confirm-password" className="text-xs font-bold text-[var(--text-primary)]">
                  Konfirmasi Baru
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
            </div>

            {passwordError && (
              <p className="flex items-center gap-2 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-[12px] px-3.5 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-[12px] px-3.5 py-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Kata sandi berhasil diperbarui.
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs font-bold text-[var(--text-primary)] active:scale-95 transition-all disabled:opacity-60"
              >
                {savingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Perbarui Kata Sandi
              </button>
            </div>
          </form>
        ) : (
          <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-card-muted)] border border-[var(--border-color)] rounded-[12px] px-3.5 py-3">
            Akun ini masuk melalui penyedia OAuth sehingga kata sandi dikelola di penyedia tersebut dan tidak dapat diubah di sini.
          </p>
        )}
      </div>
    </div>
  );
}
