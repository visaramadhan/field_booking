import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Upload, CreditCard, Building2, Check, AlertCircle, Loader2, FileText } from 'lucide-react';
import Button from 'components/ui/Button';

import { createPayment, uploadPaymentProof } from 'services/paymentService';
import { getBankDetails } from 'services/settingsService';
import { auth } from 'config/firebase';

const PaymentManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location?.state?.bookingData;
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState('');
  
  const [bankDetails, setBankDetails] = useState(null);
  
  const facilityAddress = 'Jl. Olahraga No. 123, Jakarta Selatan 12345';
  const operatingHours = 'Senin - Jumat: 08:00 - 22:00, Sabtu - Minggu: 06:00 - 24:00';
  
  useEffect(() => {
    if (!bookingData) {
      navigate('/field-schedule');
    }
  }, [bookingData, navigate]);

  useEffect(() => {
    (async () => {
      const res = await getBankDetails();
      if (res?.success) {
        setBankDetails(res?.data || {
          bankName: 'Bank Mandiri',
          accountNumber: '1234567890',
          accountName: 'Field Booking System',
          branch: 'Jakarta Pusat'
        });
      }
    })();
  }, []);
  
  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      if (file?.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }
      
      if (!file?.type?.startsWith('image/')) {
        setError('File harus berupa gambar');
        return;
      }
      
      setProofFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader?.result);
      };
      reader?.readAsDataURL(file);
    }
  };
  
  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => handleFileSelect(e);
    input?.click();
  };
  
  const handleSubmitPayment = async () => {
    if (!auth?.currentUser) {
      setError('Anda harus login terlebih dahulu');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const paymentData = {
        userId: auth?.currentUser?.uid,
        bookingId: bookingData?.bookingId || `BK-${Date.now()}`,
        fieldName: bookingData?.fieldName || 'Lapangan Futsal',
        bookingDate: bookingData?.date || new Date()?.toISOString(),
        bookingTime: bookingData?.time || '10:00 - 12:00',
        duration: bookingData?.duration || 2,
        totalAmount: bookingData?.totalAmount || 200000,
        paymentMethod: paymentMethod,
        currency: 'IDR'
      };
      
      const result = await createPayment(paymentData);
      
      if (result?.success) {
        setPaymentId(result?.paymentId);
        setPaymentStatus('pending');
      } else {
        setError(result?.error || 'Gagal membuat pembayaran');
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUploadProof = async () => {
    if (!proofFile || !paymentId) {
      setError('Pilih file bukti pembayaran terlebih dahulu');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      const result = await uploadPaymentProof(paymentId, proofFile);
      
      if (result?.success) {
        setPaymentStatus('verification_pending');
        setTimeout(() => {
          navigate('/field-schedule', { 
            state: { 
              message: 'Bukti pembayaran berhasil diupload. Menunggu verifikasi admin.' 
            } 
          });
        }, 2000);
      } else {
        setError(result?.error || 'Gagal upload bukti pembayaran');
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setUploading(false);
    }
  };
  
  if (!bookingData) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Pembayaran</h1>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900">
              Kembali
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Booking Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Booking</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Nama Lapangan</span>
              <span className="font-medium text-gray-900">{bookingData?.fieldName || 'Lapangan Futsal'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tanggal</span>
              <span className="font-medium text-gray-900">{bookingData?.date || '2025-11-22'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Waktu</span>
              <span className="font-medium text-gray-900">{bookingData?.time || '10:00 - 12:00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Durasi</span>
              <span className="font-medium text-gray-900">{bookingData?.duration || 2} jam</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total Pembayaran</span>
                <span className="text-lg font-bold text-blue-600">
                  Rp {(bookingData?.totalAmount || 200000)?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Method Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Cash Payment */}
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'cash' ?'border-blue-500 bg-blue-50' :'border-gray-200 hover:border-gray-300'
              }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  paymentMethod === 'cash' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <CreditCard className={`w-5 h-5 ${
                    paymentMethod === 'cash' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Bayar Tunai</div>
                  <div className="text-sm text-gray-600">Bayar langsung di lokasi</div>
                </div>
              </div>
            </button>
            
            {/* Bank Transfer */}
            <button
              onClick={() => setPaymentMethod('transfer')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'transfer' ?'border-blue-500 bg-blue-50' :'border-gray-200 hover:border-gray-300'
              }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  paymentMethod === 'transfer' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Building2 className={`w-5 h-5 ${
                    paymentMethod === 'transfer' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Transfer Bank</div>
                  <div className="text-sm text-gray-600">Transfer ke rekening</div>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Payment Instructions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {paymentMethod === 'cash' ? 'Instruksi Pembayaran Tunai' : 'Instruksi Transfer Bank'}
          </h2>
          
          {paymentMethod === 'cash' ? (
            <div className="space-y-4">
              <div>
                <div className="font-medium text-gray-900 mb-2">Lokasi Pembayaran:</div>
                <div className="text-gray-600">{facilityAddress}</div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-2">Jam Operasional:</div>
                <div className="text-gray-600">{operatingHours}</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    Mohon lakukan pembayaran maksimal 1 jam sebelum waktu booking. 
                    Setelah pembayaran, tunjukkan bukti pembayaran kepada petugas.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="font-medium text-gray-900 mb-2">Informasi Rekening:</div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank</span>
                    <span className="font-medium text-gray-900">{bankDetails?.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nomor Rekening</span>
                    <span className="font-medium text-gray-900">{bankDetails?.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Atas Nama</span>
                    <span className="font-medium text-gray-900">{bankDetails?.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cabang</span>
                    <span className="font-medium text-gray-900">{bankDetails?.branch}</span>
                  </div>
                </div>
              </div>
              
              {paymentId && (
                <div>
                  <div className="font-medium text-gray-900 mb-2">Nomor Referensi:</div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Gunakan sebagai berita transfer</div>
                      <div className="text-xl font-mono font-bold text-blue-600">{paymentId}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    Setelah transfer, mohon upload bukti transfer untuk verifikasi pembayaran.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Upload Payment Proof (for transfer method) */}
        {paymentMethod === 'transfer' && paymentId && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Bukti Pembayaran</h2>
            
            {proofPreview ? (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={proofPreview} 
                    alt="Preview bukti pembayaran" 
                    className="w-full h-64 object-cover" 
                  />
                  <button
                    onClick={() => {
                      setProofFile(null);
                      setProofPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600">
                    Hapus
                  </button>
                </div>
                
                <Button
                  onClick={handleUploadProof}
                  disabled={uploading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Bukti Pembayaran
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload bukti transfer Anda</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 inline-flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Pilih File
                      </div>
                    </label>
                    <button
                      onClick={handleCameraCapture}
                      className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 inline-flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Ambil Foto
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG (Maks. 5MB)</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          </div>
        )}
        
        {/* Success Message */}
        {paymentStatus === 'verification_pending' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-800">
                Bukti pembayaran berhasil diupload! Menunggu verifikasi admin.
              </span>
            </div>
          </div>
        )}
        
        {/* Submit Button (initial payment creation) */}
        {!paymentId && (
          <Button
            onClick={handleSubmitPayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              'Lanjutkan Pembayaran'
            )}
          </Button>
        )}
        
        {/* Payment Policy */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Kebijakan Pembayaran:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Pembayaran harus dilakukan maksimal 1 jam sebelum waktu booking</li>
            <li>Untuk transfer bank, verifikasi membutuhkan waktu maksimal 2 jam</li>
            <li>Pembatalan dengan refund hanya berlaku minimal 24 jam sebelum booking</li>
            <li>Hubungi customer service untuk informasi lebih lanjut: +62 812-3456-7890</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;