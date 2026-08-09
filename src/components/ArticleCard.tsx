import React from 'react';
import { Article, UserRole } from '../types';
import { CATEGORIES } from '../data/categories';
import { 
  Clock, 
  Bookmark, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';

interface Props {
  article: Article;
  onSelect: (article: Article) => void;
  onToggleBookmark: (articleId: string, e: React.MouseEvent) => void;
  currentUserRole: UserRole;
  onApprove?: (articleId: string, e: React.MouseEvent) => void;
  onReject?: (articleId: string, e: React.MouseEvent) => void;
  onEdit?: (article: Article, e: React.MouseEvent) => void;
}

export const ArticleCard: React.FC<Props> = ({
  article,
  onSelect,
  onToggleBookmark,
  currentUserRole,
  onApprove,
  onReject,
  onEdit,
}) => {
  const categoryInfo = CATEGORIES.find((c) => c.id === article.category);

  return (
    <div
      id={`article-card-${article.id}`}
      onClick={() => onSelect(article)}
      className="bg-white rounded-2xl border border-slate-200/80 hover:border-teal-400 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
    >
      {/* Category Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400" />

      <div>
        {/* Top Badges & Meta */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              {categoryInfo?.nameTh || article.category}
            </span>

            {article.status === 'published' ? (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> ตรวจอนุมัติแล้ว
              </span>
            ) : article.status === 'draft_pending' ? (
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                ⏳ รอตนุมัติ Admin
              </span>
            ) : (
              <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                ✕ ปฏิเสธ
              </span>
            )}
          </div>

          <button
            id={`bookmark-btn-${article.id}`}
            onClick={(e) => onToggleBookmark(article.id, e)}
            title={article.bookmarked ? 'ยกเลิกการบันทึก' : 'บันทึกบทความนี้'}
            className={`p-1.5 rounded-lg transition-colors ${
              article.bookmarked
                ? 'bg-amber-100 text-amber-600 font-bold'
                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Article Title */}
        <h3 className="text-base font-bold text-slate-800 group-hover:text-teal-700 transition-colors line-clamp-2 mb-2 leading-snug">
          {article.title}
        </h3>

        {/* Short Teaser Summary */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {article.summary}
        </p>

        {/* Actionable Takeaways Preview Box */}
        {article.actionableTakeaways && article.actionableTakeaways.length > 0 && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-4 text-xs text-slate-700">
            <div className="font-bold text-teal-800 text-[11px] mb-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ข้อแนะนำปฏิบัติได้ทันทีสำหรับผู้ปกครอง:
            </div>
            <ul className="space-y-1 pl-1">
              {article.actionableTakeaways.slice(0, 2).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 truncate">
                  <span className="text-teal-600 font-bold">•</span>
                  <span className="truncate">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Info & Admin Actions */}
      <div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {article.readTime || '3 นาที'}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {article.citations?.length || 0} แหล่งอ้างอิง
            </span>
          </div>

          <span className="text-teal-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
            อ่านบทความ <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Admin Review Quick Actions (If Admin) */}
        {currentUserRole === 'admin' && article.status === 'draft_pending' && (
          <div className="mt-3 pt-3 border-t border-amber-200 bg-amber-50/60 -mx-5 -mb-5 p-3 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
              ⚡ คิวรอ Admin อนุมัติ
            </span>
            <div className="flex items-center gap-1.5">
              {onEdit && (
                <button
                  onClick={(e) => onEdit(article, e)}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-[11px] font-medium flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> แก้ไข
                </button>
              )}
              {onReject && (
                <button
                  onClick={(e) => onReject(article.id, e)}
                  className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded text-[11px] font-bold flex items-center gap-1"
                >
                  <XCircle className="w-3 h-3" /> ไม่อนุมัติ
                </button>
              )}
              {onApprove && (
                <button
                  onClick={(e) => onApprove(article.id, e)}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-sm flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" /> อนุมัติทันที
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
