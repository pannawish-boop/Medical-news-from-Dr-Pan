import React from 'react';
import { UserProfile } from '../types';
import { 
  Activity, 
  Search, 
  Bookmark, 
  ShieldCheck, 
  User, 
  LogOut, 
  Calendar, 
  Sparkles,
  FileText,
  Clock
} from 'lucide-react';

interface Props {
  currentUser: UserProfile;
  activeView: 'feed' | 'admin' | 'bookmarks';
  setActiveView: (view: 'feed' | 'admin' | 'bookmarks') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  bookmarkedCount: number;
  pendingArticleCount: number;
  pendingRequestCount: number;
  onOpenAuthModal: () => void;
  onOpenAdminRequestModal: () => void;
  onOpenAppointmentModal: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  bookmarkedCount,
  pendingArticleCount,
  pendingRequestCount,
  onOpenAuthModal,
  onOpenAdminRequestModal,
  onOpenAppointmentModal,
}) => {
  return (
    <header id="main-header" className="bg-white border-b border-teal-100 sticky top-0 z-30 shadow-sm">
      {/* Top Clinic Branding Bar */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-900 text-white py-2 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>ด็อกเตอร์ปันรีแฮบสหคลินิก (Doctor PAN Rehab Clinic) | คลินิกฟื้นฟูพัฒนาการเด็กและระบบประสาท</span>
          </div>
          <div className="flex items-center gap-4 text-teal-100">
            <span>📞 นัดหมาย / สอบถาม: 02-999-8888</span>
            <button
              id="appointment-top-btn"
              onClick={onOpenAppointmentModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-bold px-2.5 py-0.5 rounded shadow transition-all flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" /> นัดปรึกษา ดร.ปัน
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Logo & Clinic Title */}
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveView('feed')}
          >
            <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold text-slate-800 leading-tight tracking-tight">
                  ด็อกเตอร์ปันรีแฮบสหคลินิก
                </h1>
                <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded font-bold">
                  Doctor PAN Rehab
                </span>
              </div>
              <p className="text-xs text-slate-500">
                คลังบทความการแพทย์ประจำสัปดาห์ (ASD • ADHD • LD • TICS • TMS)
              </p>
            </div>
          </div>
        </div>

        {/* Middle Search & Navigation Controls */}
        <div className="flex items-center gap-3 flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="article-search-input"
              type="text"
              placeholder="ค้นหาบทความ (เช่น สมาธิสั้น, TMS, ออทิสติก)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Navigation & User Role Action Buttons */}
        <div className="flex items-center gap-2 justify-end">
          {/* Feed View Button */}
          <button
            id="nav-feed-btn"
            onClick={() => setActiveView('feed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'feed'
                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" /> บทความทั้งหมด
          </button>

          {/* Bookmarks Button */}
          <button
            id="nav-bookmarks-btn"
            onClick={() => setActiveView('bookmarks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
              activeView === 'bookmarks'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-500" /> บันทึกไว้
            {bookmarkedCount > 0 && (
              <span className="bg-amber-500 text-white font-extrabold px-1.5 py-0.2 rounded-full text-[10px]">
                {bookmarkedCount}
              </span>
            )}
          </button>

          {/* Admin Panel Button (If Admin) */}
          {currentUser.role === 'admin' && (
            <button
              id="nav-admin-btn"
              onClick={() => setActiveView('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all relative ${
                activeView === 'admin'
                  ? 'bg-slate-900 text-emerald-400 ring-2 ring-emerald-500/50'
                  : 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> แผงควบคุม Admin
              {(pendingArticleCount > 0 || pendingRequestCount > 0) && (
                <span className="bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-full text-[10px] animate-bounce">
                  {pendingArticleCount + pendingRequestCount}
                </span>
              )}
            </button>
          )}

          {/* Request Admin Role Button (For normal User) */}
          {currentUser.role === 'user' && currentUser.adminRequestStatus === 'none' && (
            <button
              id="request-admin-btn"
              onClick={onOpenAdminRequestModal}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm transition-all flex items-center gap-1 border border-amber-400"
            >
              <Sparkles className="w-3.5 h-3.5" /> ขอสิทธิ์ Admin
            </button>
          )}

          {currentUser.role === 'user' && currentUser.adminRequestStatus === 'pending' && (
            <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" /> รอ Admin ตรวจอนุมัติ
            </span>
          )}

          {/* Login / Auth Modal Trigger */}
          {currentUser.role === 'guest' ? (
            <button
              id="login-btn"
              onClick={onOpenAuthModal}
              className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" /> เข้าสู่ระบบ
            </button>
          ) : (
            <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
              <div className="text-right text-[11px] hidden sm:block">
                <p className="font-bold text-slate-800 truncate max-w-[120px]">{currentUser.name}</p>
                <p className="text-slate-400 capitalize text-[10px]">
                  {currentUser.role === 'admin' ? 'Doctor PAN Admin' : 'ผู้ปกครอง'}
                </p>
              </div>
              <button
                id="user-logout-btn"
                onClick={onOpenAuthModal}
                title="เปลี่ยนบัญชี / ออกจากระบบ"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <User className="w-4 h-4 text-teal-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
