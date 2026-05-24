import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function SettingsPage() {
  const { user, updateProfile, theme, toggleTheme } = useAuth();
  
  // Profile state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    
    if (!profileName.trim() || !profileEmail.trim()) {
      setProfileError('Name and email cannot be empty');
      return;
    }

    setProfileLoading(true);
    try {
      await updateProfile({ name: profileName.trim(), email: profileEmail.trim() });
      setProfileSuccess('Profile updated successfully');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!currentPassword || !newPassword) {
      setPassError('Both current password and new password are required');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New password and confirmation do not match');
      return;
    }

    setPassLoading(true);
    try {
      await updateProfile({ currentPassword, newPassword });
      setPassSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8 border-b border-border-subtle pb-4">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary text-sm mt-0.5">Manage your workspace account preferences</p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings Block */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-text-primary mb-1">Profile Details</h2>
          <p className="text-text-secondary text-xs mb-5">Update your personal account information</p>

          {profileError && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-xs rounded-lg px-4 py-2.5 mb-4 animate-slide-down">
              {profileError}
            </div>
          )}

          {profileSuccess && (
            <div className="bg-status-completed/10 border border-status-completed/30 text-status-completed text-xs rounded-lg px-4 py-2.5 mb-4 animate-slide-down">
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
            <Input
              id="profileName"
              label="Full Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
            />
            <Input
              id="profileEmail"
              label="Email Address"
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              required
            />
            <div className="pt-1">
              <Button type="submit" loading={profileLoading} size="sm">
                Save Details
              </Button>
            </div>
          </form>
        </div>

        {/* Change Password Block */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-text-primary mb-1">Change Password</h2>
          <p className="text-text-secondary text-xs mb-5">Ensure your account remains safe and secure</p>

          {passError && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-xs rounded-lg px-4 py-2.5 mb-4 animate-slide-down">
              {passError}
            </div>
          )}

          {passSuccess && (
            <div className="bg-status-completed/10 border border-status-completed/30 text-status-completed text-xs rounded-lg px-4 py-2.5 mb-4 animate-slide-down">
              {passSuccess}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
            <Input
              id="currentPassword"
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              id="newPassword"
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="pt-1">
              <Button type="submit" loading={passLoading} size="sm">
                Change Password
              </Button>
            </div>
          </form>
        </div>

        {/* Theme Settings Block */}
        <div className="glass-card p-6">
          <h2 className="text-base font-semibold text-text-primary mb-1">Theme Settings</h2>
          <p className="text-text-secondary text-xs mb-5">Choose between a light workspace or high-contrast dark mode</p>

          <div className="flex items-center justify-between border border-border-subtle p-4 rounded-lg bg-bg-primary/50 max-w-lg">
            <div>
              <span className="text-sm font-medium text-text-primary block">
                {theme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}
              </span>
              <span className="text-text-muted text-xs">
                Switch themes to make your workspace experience comfortable
              </span>
            </div>
            <Button onClick={toggleTheme} size="sm" variant="secondary">
              Toggle Theme
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
