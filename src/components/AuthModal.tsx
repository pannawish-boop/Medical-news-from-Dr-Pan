import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { User, Shield, Sparkles, X, Lock, Mail, CheckCircle, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
  onRequestAdmin: (reason: string) => void;
  mode: 'login' | 'request_admin';
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onRequestAdmin,
  mode: initialMode,
}) => {
  const [modalMode, setModalMode] = useState<'login' | 'request_admin'>(initialMode);
  const [nameInput, setNameInput] = useState(currentUser.name || '');
  const [emailInput, setEmailInput] = useState(currentUser.email || '');
  const [requestReason, setRequestReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      id: `usr-${Date.now()}`,
      name: nameInput || 'ผู้ปกครองคนไข้',
      email: emailInput || 'parent@example.com',
      role: 'user',
      adminRequestStatus: 'none',
    });
    onClose();
  };

  const handleRequestAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestReason.trim()) {
      alert('กรุณาระบุเหตุผลการขอรับสิทธิ์ Admin');
      return;
    }
    onRequestAdmin(requestReason);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              ป
            </div>
            <div>
              <h3 className="font-bold text-sm">ด็อกเตอร์ปันรีแฮบสหคลินิก</h3>
              <p className="text-[11px] text-slate-400">Doctor PAN Rehab Clinic Member System</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {modalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <h4 className="text-base font-bold text-slate-900">เข้าสู่ระบบผู้ใช้งาน / ผู้ปกครอง</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  เพื่อบันทึกบทความที่ชอบ และขอรับสิทธิ์ร่วมดูแลข้อมูลการแพทย์
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อ-นามสกุล</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="เช่น คุณแม่น้องเอิร์ธ หรือ พญ.นภา"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">อีเมลติดต่อ</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-md transition-all mt-2"
              >
                เข้าสู่ระบบทันที
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  ต้องการยื่นคำขอเป็น Admin หรือไม่?{' '}
                  <button
                    type="button"
                    onClick={() => setModalMode('request_admin')}
                    className="text-teal-700 font-bold hover:underline"
                  >
                    ส่งคำขอสิทธิ์ Admin
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRequestAdminSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <span className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 font-bold">
                  <Shield className="w-5 h-5 text-amber-600" />
                </span>
                <h4 className="text-base font-bold text-slate-900">ขอรับสิทธิ์ Admin (Administrator Request)</h4>
                <p className="text-xs text-slate-500 mt-1">
                  สำหรับแพทย์ นักบำบัด หรือบุคลากรที่ต้องการร่วมตรวจทานบทความกับ ดร.ปัน
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-center space-y-1">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-xs">ส่งคำขอรับสิทธิ์ Admin เรียบร้อยแล้ว!</p>
                  <p className="text-[11px] text-emerald-700">
                    คำขอของคุณถูกส่งไปยัง ดร.ปัน (Admin หลัก) แล้ว จะมีการแจ้งเตือนเมื่อได้รับการอนุมัติ
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900">
                    <p className="font-bold">ผู้ขอสิทธิ์ปัจจุบัน:</p>
                    <p className="text-slate-700">{currentUser.name} ({currentUser.email})</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ระบุเหตุผลความจำเป็นในการขอสิทธิ์ Admin *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="เช่น เป็นกุมารแพทย์พัฒนาการต้องการช่วยตรวจสอบบทความประจำสัปดาห์ หรือนักกิจกรรมบำบัดประจำเป็นคลินิก"
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" /> ยืนยันส่งคำขอรับสิทธิ์ Admin
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setModalMode('login')}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      ← กลับไปหน้าเข้าสู่ระบบ
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
