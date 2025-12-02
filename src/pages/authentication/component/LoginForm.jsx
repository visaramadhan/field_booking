import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData?.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="Masukkan password"
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
      </div>
      <div className="flex items-center justify-between">
        <Checkbox
          label="Ingat Saya"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleChange}
          disabled={isLoading}
        />
        <button
          type="button"
          className="text-sm text-primary hover:underline transition-smooth"
          disabled={isLoading}
        >
          Lupa Password?
        </button>
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="LogIn"
        iconPosition="right"
      >
        Masuk
      </Button>
      <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm font-medium text-foreground mb-2">Kredensial Demo:</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Admin:</strong> visaramadhan28@gmail.com / password</p>
          <p><strong>User:</strong> user@example.com / password123</p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;