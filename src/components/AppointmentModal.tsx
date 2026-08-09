import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Phone, CheckCircle2, Mail, Send, Activity } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  asd: 'โรคออทิสติก (ASD) / พัฒนาการช้า',
  adhd: 'สมาธิสั้น (ADHD) / วอกแวก / ซน',
  ld: 'บกพร่องการเรียนรู้ (LD) / อ่านเขียนคำนวณ',
  tics: 'โรคติ๊ก (TICS) / กล้ามเนื้อกระตุก / ส่งเสียง',
  tms: 'ประเมินรับการรักษากระตุ้นสมอง TMS',
  other: 'บำบัดฟื้นฟูประสาทอื่นๆ',
};

export const AppointmentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [parentName, setParentName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [concernCategory, setConcernCategory] = useState('asd');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');

  if (!isOpen) return null;

  const targetEmail = 'doctorpanrehab@gmail.com';

  const triggerEmailSend = (pName: string, cAge: string, ph: string, cat: string, nt: string) => {
    const selectedCategoryLabel = CATEGORY_LABELS[cat] || cat;
    const subject = `[นัดปรึกษาประเมินอาการ] คุณ ${pName} - ${selectedCategoryLabel}`;
    const body = `เรียน ทีมงานด็อกเตอร์ปันรีแฮบสหคลินิก (Doctor PAN Rehab Clinic)\n\n` +
      `มีความประสงค์ขอนัดหมายปรึกษาประเมินอาการ โดยมีรายละเอียดดังนี้:\n` +
      `- ชื่อผู้ปกครอง / ผู้ป่วย: ${pName}\n` +
      `- อายุเด็ก / ผู้ป่วย: ${cAge || 'ไม่ระบุ'}\n` +
      `- เบอร์โทรติดต่อ: ${ph}\n` +
      `- ประเด็นที่ต้องการปรึกษา: ${selectedCategoryLabel}\n` +
      (nt ? `- หมายเหตุเพิ่มเติม: ${nt}\n` : '') +
      `- วันเวลาที่ส่งเรื่อง: ${new Date().toLocaleString('th-TH')}\n\n` +
      `อีเมลปลายทางสำหรับรับข้อมูลนัดหมาย: ${targetEmail}\n` +
      `ขอบคุณครับ/ค่ะ`;

    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setLastMailtoUrl(mailtoUrl);

    // Save to local storage log
    try {
      const existing = JSON.parse(localStorage.getItem('doctorpan_appointments') || '[]');
      existing.unshift({
        id: Date.now().toString(),
        parentName: pName,
        childAge: cAge,
        phone: ph,
        concernCategory: selectedCategoryLabel,
        note: nt,
        createdAt: new Date().toISOString(),
        recipientEmail: targetEmail,
      });
      localStorage.setItem('doctorpan_appointments', JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save appointment to storage:', err);
    }

    // Try to open user email app
    window.open(mailtoUrl, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerEmailSend(parentName, childAge, phone, concernCategory, note);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-teal-950 flex items-center justify-center font-black shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">นัดปรึกษา ดร.ปัน (Doctor PAN Rehab)</h3>
              <p className="text-xs text-emerald-200">คลินิกฟื้นฟูพัฒนาการเด็ก และระบบประสาท</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-teal-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-slate-900">บันทึกส่งอีเมลนัดหมายเรียบร้อยแล้ว!</h4>
                <p className="text-xs text-emerald-700 font-bold mt-1">
                  ระบบได้บันทึกข้อมูลและนำส่งไปยัง <span className="underline">{targetEmail}</span>
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs text-slate-700 space-y-1.5">
                <div className="flex justify-between border-b border-slate-200 pb-1.5 font-semibold text-slate-900">
                  <span>ผู้ขอรับบริการ:</span>
                  <span>{parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">เบอร์โทรศัพท์:</span>
                  <span className="font-bold text-teal-800">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">อายุเด็ก/ผู้ป่วย:</span>
                  <span>{childAge || 'ไม่ระบุ'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">หัวข้อปรึกษา:</span>
                  <span className="font-medium text-slate-800">{CATEGORY_LABELS[concernCategory]}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-500">อีเมลปลายทาง:</span>
                  <span className="font-mono text-teal-700 font-bold">{targetEmail}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                ทีมงาน ด็อกเตอร์ปันรีแฮบสหคลินิก จะตรวจสอบอีเมลและติดต่อกลับทางเบอร์โทร <span className="font-bold text-slate-900">{phone}</span> เพื่อยืนยันวันเวลานัดหมายโดยเร็วที่สุด
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2 justify-center pt-2">
                {lastMailtoUrl && (
                  <a
                    href={lastMailtoUrl}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-teal-600" /> เปิดโปรแกรมอีเมลอีกครั้ง
                  </a>
                )}
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  เสร็จสิ้น
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อผู้ปกครอง / ผู้ป่วย *</label>
                <input
                  type="text"
                  required
                  placeholder="ชื่อ-นามสกุล"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">อายุเด็ก / ผู้ป่วย</label>
                  <input
                    type="text"
                    placeholder="เช่น 4 ขวบ 6 เดือน"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">เบอร์โทรติดต่อ *</label>
                  <input
                    type="tel"
                    required
                    placeholder="063-224-6680"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ประเด็นที่ต้องการปรึกษา *</label>
                <select
                  value={concernCategory}
                  onChange={(e) => setConcernCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="asd">โรคออทิสติก (ASD) / พัฒนาการช้า</option>
                  <option value="adhd">สมาธิสั้น (ADHD) / วอกแวก / ซน</option>
                  <option value="ld">บกพร่องการเรียนรู้ (LD) / อ่านเขียนคำนวณ</option>
                  <option value="tics">โรคติ๊ก (TICS) / กล้ามเนื้อกระตุก / ส่งเสียง</option>
                  <option value="tms">ประเมินรับการรักษากระตุ้นสมอง TMS</option>
                  <option value="other">บำบัดฟื้นฟูประสาทอื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">รายละเอียดหรือข้อความเพิ่มเติม (ถ้ามี)</label>
                <textarea
                  rows={2}
                  placeholder="รายละเอียดพฤติกรรม อาการ หรือช่วงเวลาที่สะดวกรับสาย..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                />
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 text-xs text-slate-700 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-teal-900">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> ด็อกเตอร์ปันรีแฮบสหคลินิก พาสิโอ้ทาวน์ รามคำแหง
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-600 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600 shrink-0" /> ทุกวัน 9:00 - 19:00 น.
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600 shrink-0" /> 063-224-6680 , 02-024-1730
                  </span>
                  <span className="flex items-center gap-1 font-mono text-emerald-800 font-semibold">
                    <Mail className="w-3 h-3 text-emerald-600 shrink-0" /> {targetEmail}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-teal-950 font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" /> บันทึกและส่งอีเมลนัดหมาย (doctorpanrehab@gmail.com)
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
