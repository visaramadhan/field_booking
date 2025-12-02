import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const RegisterForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validatePassword = (password) => {
    return password?.length >= 6;
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    } else if (formData?.name?.trim()?.length < 3) {
      newErrors.name = 'Nama minimal 3 karakter';
    }

    if (!formData?.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData?.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (!validatePassword(formData?.password)) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const getPasswordStrength = () => {
    const password = formData?.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password?.length >= 6) strength++;
    if (password?.length >= 8) strength++;
    if (/[A-Z]/?.test(password)) strength++;
    if (/[0-9]/?.test(password)) strength++;
    if (/[^A-Za-z0-9]/?.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: 'Lemah', color: 'bg-error' };
    if (strength <= 3) return { strength: 66, label: 'Sedang', color: 'bg-warning' };
    return { strength: 100, label: 'Kuat', color: 'bg-success' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nama Lengkap"
        type="text"
        name="name"
        placeholder="Masukkan nama lengkap"
        value={formData?.name}
        onChange={handleChange}
        error={errors?.name}
        required
        disabled={isLoading}
      />
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="contoh@email.com"
        value={formData?.email}
        onChange={handleChange}
        error={errors?.email}
        required
        disabled={isLoading}
      />
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Minimal 6 karakter"
          value={formData?.password}
          onChange={handleChange}
          error={errors?.password}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth tap-target"
          disabled={isLoading}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
        {formData?.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Kekuatan Password:</span>
              <span className={`text-xs font-medium ${
                passwordStrength?.color === 'bg-error' ? 'text-error' :
                passwordStrength?.color === 'bg-warning' ? 'text-warning' : 'text-success'
              }`}>
                {passwordStrength?.label}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${passwordStrength?.color} transition-all duration-300`}
                style={{ width: `${passwordStrength?.strength}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <Input
          label="Konfirmasi Password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Masukkan ulang password"
          value={formData?.confirmPassword}
          onChange={handleChange}
          error={errors?.confirmPassword}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth tap-target"
          disabled={isLoading}
        >
          <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            Password default akan ditetapkan secara otomatis. Anda dapat mengubahnya setelah login pertama kali.
          </p>
        </div>
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="right"
      >
        Daftar Sekarang
      </Button>
    </form>
  );
};

export default RegisterForm;