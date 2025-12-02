import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PasswordChangeForm = ({ onSubmit, isLoading }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (password?.length >= 12) strength += 25;
    if (/[a-z]/?.test(password) && /[A-Z]/?.test(password)) strength += 25;
    if (/\d/?.test(password)) strength += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/?.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!passwordData?.currentPassword) {
      newErrors.currentPassword = 'Password saat ini wajib diisi';
    }
    
    if (!passwordData?.newPassword) {
      newErrors.newPassword = 'Password baru wajib diisi';
    } else if (passwordData?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password minimal 8 karakter';
    }
    
    if (!passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    
    if (passwordData?.currentPassword === passwordData?.newPassword) {
      newErrors.newPassword = 'Password baru harus berbeda dari password saat ini';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(passwordData);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordStrength(0);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-error';
    if (passwordStrength < 70) return 'bg-warning';
    return 'bg-success';
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 40) return 'Lemah';
    if (passwordStrength < 70) return 'Sedang';
    return 'Kuat';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
          <Icon name="Lock" size={20} color="var(--color-warning)" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Ubah Password</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Password Saat Ini"
          type="password"
          name="currentPassword"
          placeholder="Masukkan password saat ini"
          value={passwordData?.currentPassword}
          onChange={handleChange}
          error={errors?.currentPassword}
          required
        />

        <div>
          <Input
            label="Password Baru"
            type="password"
            name="newPassword"
            placeholder="Masukkan password baru"
            value={passwordData?.newPassword}
            onChange={handleChange}
            error={errors?.newPassword}
            required
            description="Minimal 8 karakter, kombinasi huruf besar, kecil, dan angka"
          />
          {passwordData?.newPassword && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Kekuatan Password:</span>
                <span className={`text-xs font-medium ${
                  passwordStrength < 40 ? 'text-error' : 
                  passwordStrength < 70 ? 'text-warning': 'text-success'
                }`}>
                  {getStrengthLabel()}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Input
          label="Konfirmasi Password Baru"
          type="password"
          name="confirmPassword"
          placeholder="Masukkan ulang password baru"
          value={passwordData?.confirmPassword}
          onChange={handleChange}
          error={errors?.confirmPassword}
          required
        />

        <div className="pt-4">
          <Button
            type="submit"
            variant="warning"
            loading={isLoading}
            iconName="Key"
            iconPosition="left"
            fullWidth
          >
            Ubah Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;