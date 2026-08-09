import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'asd',
    nameTh: 'โรคออทิสติก (ASD)',
    nameEn: 'Autism Spectrum Disorder',
    shortDesc: 'การพัฒนาทักษะสังคม สื่อสาร และการจัดระเบียบพฤติกรรมในเด็กออทิสติก',
    color: 'emerald',
    iconName: 'Brain'
  },
  {
    id: 'adhd',
    nameTh: 'สมาธิสั้น (ADHD)',
    nameEn: 'Attention Deficit Hyperactivity Disorder',
    shortDesc: 'เทคนิคการเพิ่มความตั้งใจ จัดการความหุนหันพลันแล่น และการกำกับตนเอง',
    color: 'teal',
    iconName: 'Zap'
  },
  {
    id: 'ld',
    nameTh: 'การเรียนรู้บกพร่อง (LD)',
    nameEn: 'Learning Disabilities',
    shortDesc: 'การช่วยเหลือเด็กที่มีความยากลำบากด้านอ่าน เขียน และคำนวณอย่างตรงจุด',
    color: 'sky',
    iconName: 'BookOpen'
  },
  {
    id: 'tics',
    nameTh: 'โรคติ๊ก (TICS)',
    nameEn: 'Tic Disorders & Tourette',
    shortDesc: 'การเข้าใจอาการกระตุกของกล้ามเนื้อ/เปล่งเสียง และพฤติกรรมบำบัด CBIT',
    color: 'indigo',
    iconName: 'Activity'
  },
  {
    id: 'tms',
    nameTh: 'กระตุ้นแม่เหล็กไฟฟ้าสมอง (TMS)',
    nameEn: 'Transcranial Magnetic Stimulation',
    shortDesc: 'นวัตกรรมการรักษาด้วยคลื่นแม่เหล็กแม่นยำสูงสำหรับปรับสมดุลวงจรประสาท',
    color: 'purple',
    iconName: 'Cpu'
  }
];
