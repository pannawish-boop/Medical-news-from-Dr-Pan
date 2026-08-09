import React, { useState } from 'react';
import { Article, UserProfile, WeeklyBatchLog, ArticleCategory } from '../types';
import { CATEGORIES } from '../data/categories';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Sparkles, 
  Clock, 
  Users, 
  FileText, 
  RefreshCw, 
  Calendar, 
  Plus, 
  Trash2, 
  AlertTriangle,
  BookOpen,
  Search,
  Check,
  X
} from 'lucide-react';

interface Props {
  articles: Article[];
  pendingArticles: Article[];
  batchLogs: WeeklyBatchLog[];
  userRequests: UserProfile[];
  onApproveArticle: (articleId: string) => void;
  onRejectArticle: (articleId: string) => void;
  onUpdateArticle: (updatedArticle: Article) => void;
  onApproveUserRequest: (userId: string) => void;
  onRejectUserRequest: (userId: string) => void;
  onTriggerBatchGeneration: (category?: ArticleCategory | 'all') => Promise<void>;
  isGeneratingBatch: boolean;
  onDeleteArticle: (articleId: string) => void;
  onResetArticles?: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  articles,
  pendingArticles,
  batchLogs,
  userRequests,
  onApproveArticle,
  onRejectArticle,
  onUpdateArticle,
  onApproveUserRequest,
  onRejectUserRequest,
  onTriggerBatchGeneration,
  isGeneratingBatch,
  onDeleteArticle,
  onResetArticles,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'batch' | 'users' | 'published'>('pending');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [selectedGenCategory, setSelectedGenCategory] = useState<ArticleCategory | 'all'>('all');
  const [adminSearch, setAdminSearch] = useState('');

  const pendingUserRequests = userRequests.filter((u) => u.adminRequestStatus === 'pending');
  const publishedArticles = articles.filter((a) => a.status === 'published');

  const filteredPendingArticles = pendingArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      a.summary.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      onUpdateArticle(editingArticle);
      setEditingArticle(null);
    }
  };

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 py-8">
      {/* Admin Panel Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> ด็อกเตอร์ปันรีแฮบสหคลินิก • แผงควบคุมระบบ บรรณาธิการผู้บริหาร
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              ระบบตรวจสอบบทความและจัดการสิทธิ์ Admin
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              บทความการแพทย์ประจำสัปดาห์ (25 บทความ/สัปดาห์) ที่สร้างขึ้นอัตโนมัติจาก AI ต้องผ่านการตรวจสอบ ปรับแก้ และอนุมัติจาก Admin ก่อนเผยแพร่สู่สาธารณะ
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-2xl text-center">
              <p className="text-2xl font-black text-amber-400">{pendingArticles.length}</p>
              <p className="text-[10px] text-slate-400 font-bold">คิวรออนุมัติ</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-2xl text-center">
              <p className="text-2xl font-black text-rose-400">{pendingUserRequests.length}</p>
              <p className="text-[10px] text-slate-400 font-bold">คำขอสิทธิ์ Admin</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-2xl text-center">
              <p className="text-2xl font-black text-emerald-400">{publishedArticles.length}</p>
              <p className="text-[10px] text-slate-400 font-bold">เผยแพร่แล้ว</p>
            </div>
            {onResetArticles && (
              <button
                onClick={onResetArticles}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-2.5 rounded-2xl text-xs font-bold flex flex-col items-center justify-center transition-all shadow-sm hover:border-teal-500/50"
                title="รีเซ็ตบทความทั้งหมดเป็นฉบับมาตรฐาน 25 บทความที่มี DOI ล่าสุดถูกต้อง"
              >
                <RefreshCw className="w-4 h-4 text-teal-400 mb-0.5" />
                <span className="text-[10px]">คืนค่าบทความมาตรฐาน</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" /> คิวรออนุมัติบทความ ({pendingArticles.length})
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'batch'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" /> สร้างบทความอัตโนมัติประจำสัปดาห์
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" /> จัดการคำขอสิทธิ์ Admin ({pendingUserRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('published')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'published'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" /> บทความที่เผยแพร่แล้ว ({publishedArticles.length})
          </button>
        </div>
      </div>

      {/* TAB 1: PENDING ARTICLES APPROVAL QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>คิวบทความสร้างอัตโนมัติรอ Admin ตรวจสอบก่อนนำเสนอ</span>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  {pendingArticles.length} รายการ
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                บทความถูกสร้างจากวารสารการแพทย์ล่าสุด สามารถแก้ไข ตรวจสอบความถูกต้อง แล้วกดอนุมัติเพื่อแสดงในหน้าแรก
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหารายการในคิว..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {filteredPendingArticles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">ไม่มีบทความค้างในคิวอนุมัติ</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                บทความทั้งหมดได้รับการอนุมัติเผยแพร่แล้ว หรือคุณสามารถสั่งรันระบบสร้างบทความชุดใหม่ (25 บทความ) ได้ในแท็บ "สร้างบทความอัตโนมัติ"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredPendingArticles.map((art) => {
                const categoryInfo = CATEGORIES.find((c) => c.id === art.category);

                return (
                  <div
                    key={art.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-teal-400 transition-all flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {categoryInfo?.nameTh || art.category}
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {art.batchWeek}
                        </span>
                        <span className="text-xs text-slate-400">
                          สร้างเมื่อ {new Date(art.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{art.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{art.summary}</p>

                      {art.actionableTakeaways && art.actionableTakeaways.length > 0 && (
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                          <span className="font-bold text-teal-800">คำแนะนำหลัก: </span>
                          <span className="text-slate-600">{art.actionableTakeaways[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex flex-row md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                      <button
                        onClick={() => setEditingArticle(art)}
                        className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-teal-600" /> แก้ไขบทความ
                      </button>

                      <button
                        onClick={() => onApproveArticle(art.id)}
                        className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> อนุมัติเผยแพร่
                      </button>

                      <button
                        onClick={() => onRejectArticle(art.id)}
                        className="w-full px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> ไม่อนุมัติ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AUTOMATED BATCH GENERATION CONTROL */}
      {activeTab === 'batch' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                  🔄 ระบบดึงวารสารการแพทย์และสร้างบทความอัตโนมัติ (Automated AI Medical Digest)
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  สัปดาห์ละ 1 ครั้ง 25 บทความ (หมวดละ 5 บทความ)
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                  ระบบจะสกัดข้อมูลจากวารสารการแพทย์ล่าสุด (เช่น Journal of Autism, Pediatrics, Brain Stimulation, Movement Disorders) แล้วแปลงเป็นบทความประมาณครึ่งหน้า A4 ที่อ่านง่าย ปฏิบัติได้จริง
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <select
                    value={selectedGenCategory}
                    onChange={(e) => setSelectedGenCategory(e.target.value as any)}
                    className="bg-slate-50 border border-slate-300 text-xs rounded-xl px-3 py-2 text-slate-800 font-medium"
                  >
                    <option value="all">ทั้ง 5 หมวดหมู่ (รวม 25 บทความ)</option>
                    <option value="asd">เฉพาะ โรคออทิสติก (ASD) 5 บทความ</option>
                    <option value="adhd">เฉพาะ สมาธิสั้น (ADHD) 5 บทความ</option>
                    <option value="ld">เฉพาะ การเรียนรู้บกพร่อง (LD) 5 บทความ</option>
                    <option value="tics">เฉพาะ โรคติ๊ก (TICS) 5 บทความ</option>
                    <option value="tms">เฉพาะ TMS กระตุ้นสมอง 5 บทความ</option>
                  </select>

                  <button
                    onClick={() => onTriggerBatchGeneration(selectedGenCategory)}
                    disabled={isGeneratingBatch}
                    className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-400 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    {isGeneratingBatch ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> กำลังสร้างบทความจาก Gemini AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-300" /> สั่งสร้างบทความรอบใหม่ทันที
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Batch Logs History */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" /> ประวัติการสร้างบทความประจำสัปดาห์ (Batch Logs)
            </h3>

            <div className="space-y-3">
              {batchLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{log.weekLabel}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ✓ สมบูรณ์
                      </span>
                    </div>
                    <p className="text-slate-600">{log.note}</p>
                  </div>

                  <div className="flex items-center gap-4 text-slate-500 shrink-0">
                    <div>
                      <span className="font-bold text-slate-800">{log.totalGenerated}</span> บทความ
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">{log.categoriesCovered}</span> หมวดหมู่
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleDateString('th-TH')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USER & ADMIN ROLE REQUEST MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-500" /> คำขอรับสิทธิ์ Admin จากผู้ใช้งานทั่วไป
            </h2>
            <p className="text-xs text-slate-500">
              User สามารถส่งคำขอเป็น Admin พร้อมระบุเหตุผล หาก Admin หลักอนุมัติ ผู้ใช้ท่านนั้นจะสามารถเข้าถึงแผงควบคุมและร่วมตรวจบทความได้
            </p>
          </div>

          {pendingUserRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">ไม่มีคำขอสิทธิ์ Admin ค้างอยู่</h3>
              <p className="text-xs text-slate-500 mt-1">
                คุณสามารถทดสอบส่งคำขอโดยใช้ Role Switcher ด้านบนเลือกโหมด "User ขอสิทธิ์ Admin" แล้วกดขอสิทธิ์ได้
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingUserRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{req.name}</h3>
                      <p className="text-xs text-slate-500">{req.email}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      ⏳ รออนุมัติ
                    </span>
                  </div>

                  {req.adminRequestReason && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block mb-1">เหตุผลที่ขอสิทธิ์ Admin:</span>
                      <p className="italic text-slate-600">"{req.adminRequestReason}"</p>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      onClick={() => onRejectUserRequest(req.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      ปฏิเสธคำขอ
                    </button>
                    <button
                      onClick={() => onApproveUserRequest(req.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> อนุมัติเป็น Admin
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PUBLISHED ARTICLES MANAGEMENT */}
      {activeTab === 'published' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">รายการบทความที่เผยแพร่แล้วบนเว็บไซต์</h2>
              <p className="text-xs text-slate-500">
                บทความที่คนไข้และประชาชนทั่วไปมองเห็นในหน้าแรก สามารถแก้ไขข้อมูลหรือถอนการเผยแพร่ได้ตลอดเวลา
              </p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full">
              {publishedArticles.length} บทความ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedArticles.map((art) => {
              const categoryInfo = CATEGORIES.find((c) => c.id === art.category);

              return (
                <div
                  key={art.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="bg-teal-50 text-teal-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {categoryInfo?.nameTh || art.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ผู้อนุมัติ: {art.approvedBy || 'ดร.ปัน'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{art.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{art.summary}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      อ่านแล้ว {art.viewsCount || 0} ครั้ง
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingArticle(art)}
                        className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg text-xs"
                        title="แก้ไขบทความ"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteArticle(art.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs"
                        title="ลบบทความ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EDIT ARTICLE MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" /> แก้ไขบทความก่อนอนุมัติเผยแพร่
              </h3>
              <button onClick={() => setEditingArticle(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">หมวดหมู่บทความ</label>
                <select
                  value={editingArticle.category}
                  onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-800"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameTh} ({c.nameEn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อบทความ</label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">สรุปสั้น (Summary)</label>
                <textarea
                  rows={2}
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เนื้อหาบทความหลัก (~ครึ่งหน้า A4)
                </label>
                <textarea
                  rows={8}
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-800 leading-relaxed font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  คำแนะนำปฏิบัติได้ทันที (ข้อละ 1 บรรทัด)
                </label>
                <textarea
                  rows={4}
                  value={editingArticle.actionableTakeaways.join('\n')}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      actionableTakeaways: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-800"
                />
              </div>

              {/* Citations / DOI / References Editing Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-teal-600" /> แหล่งข้อมูลอ้างอิงและ DOI / วารสารการแพทย์
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newCitation = {
                        title: '',
                        sourceName: '',
                        publicationYear: new Date().getFullYear(),
                        doi: '',
                        url: '',
                      };
                      setEditingArticle({
                        ...editingArticle,
                        citations: [...(editingArticle.citations || []), newCitation],
                      });
                    }}
                    className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> เพิ่มแหล่งอ้างอิง
                  </button>
                </div>

                {(!editingArticle.citations || editingArticle.citations.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">ยังไม่มีรายการอ้างอิง คุณสามารถกดปุ่ม "เพิ่มแหล่งอ้างอิง" ด้านบนได้</p>
                ) : (
                  editingArticle.citations.map((citation, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                          อ้างอิงรายการที่ {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingArticle.citations.filter((_, i) => i !== index);
                            setEditingArticle({ ...editingArticle, citations: updated });
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors text-xs flex items-center gap-1"
                          title="ลบรายการอ้างอิงนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> ลบ
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">ชื่อหัวข้องานวิจัย / บทความอ้างอิง (Title)</label>
                          <input
                            type="text"
                            placeholder="e.g. Practice Parameter for the Assessment and Treatment..."
                            value={citation.title}
                            onChange={(e) => {
                              const updated = [...editingArticle.citations];
                              updated[index] = { ...updated[index], title: e.target.value };
                              setEditingArticle({ ...editingArticle, citations: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">ชื่อวารสาร / สถาบัน (Journal Source)</label>
                          <input
                            type="text"
                            placeholder="e.g. Journal of the American Academy of Child..."
                            value={citation.sourceName}
                            onChange={(e) => {
                              const updated = [...editingArticle.citations];
                              updated[index] = { ...updated[index], sourceName: e.target.value };
                              setEditingArticle({ ...editingArticle, citations: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">ปีที่ตีพิมพ์ (Year)</label>
                          <input
                            type="number"
                            placeholder="e.g. 2024"
                            value={citation.publicationYear || ''}
                            onChange={(e) => {
                              const updated = [...editingArticle.citations];
                              updated[index] = { ...updated[index], publicationYear: parseInt(e.target.value) || 0 };
                              setEditingArticle({ ...editingArticle, citations: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">เลข DOI (e.g. 10.1016/j.jaac.2013.09.015)</label>
                          <input
                            type="text"
                            placeholder="10.XXXX/XXXXX"
                            value={citation.doi || ''}
                            onChange={(e) => {
                              const newDoi = e.target.value.trim();
                              const updated = [...editingArticle.citations];
                              const currentUrl = updated[index].url || '';
                              let autoUrl = currentUrl;
                              if (newDoi && (!currentUrl || currentUrl.startsWith('https://doi.org/'))) {
                                autoUrl = `https://doi.org/${newDoi.replace(/^https?:\/\/doi\.org\//, '')}`;
                              }
                              updated[index] = {
                                ...updated[index],
                                doi: newDoi,
                                url: autoUrl,
                              };
                              setEditingArticle({ ...editingArticle, citations: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">URL ลิงค์วารสาร (https://doi.org/...)</label>
                          <input
                            type="url"
                            placeholder="https://doi.org/10.1016/..."
                            value={citation.url || ''}
                            onChange={(e) => {
                              const updated = [...editingArticle.citations];
                              updated[index] = { ...updated[index], url: e.target.value };
                              setEditingArticle({ ...editingArticle, citations: updated });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
