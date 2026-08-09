import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { CATEGORIES } from '../data/categories';
import { 
  X, 
  Clock, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Share2, 
  Printer, 
  FileText,
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  BookOpen, 
  Calendar,
  Sparkles,
  Type,
  MessageSquare,
  Building2
} from 'lucide-react';

interface Props {
  article: Article | null;
  onClose: () => void;
  onToggleBookmark: (articleId: string, e: React.MouseEvent) => void;
  onOpenAppointmentModal: () => void;
}

export const ArticleDetailModal: React.FC<Props> = ({
  article,
  onClose,
  onToggleBookmark,
  onOpenAppointmentModal,
}) => {
  if (!article) return null;

  const categoryInfo = CATEGORIES.find((c) => c.id === article.category);

  // Text size state: 'sm' | 'md' | 'lg' | 'xl'
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  // Text-To-Speech (SpeechSynthesis) state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Reset speech synthesis on modal unmount or article change
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article.id]);

  const handleStartSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('เบราว์เซอร์ของคุณไม่รองรับระบบอ่านเสียงสังเคราะห์ (Web Speech API)');
      return;
    }

    window.speechSynthesis.cancel();

    const fullTextToRead = `${article.title} บทความจาก ด็อกเตอร์ปันรีแฮบสหคลินิก. ${article.summary}. ${article.content.replace(/[#*]/g, '')}`;
    const utterance = new SpeechSynthesisUtterance(fullTextToRead);
    utterance.lang = 'th-TH';
    utterance.rate = speechRate;

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
  };

  const handlePauseSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isPausedAudio) {
        window.speechSynthesis.resume();
        setIsPausedAudio(false);
      } else {
        window.speechSynthesis.pause();
        setIsPausedAudio(true);
      }
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    const categoryTh = categoryInfo?.nameTh || article.category;
    const formattedDate = new Date(article.createdAt).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const paragraphsHtml = article.content
      .split('\n\n')
      .map((paragraph) => {
        if (paragraph.startsWith('### ')) {
          return `<h3 style="color:#0f766e; font-size:15px; font-weight:bold; margin-top:16px; margin-bottom:6px;">${paragraph.replace('### ', '')}</h3>`;
        }
        if (paragraph.startsWith('## ')) {
          return `<h2 style="color:#0d9488; font-size:17px; font-weight:bold; margin-top:20px; margin-bottom:8px; border-bottom:1px solid #ccfbf1; padding-bottom:4px;">${paragraph.replace('## ', '')}</h2>`;
        }
        return `<p style="margin-bottom:12px; text-align:justify; line-height:1.7;">${paragraph}</p>`;
      })
      .join('');

    const takeawaysHtml =
      article.actionableTakeaways && article.actionableTakeaways.length > 0
        ? `<div style="background-color:#ecfdf5; border:1px solid #a7f3d0; padding:16px; border-radius:10px; margin-top:24px;">
            <h3 style="font-size:14px; font-weight:bold; color:#065f46; margin:0 0 10px 0;">✅ คำแนะนำการปฏิบัติตนที่นำไปใช้ได้ทันที (Actionable Takeaways)</h3>
            <ul style="margin:0; padding-left:20px; color:#047857; font-size:13px;">
              ${article.actionableTakeaways.map((t) => `<li style="margin-bottom:6px;">${t}</li>`).join('')}
            </ul>
          </div>`
        : '';

    const citationsHtml =
      article.citations && article.citations.length > 0
        ? `<div style="margin-top:24px; padding:14px; background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;">
            <h4 style="font-size:12px; font-weight:bold; color:#334155; margin:0 0 10px 0; text-transform:uppercase;">📚 แหล่งข้อมูลอ้างอิงทางการแพทย์ (Medical Citations & DOIs)</h4>
            ${article.citations
              .map(
                (c) => `
              <div style="font-size:11px; color:#475569; margin-bottom:8px; padding-bottom:6px; border-bottom:1px dashed #cbd5e1;">
                <strong>${c.title}</strong><br/>
                ${c.sourceName} (${c.publicationYear}) ${c.doi ? `• DOI: ${c.doi}` : ''}
              </div>
            `
              )
              .join('')}
          </div>`
        : '';

    const printBodyContent = `
      <div style="font-family:'Sarabun','Sukhumvit Set',system-ui,sans-serif; color:#1e293b; max-width:800px; margin:0 auto; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #0d9488; padding-bottom:14px; margin-bottom:18px;">
          <div>
            <div style="font-size:18px; font-weight:800; color:#0f766e;">ด็อกเตอร์ปันรีแฮบสหคลินิก (Doctor PAN Rehab Clinic)</div>
            <div style="font-size:12px; color:#64748b; margin-top:3px;">คลินิกฟื้นฟูพัฒนาการเด็ก และระบบประสาท | พาสิโอ้ทาวน์ รามคำแหง กรุงเทพมหานคร</div>
          </div>
          <div style="background-color:#0d9488; color:#ffffff; font-size:11px; font-weight:bold; padding:5px 12px; border-radius:20px; white-space:nowrap;">
            ${categoryTh}
          </div>
        </div>

        <h1 style="font-size:22px; font-weight:800; color:#0f172a; margin:0 0 12px 0; line-height:1.4;">${article.title}</h1>

        <div style="font-size:12px; color:#64748b; border-bottom:1px solid #e2e8f0; padding-bottom:10px; margin-bottom:18px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <span>👨‍⚕️ ผู้เขียน/ตรวจอนุมัติ: <strong>${article.approvedBy || article.author}</strong></span>
          <span>📅 วันที่เผยแพร่: <strong>${formattedDate}</strong> | ⏱️ เวลาอ่าน: ${article.readTime}</span>
        </div>

        <div style="background-color:#f0fdf4; border-left:4px solid #10b981; padding:14px; font-weight:600; color:#065f46; margin-bottom:20px; border-radius:0 8px 8px 0; font-size:13px; line-height:1.6;">
          💡 สรุปบทความ: ${article.summary}
        </div>

        <div style="font-size:14px; line-height:1.8; color:#334155;">
          ${paragraphsHtml}
        </div>

        ${takeawaysHtml}
        ${citationsHtml}

        <div style="margin-top:30px; border-top:1px solid #cbd5e1; padding-top:14px; text-align:center; font-size:11px; color:#64748b;">
          <p style="margin:0 0 4px 0;"><strong>ด็อกเตอร์ปันรีแฮบสหคลินิก</strong> | พาสิโอ้ทาวน์ รามคำแหง กรุงเทพฯ | โทร: 063-224-6680, 02-024-1730</p>
          <p style="margin:0 0 4px 0;">เว็บไซต์: www.doctorpanrehab.com | LINE: @doctorpanrehab | อีเมล: doctorpanrehab@gmail.com</p>
          <p style="margin:4px 0 0 0; color:#94a3b8;">เอกสารทางการแพทย์เพื่อการเรียนรู้และบำบัดฟื้นฟูพัฒนาการ | พิมพ์เมื่อ ${new Date().toLocaleString('th-TH')}</p>
        </div>
      </div>
    `;

    // Prepare printable DOM container in current page
    let printContainer = document.getElementById('printable-article-container');
    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'printable-article-container';
      document.body.appendChild(printContainer);
    }
    printContainer.innerHTML = printBodyContent;

    // Build standalone HTML for new tab
    const fullHtmlDocument = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${article.title} - ด็อกเตอร์ปันรีแฮบสหคลินิก</title>
          <meta charset="utf-8" />
          <style>
            @page { size: A4; margin: 15mm; }
            @media print {
              .no-print-toolbar { display: none !important; }
            }
          </style>
        </head>
        <body style="margin:0; padding:0; background:#f8fafc;">
          <div class="no-print-toolbar" style="background:#0f172a; color:#ffffff; padding:12px 24px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:9999; box-shadow:0 4px 12px rgba(0,0,0,0.15); font-family:sans-serif;">
            <div>
              <strong style="font-size:14px;">📄 เอกสารบทความพร้อมพิมพ์ / บันทึก PDF</strong>
              <div style="font-size:11px; color:#94a3b8; margin-top:2px;">
                💡 เคล็ดลับการบันทึก PDF: ในหน้าต่างสั่งพิมพ์ ให้เลือก เครื่องพิมพ์ / Destination เป็น <strong>"Save as PDF"</strong> หรือ <strong>"บันทึกเป็น PDF"</strong>
              </div>
            </div>
            <div style="display:flex; gap:10px;">
              <button onclick="window.print()" style="background:#10b981; color:#022c22; border:none; padding:8px 18px; border-radius:8px; font-weight:800; font-size:13px; cursor:pointer;">
                🖨️ พิมพ์ / บันทึก PDF ตอนนี้
              </button>
              <button onclick="window.close()" style="background:#334155; color:#ffffff; border:none; padding:8px 14px; border-radius:8px; font-weight:bold; font-size:12px; cursor:pointer;">
                ✕ ปิดหน้าต่าง
              </button>
            </div>
          </div>
          ${printBodyContent}
          <script>
            window.addEventListener('DOMContentLoaded', function() {
              setTimeout(function() { window.print(); }, 300);
            });
          </script>
        </body>
      </html>
    `;

    // Try opening popup window with Blob URL
    try {
      const blob = new Blob([fullHtmlDocument], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const printWin = window.open(blobUrl, '_blank');
      if (!printWin) {
        // Fallback to window.print if popup is blocked
        window.print();
      }
    } catch (e) {
      console.warn('Blob window open error:', e);
      window.print();
    }
  };

  const getTextClass = () => {
    switch (textSize) {
      case 'sm': return 'text-sm leading-relaxed';
      case 'md': return 'text-base leading-relaxed';
      case 'lg': return 'text-lg leading-relaxed';
      case 'xl': return 'text-xl leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {categoryInfo?.nameTh || article.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ตรวจอนุมัติโดย ดร.ปัน
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Article Title */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug mb-3">
              {article.title}
            </h1>

            {/* Author & Publication Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  ป
                </div>
                <div>
                  <p className="font-bold text-slate-800">{article.author}</p>
                  <p className="text-[11px] text-slate-400">ด็อกเตอร์ปันรีแฮบสหคลินิก</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(article.createdAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {article.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Reader Controls Toolbar (Text Size & Speech Reader) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            {/* Audio Reader Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Volume2 className="w-4 h-4 text-teal-600" /> ฟังบทความนี้:
              </span>

              {!isPlayingAudio ? (
                <button
                  onClick={handleStartSpeech}
                  className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> อ่านให้ฟัง
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePauseSpeech}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    {isPausedAudio ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
                    {isPausedAudio ? 'เล่นต่อ' : 'พักชั่วคราว'}
                  </button>
                  <button
                    onClick={handleStopSpeech}
                    className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs"
                    title="หยุดอ่าน"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
              )}

              {/* Speed Rate Control */}
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="bg-white border border-slate-200 text-[11px] rounded px-1.5 py-1 text-slate-700 font-medium"
              >
                <option value={0.8}>ความเร็ว 0.8x</option>
                <option value={1.0}>ความเร็ว 1.0x (ปกติ)</option>
                <option value={1.2}>ความเร็ว 1.2x</option>
                <option value={1.5}>ความเร็ว 1.5x</option>
              </select>
            </div>

            {/* Text Size Controls */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 px-1 flex items-center gap-1">
                <Type className="w-3 h-3" /> ขนาดอักษร:
              </span>
              {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setTextSize(sz)}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                    textSize === sz ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Article Summary Lead */}
          <div className="p-4 bg-teal-50/70 border-l-4 border-teal-600 rounded-r-2xl text-slate-800 font-medium text-sm leading-relaxed">
            💡 {article.summary}
          </div>

          {/* Article Full Body Text (Full A4 length) */}
          <div className={`text-slate-800 space-y-4 font-normal ${getTextClass()}`}>
            {article.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg font-bold text-teal-900 mt-6 mb-2 border-b border-teal-100 pb-1">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-xl font-bold text-teal-950 mt-6 mb-2">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              return (
                <p key={idx} className="text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Actionable Takeaways Section Box */}
          {article.actionableTakeaways && article.actionableTakeaways.length > 0 && (
            <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>คำแนะนำการปฏิบัติตนที่นำไปใช้ได้ทันที (Actionable Takeaways)</span>
              </h3>
              <ul className="space-y-2.5">
                {article.actionableTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-emerald-950">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Medical References & Citations */}
          {article.citations && article.citations.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-teal-600" /> แหล่งข้อมูลอ้างอิงทางการแพทย์ (Medical Citations)
              </h4>
              <div className="space-y-2 text-xs">
                {article.citations.map((citation, idx) => {
                  const targetUrl =
                    citation.url ||
                    (citation.doi
                      ? `https://doi.org/${citation.doi.replace(/^https?:\/\/doi\.org\//, '')}`
                      : `https://scholar.google.com/scholar?q=${encodeURIComponent(citation.title)}`);

                  return (
                    <div key={idx} className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-800">{citation.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {citation.sourceName} ({citation.publicationYear}) {citation.doi ? `• DOI: ${citation.doi}` : ''}
                        </p>
                      </div>
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold text-xs shrink-0 hover:underline"
                      >
                        เปิดวารสาร <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Doctor PAN Clinic Call-To-Action Box */}
          <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs mb-1">
                <Building2 className="w-4 h-4" /> ด็อกเตอร์ปันรีแฮบสหคลินิก
              </div>
              <h4 className="text-base font-bold">ต้องการคำปรึกษาประเมินอาการกับ ดร.ปัน?</h4>
              <p className="text-xs text-teal-100 mt-1">
                คลินิกเฉพาะทางบำบัดฟื้นฟูออทิสติก, สมาธิสั้น, LD, ติ๊ก และนวัตกรรม TMS ด้วยทีมกุมารแพทย์และนักบำบัด
              </p>
            </div>
            <button
              onClick={onOpenAppointmentModal}
              className="bg-emerald-400 hover:bg-emerald-300 text-teal-950 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow transition-all shrink-0 flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" /> นัดหมาย / จองคิวตรวจ
            </button>
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between gap-3 sticky bottom-0 z-20">
          <button
            onClick={(e) => onToggleBookmark(article.id, e)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              article.bookmarked
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current text-amber-500" />
            {article.bookmarked ? 'บันทึกแล้ว' : 'บันทึกบทความ'}
          </button>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              {copiedLink ? 'คัดลอกลิงก์แล้ว!' : 'แชร์บทความ'}
            </button>

            <button
              onClick={handlePrint}
              title="พิมพ์บทความผ่านเครื่องพิมพ์"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4 text-slate-300" /> พิมพ์
            </button>

            <button
              onClick={handlePrint}
              title="ดาวน์โหลดหรือบันทึกเป็นไฟล์ PDF"
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-4 h-4 text-teal-200" /> บันทึก PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
