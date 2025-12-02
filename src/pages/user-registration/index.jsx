import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, User, Mail, Phone, Lock, Shield, AlertCircle, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { registerUser } from 'services/authService';

const UserRegistration = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    accountType: 'customer'
  });
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex?.test(formData?.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    if (!formData?.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Nomor telepon wajib diisi';
    } else if (!phoneRegex?.test(formData?.phoneNumber?.replace(/[\s-]/g, ''))) {
      newErrors.phoneNumber = 'Format nomor telepon tidak valid';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    
    if (!termsAccepted) {
      newErrors.terms = 'Anda harus menyetujui syarat dan ketentuan';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      if (file?.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Ukuran file maksimal 5MB'
        }));
        return;
      }
      
      if (!file?.type?.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'File harus berupa gambar'
        }));
        return;
      }
      
      setProfilePicture(file);
      setErrors(prev => ({
        ...prev,
        profilePicture: ''
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader?.result);
      };
      reader?.readAsDataURL(file);
    }
  };
  
  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'user';
    input.onchange = (e) => handleFileSelect(e);
    input?.click();
  };
  
  const getPasswordStrength = () => {
    const password = formData?.password;
    if (!password) return { text: '', color: '', width: '0%' };
    
    let strength = 0;
    if (password?.length >= 6) strength++;
    if (password?.length >= 10) strength++;
    if (/[a-z]/?.test(password) && /[A-Z]/?.test(password)) strength++;
    if (/\d/?.test(password)) strength++;
    if (/[^a-zA-Z\d]/?.test(password)) strength++;
    
    if (strength <= 2) {
      return { text: 'Lemah', color: 'bg-red-500', width: '33%' };
    } else if (strength <= 3) {
      return { text: 'Sedang', color: 'bg-yellow-500', width: '66%' };
    } else {
      return { text: 'Kuat', color: 'bg-green-500', width: '100%' };
    }
  };
  
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      const userData = {
        ...formData,
        profilePicture: profilePicture
      };
      
      const result = await registerUser(userData);
      
      if (result?.success) {
        setSuccessMessage('Akun berhasil dibuat! Mengalihkan ke dashboard...');
        setTimeout(() => {
          navigate(formData?.accountType === 'admin' ? '/admin-field-management' : '/field-schedule');
        }, 2000);
      } else {
        setErrors({ submit: result?.error || 'Gagal membuat akun. Silakan coba lagi.' });
      }
    } catch (error) {
      setErrors({ submit: error?.message || 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };
  
  const passwordStrength = getPasswordStrength();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Akun Baru</h1>
          <p className="text-gray-600">Buat akun untuk mulai booking lapangan</p>
        </div>
        
        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                {profilePreview ? (
                  <div className="relative">
                    <img 
                      src={profilePreview} 
                      alt="Preview foto profil" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-100" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePicture(null);
                        setProfilePreview(null);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Pilih Foto
                  </div>
                </label>
                <button
                  type="button"
                  onClick={handleCameraCapture}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 inline-flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  Ambil Foto
                </button>
              </div>
              
              {errors?.profilePicture && (
                <p className="text-sm text-red-600 mt-2">{errors?.profilePicture}</p>
              )}
            </div>
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  name="fullName"
                  value={formData?.fullName}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  className={`pl-10 ${errors?.fullName ? 'border-red-500' : ''}`}
                />
              </div>
              {errors?.fullName && (
                <p className="text-sm text-red-600 mt-1">{errors?.fullName}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  value={formData?.email}
                  onChange={handleInputChange}
                  placeholder="nama@email.com"
                  className={`pl-10 ${errors?.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors?.email && (
                <p className="text-sm text-red-600 mt-1">{errors?.email}</p>
              )}
            </div>
            
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData?.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="08xxxxxxxxxx"
                  className={`pl-10 ${errors?.phoneNumber ? 'border-red-500' : ''}`}
                />
              </div>
              {errors?.phoneNumber && (
                <p className="text-sm text-red-600 mt-1">{errors?.phoneNumber}</p>
              )}
            </div>
            
            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Akun *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'customer' }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData?.accountType === 'customer' ?'border-blue-500 bg-blue-50' :'border-gray-200 hover:border-gray-300'
                  }`}>
                  <User className={`w-6 h-6 mx-auto mb-2 ${
                    formData?.accountType === 'customer' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <div className="text-sm font-medium">Pengguna</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'admin' }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData?.accountType === 'admin' ?'border-blue-500 bg-blue-50' :'border-gray-200 hover:border-gray-300'
                  }`}>
                  <Shield className={`w-6 h-6 mx-auto mb-2 ${
                    formData?.accountType === 'admin' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <div className="text-sm font-medium">Administrator</div>
                </button>
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData?.password}
                  onChange={handleInputChange}
                  placeholder="Minimal 6 karakter"
                  className={`pl-10 pr-10 ${errors?.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData?.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Kekuatan Password:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength?.color?.replace('bg-', 'text-')
                    }`}>
                      {passwordStrength?.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${passwordStrength?.color}`}
                      style={{ width: passwordStrength?.width }}
                    />
                  </div>
                </div>
              )}
              {errors?.password && (
                <p className="text-sm text-red-600 mt-1">{errors?.password}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData?.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Ulangi password"
                  className={`pl-10 pr-10 ${errors?.confirmPassword ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors?.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors?.confirmPassword}</p>
              )}
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e?.target?.checked);
                  if (errors?.terms) {
                    setErrors(prev => ({ ...prev, terms: '' }));
                  }
                }}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                Saya menyetujui{' '}
                <a href="#" className="text-blue-600 hover:underline">Syarat dan Ketentuan</a>
                {' '}serta{' '}
                <a href="#" className="text-blue-600 hover:underline">Kebijakan Privasi</a>
              </label>
            </div>
            {errors?.terms && (
              <p className="text-sm text-red-600 mt-1">{errors?.terms}</p>
            )}
            
            {/* Error Message */}
            {errors?.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-800">{errors?.submit}</span>
                </div>
              </div>
            )}
            
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">{successMessage}</span>
                </div>
              </div>
            )}
            
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Mendaftar...
                </>
              ) : (
                'Daftar Akun'
              )}
            </Button>
            
            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/authentication')}
                  className="text-blue-600 font-medium hover:underline">
                  Masuk di sini
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;