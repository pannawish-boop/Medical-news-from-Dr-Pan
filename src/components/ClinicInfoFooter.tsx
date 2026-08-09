import React from 'react';
import { Activity, MapPin, Phone, Mail, Clock, ShieldCheck, Award, Globe } from 'lucide-react';

interface Props {
  onOpenAppointmentModal: () => void;
}

const LineIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`w-4 h-4 fill-current shrink-0 ${className}`} viewBox="0 0 24 24">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.627-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`w-4 h-4 fill-current shrink-0 ${className}`} viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const ClinicInfoFooter: React.FC<Props> = ({ onOpenAppointmentModal }) => {
  return (
    <footer id="clinic-footer" className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Clinic Overview */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">ด็อกเตอร์ปันรีแฮบสหคลินิก</h3>
                <p className="text-[11px] text-teal-400">Doctor PAN Rehab Clinic</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              สหคลินิกเฉพาะทางบำบัดฟื้นฟูพัฒนาการเด็ก พฤติกรรม และระบบประสาท มุ่งเน้นการตรวจประเมินและรักษาระดับมาตรฐานสากล
            </p>
            <div className="pt-1">
              <span className="bg-slate-800 text-emerald-400 border border-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> แพทย์และนักบำบัดรับรองมาตรฐาน
              </span>
            </div>
          </div>

          {/* Col 2: Specialized Medical Services */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400">
              บริการตรวจบำบัดเฉพาะทาง
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="hover:text-white transition-colors">• บำบัดออทิสติก (ASD) & ฝึกการสื่อสาร DIR/Floortime</li>
              <li className="hover:text-white transition-colors">• ฟื้นฟูสมาธิสั้น (ADHD) & ปรับพฤติกรรม Executive Function</li>
              <li className="hover:text-white transition-colors">• ช่วยเหลือเด็กบกพร่องการเรียนรู้ (LD อ่าน เขียน คำนวณ)</li>
              <li className="hover:text-white transition-colors">• บำบัดอาการกระตุกและโรคติ๊ก (TICS & Tourette - CBIT)</li>
              <li className="hover:text-white transition-colors">• นวัตกรรมคลื่นแม่เหล็กกระตุ้นสมอง (TMS Neuro-Rehab)</li>
            </ul>
          </div>

          {/* Col 3: Doctor Profile */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400">
              ทีมแพทย์ผู้เชี่ยวชาญ
            </h4>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 space-y-1">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="font-bold text-white text-xs">ดร.ปัน (นพ.ปัณณวิชญ์)</p>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                แพทย์เวชศาสตร์ฟื้นฟูและแพทย์เวชศาสตร์ครอบครัว ผู้มีประสบการณ์ด้านพัฒนาการและพฤติกรรมเด็ก
              </p>
            </div>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400">
              ติดต่อและสถานที่
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">ด็อกเตอร์ปันรีแฮบสหคลินิก พาสิโอ้ทาวน์ รามคำแหง กรุงเทพมหานคร</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>063-224-6680 , 02-024-1730</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ทุกวัน 9:00 - 19:00 น.</span>
              </li>
              <li className="flex items-center gap-2">
                <LineIcon className="text-emerald-400" />
                <a
                  href="https://line.me/R/ti/p/@doctorpanrehab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  @doctorpanrehab
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://www.doctorpanrehab.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors break-all"
                >
                  https://www.doctorpanrehab.com/
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FacebookIcon className="text-emerald-400 mt-0.5" />
                <a
                  href="https://www.facebook.com/Doctorpanrehabclinic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors break-all"
                >
                  https://www.facebook.com/Doctorpanrehabclinic/
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="mailto:doctorpanrehab@gmail.com"
                  className="hover:text-emerald-300 transition-colors"
                >
                  doctorpanrehab@gmail.com
                </a>
              </li>
            </ul>

            <button
              onClick={onOpenAppointmentModal}
              className="w-full mt-3 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Mail className="w-4 h-4" /> นัดปรึกษาประเมินอาการ
            </button>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-3 text-center md:text-left">
          <p>
            © 2026 ด็อกเตอร์ปันรีแฮบสหคลินิก (Doctor PAN Rehab Clinic). สงวนลิขสิทธิ์ข้อมูลบทความทางการแพทย์
          </p>
          <p className="max-w-md text-[10px] text-slate-500">
            * บทความวิชาการนี้มีวัตถุประสงค์เพื่อการเรียนรู้และเผยแพร่ความรู้แก่ประชาชน ไม่สามารถใช้ทดแทนการตรวจวินิจฉัยทางการแพทย์โดยตรง
          </p>
        </div>
      </div>
    </footer>
  );
};
