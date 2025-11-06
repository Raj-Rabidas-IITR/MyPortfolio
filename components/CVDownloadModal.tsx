'use client';

import { useState } from 'react';
import { X, Download, Mail, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface CVDownloadModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function CVDownloadModal({ isOpen, onClose }: CVDownloadModalProps) {
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [otp, setOtp] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Reset modal state
  const resetModal = () => {
    setStep('form');
    setFormData({ name: '', email: '' });
    setOtp('');
    setUserEmail('');
  };

  // Close modal
  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/cv-download/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setUserEmail(formData.email);
        
        if (data.alreadyVerified) {
          // User already verified, download directly
          toast.success('Email already verified! Downloading CV...');
          await downloadCV(formData.email);
          setStep('success');
        } else {
          // Show OTP step
          toast.success('OTP sent to your email!');
          setStep('otp');
        }
      } else {
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/cv-download/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Verification successful! Downloading CV...');
        await downloadCV(userEmail);
        setStep('success');
      } else {
        toast.error(data.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Download CV
  const downloadCV = async (email: string) => {
    try {
      const res = await fetch(`/api/cv-download/get-cv?email=${encodeURIComponent(email)}`);
      
      if (res.ok) {
        const blob = await res.blob();
        const url = globalThis.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Raj_Rabidas_CV.pdf';
        document.body.appendChild(a);
        a.click();
        globalThis.URL.revokeObjectURL(url);
        a.remove();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to download CV');
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Failed to download CV. Please try again.');
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cv-download/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('New OTP sent to your email!');
        setOtp('');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-cyan-500/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Download size={28} className="text-white" />
            <h2 className="text-2xl font-bold text-white">Download CV</h2>
          </div>
          <p className="text-white/90 text-sm mt-2">
            Quick verification required to access the CV
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Name & Email Form */}
          {step === 'form' && (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-300 flex items-start gap-2">
                  <Mail size={18} className="mt-0.5 flex-shrink-0" />
                  <span>
                    To ensure secure access, please verify your email with a one-time code.
                  </span>
                </p>
              </div>

              <div>
                <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Continue
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-300 flex items-start gap-2">
                  <Mail size={18} className="mt-0.5 flex-shrink-0" />
                  <span>
                    We sent a 6-digit code to <strong>{userEmail}</strong>. Please check your inbox.
                  </span>
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-gray-300 text-sm font-medium mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replaceAll(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Verify & Download
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-cyan-400 hover:text-cyan-300 text-sm underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
                <span className="text-gray-500 mx-2">|</span>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-gray-400 hover:text-gray-300 text-sm underline"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                <CheckCircle size={48} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
              <p className="text-gray-300 mb-6">
                Your CV download should start automatically. If not, click the button below.
              </p>
              <button
                onClick={() => downloadCV(userEmail)}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-purple-700 transition inline-flex items-center gap-2"
              >
                <Download size={18} />
                Download Again
              </button>
              <div className="mt-4">
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-300 text-sm underline"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
