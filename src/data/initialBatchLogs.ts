import { WeeklyBatchLog } from '../types';

export const INITIAL_BATCH_LOGS: WeeklyBatchLog[] = [
  {
    id: 'batch-2026-w31',
    weekLabel: 'สัปดาห์ที่ 31 (3-9 ส.ค. 2026)',
    timestamp: '2026-08-03T02:00:00Z',
    totalGenerated: 25,
    categoriesCovered: 5,
    status: 'completed',
    note: 'สร้างบทความอัตโนมัติจากวารสารการแพทย์ล่าสุด (Journal of Autism, AACAP, Brain Stimulation, Movement Disorders) รวม 25 บทความ (หมวดละ 5 บทความ) รอ Admin ตรวจอนุมัติ'
  },
  {
    id: 'batch-2026-w30',
    weekLabel: 'สัปดาห์ที่ 30 (27 ก.ย. - 2 ส.ค. 2026)',
    timestamp: '2026-07-27T02:00:00Z',
    totalGenerated: 25,
    categoriesCovered: 5,
    status: 'completed',
    note: 'สร้างบทความอัตโนมัติประจำสัปดาห์ ตรวจและอนุมัติเผยแพร่แล้วเรียบร้อยโดย ดร.ปัน'
  },
  {
    id: 'batch-2026-w29',
    weekLabel: 'สัปดาห์ที่ 29 (20-26 ก.ค. 2026)',
    timestamp: '2026-07-20T02:00:00Z',
    totalGenerated: 25,
    categoriesCovered: 5,
    status: 'completed',
    note: 'สร้างบทความอัตโนมัติประจำสัปดาห์ ตรวจและอนุมัติเผยแพร่แล้วเรียบร้อย'
  }
];
