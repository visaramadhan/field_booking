import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Shield, CreditCard, Users, Star, Clock, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import Button from 'components/ui/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
  {
    icon: <Calendar className="w-8 h-8 text-blue-600" />,
    title: 'Real-Time Availability',
    description: 'Lihat ketersediaan lapangan secara real-time dan booking langsung tanpa menunggu konfirmasi'
  },
  {
    icon: <Shield className="w-8 h-8 text-green-600" />,
    title: 'Proses Mudah',
    description: 'Sistem booking yang simpel dan cepat, hanya butuh beberapa klik untuk reservasi lapangan'
  },
  {
    icon: <CreditCard className="w-8 h-8 text-purple-600" />,
    title: 'Pembayaran Aman',
    description: 'Integrasi pembayaran yang aman dan terpercaya untuk transaksi yang nyaman'
  }];


  const testimonials = [
  {
    name: 'Ahmad Rizki',
    role: 'Pemain Futsal Reguler',
    content: 'Aplikasi yang sangat membantu! Sekarang booking lapangan jadi lebih mudah dan cepat.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+Rizki&background=3b82f6&color=fff'
  },
  {
    name: 'Dewi Sartika',
    role: 'Koordinator Tim',
    content: 'Interface yang user-friendly dan sistem notifikasi yang sangat membantu mengatur jadwal tim.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Dewi+Sartika&background=8b5cf6&color=fff'
  },
  {
    name: 'Budi Santoso',
    role: 'Owner Lapangan',
    content: 'Sistem management yang efisien untuk mengelola booking dan revenue lapangan saya.',
    rating: 5,
    avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=10b981&color=fff'
  }];


  const stats = [
  { value: '1000+', label: 'Booking Sukses' },
  { value: '500+', label: 'Pengguna Aktif' },
  { value: '50+', label: 'Lapangan Terdaftar' },
  { value: '4.9', label: 'Rating Pengguna' }];


  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Field Booking</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-blue-600 transition-colors">

                Fitur
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-600 hover:text-blue-600 transition-colors">

                Testimoni
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-600 hover:text-blue-600 transition-colors">

                Kontak
              </button>
              <Button
                onClick={() => navigate('/authentication')}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50">

                Masuk
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                onClick={() => navigate('/authentication')}
                size="sm"
                className="bg-blue-600 text-white">

                Masuk
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Booking Lapangan
                <span className="block text-blue-600">Lebih Mudah & Cepat</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Sistem booking lapangan olahraga yang modern dan efisien. Lihat jadwal tersedia, booking instant, dan kelola reservasi Anda dengan mudah.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/authentication')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">

                  Mulai Booking
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => scrollToSection('features')}
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600">

                  Lihat Fitur
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {stats?.map((stat, index) =>
                <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat?.value}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat?.label}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1720364592639-f430eded39ca"
                  alt="Modern futsal field with professional lighting and green turf, players enjoying a game"
                  className="w-full h-full object-cover" />

              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Pengguna</div>
                    <div className="text-xl font-bold text-gray-900">500+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kenapa Memilih Kami?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Platform booking lapangan dengan fitur lengkap dan kemudahan akses untuk semua pengguna
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features?.map((feature, index) =>
            <div
              key={index}
              className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300 bg-white">

                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature?.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature?.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature?.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Pengguna Kami?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Testimoni dari pengguna yang puas dengan layanan kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials?.map((testimonial, index) =>
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">

                <div className="flex items-center mb-4">
                  {[...Array(testimonial?.rating)]?.map((_, i) =>
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                )}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial?.content}"
                </p>
                <div className="flex items-center">
                  <img
                  src={testimonial?.avatar}
                  alt={`${testimonial?.name} profile picture`}
                  className="w-12 h-12 rounded-full mr-4" />

                  <div>
                    <div className="font-semibold text-gray-900">{testimonial?.name}</div>
                    <div className="text-sm text-gray-600">{testimonial?.role}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Untuk Mulai Booking?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Bergabung dengan ratusan pengguna lainnya dan nikmati kemudahan booking lapangan
          </p>
          <Button
            onClick={() => navigate('/authentication')}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all px-8 py-4 text-lg font-semibold">

            Daftar Sekarang
          </Button>
        </div>
      </section>
      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Ivan Sport Center</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Platform booking lapangan olahraga terpercaya dan terlengkap di Indonesia
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Link Cepat</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors">
                    Fitur
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('testimonials')} className="text-gray-400 hover:text-white transition-colors">
                    Testimoni
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/authentication')} className="text-gray-400 hover:text-white transition-colors">
                    Daftar
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-5 h-5" />
                  <span>+62 812-3456-7890</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-5 h-5" />
                  <span>info@fieldbooking.com</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>Jakarta, Indonesia</span>
                </li>
              </ul>
            </div>

            {/* Operating Hours */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Jam Operasional</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Senin - Jumat: 08:00 - 22:00</span>
                </li>
                <li className="pl-7">Sabtu - Minggu: 06:00 - 24:00</li>
              </ul>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Field Booking System. All rights reserved.</p>
            <p className="mt-2 text-sm">Dibuat oleh Ivan Daniar</p>
          </div>
        </div>
      </footer>
    </div>);

};

export default LandingPage;