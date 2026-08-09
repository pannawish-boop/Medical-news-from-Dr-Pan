import React from 'react';
import { UserProfile, UserRole } from '../types';
import { Shield, User, Clock, CheckCircle, Sparkles } from 'lucide-react';

interface Props {
  currentUser: UserProfile;
  onSwitchUser: (newUser: UserProfile) => void;
  pendingRequestCount: number;
  pendingArticleCount: number;
}

export const RoleSwitcherBar: React.FC<Props> = ({
  currentUser,
  onSwitchUser,
  pendingRequestCount,
  pendingArticleCount,
}) => {
  const handleSelectRolePreset = (type: 'guest' | 'user' | 'pending' | 'admin') => {
    switch (type) {
      case 'guest':
        onSwitchUser({
          id: 'guest-1',
          name: 'ผู้เข้าชมทั่วไป',
          email: 'guest@example.com',
          role: 'guest',
          adminRequestStatus: 'none',
        });
        break;
      case 'user':
        onSwitchUser({
          id: 'user-101',
          name: 'คุณแม่น้องเอิร์ธ (ผู้ป่วย/ผู้ปกครอง)',
          email: 'parent.earth@gmail.com',
          role: 'user',
          adminRequestStatus: 'none',
        });
        break;
      case 'pending':
        onSwitchUser({
          id: 'user-102',
          name: 'พญ.นภา สุขเจริญ (รออนุมัติ Admin)',
          email: 'dr.napa@hospital.go.th',
          role: 'user',
          adminRequestStatus: 'pending',
          adminRequestReason: 'ต้องการช่วยตรวจบทความและเรียบเรียงเนื้อหาการแพทย์ร่วมกับ ดร.ปัน',
          adminRequestedAt: new Date().toISOString(),
        });
        break;
      case 'admin':
        onSwitchUser({
          id: 'admin-001',
          name: 'ดร.ปัน (นพ.ปัณณวิชญ์ - Admin Clinic)',
          email: 'dr.pan@rehabclinic.com',
          role: 'admin',
          adminRequestStatus: 'approved',
        });
        break;
    }
  };

  return (
    <div id="role-switcher-bar" className="bg-slate-900 text-slate-100 border-b border-slate-800 text-xs py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>โหมดทดลองระบบสิทธิ์ผู้ใช้ (Role Switcher):</span>
          <span className="bg-slate-800 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-slate-700">
            {currentUser.role === 'admin'
              ? '👑 Admin (ดร.ปัน)'
              : currentUser.adminRequestStatus === 'pending'
              ? '⏳ ผู้ขอสิทธิ์ Admin (รออนุมัติ)'
              : currentUser.role === 'user'
              ? '👤 ผู้ใช้ทั่วไป/ผู้ปกครอง'
              : '👀 ผู้เข้าชมทั่วไป'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="role-btn-guest"
            onClick={() => handleSelectRolePreset('guest')}
            className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1 ${
              currentUser.role === 'guest'
                ? 'bg-slate-700 text-white font-bold ring-1 ring-slate-400'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            <User className="w-3 h-3" /> ผู้เข้าชม
          </button>

          <button
            id="role-btn-user"
            onClick={() => handleSelectRolePreset('user')}
            className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1 ${
              currentUser.role === 'user' && currentUser.adminRequestStatus === 'none'
                ? 'bg-emerald-700 text-white font-bold ring-1 ring-emerald-400'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            <User className="w-3 h-3 text-emerald-400" /> User (ผู้ปกครอง)
          </button>

          <button
            id="role-btn-pending"
            onClick={() => handleSelectRolePreset('pending')}
            className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1 ${
              currentUser.adminRequestStatus === 'pending'
                ? 'bg-amber-700 text-white font-bold ring-1 ring-amber-400'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3 h-3 text-amber-400" /> User ขอสิทธิ์ Admin
          </button>

          <button
            id="role-btn-admin"
            onClick={() => handleSelectRolePreset('admin')}
            className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1 ${
              currentUser.role === 'admin'
                ? 'bg-teal-600 text-white font-bold ring-1 ring-teal-300'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3 h-3 text-teal-300" /> Admin Clinic (ดร.ปัน)
            {pendingArticleCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full text-[10px]">
                {pendingArticleCount} คิว
              </span>
            )}
            {pendingRequestCount > 0 && (
              <span className="bg-rose-500 text-white font-extrabold px-1.5 py-0.2 rounded-full text-[10px]">
                {pendingRequestCount} คำขอ
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
