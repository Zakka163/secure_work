export type Shift = 'Pagi' | 'Sore' | 'Malam';

export interface EvidencePair {
  before: string;
  after: string | null;
}

export interface Report {
  id: string;
  employeeName: string;
  time: string;
  location: string;
  status: 'Berhasil' | 'Gagal';
  evidence: EvidencePair[];
  notes: string;
  checklist: string[];
  shift: Shift;
}

export interface Employee {
  id: string;
  name: string;
  reportCount: number;
  lastActive: string;
  phone: string;
}

const names = ['Iqbal Zakka', 'Budi Santoso', 'Siti Aminah', 'Rizky Pratama', 'Ahmad Dani', 'Dewi Kusuma', 'Andi Wijaya', 'Susi Susanti'];
const locations = ['Jl. Sudirman No. 12', 'Gedung Cyber 2', 'Mall Grand Indonesia', 'Jl. Gatot Subroto No. 5', 'Main Warehouse - Zone C', 'Tower A - Lantai 12', 'Site Plant B', 'Kantor Pusat'];
const photos = [
  '/mock/images.jpeg',
  '/mock/images (1).jpeg', 
  '/mock/images (2).jpeg',
  '/mock/download.jpeg',
  '/mock/upvc-cnc-corner-cleaning-machine00404993936.webp'
];

export const mockReports: Report[] = Array.from({ length: 42 }).map((_, i) => {
  const shiftValue = i % 3 === 0 ? 'Pagi' : i % 3 === 1 ? 'Sore' : 'Malam';
  
  let timeStr = '';
  if (shiftValue === 'Pagi') timeStr = `0${8 + (i % 4)}:${10 + (i % 45)}`;
  else if (shiftValue === 'Sore') timeStr = `${16 + (i % 6)}:${15 + (i % 40)}`;
  else timeStr = `0${0 + (i % 6)}:${20 + (i % 30)}`;

  // Generate random 1 to 4 pairs of evidence
  const numPairs = (i % 4) + 1;
  const evidence: EvidencePair[] = [];
  for (let j = 0; j < numPairs; j++) {
    evidence.push({
      before: photos[(i + j) % photos.length],
      // 20% chance of missing 'after' photo for variety
      after: (i + j) % 5 === 0 ? null : photos[(i + j + 1) % photos.length] 
    });
  }

  return {
    id: String(i + 1),
    employeeName: names[i % names.length],
    time: `2026-04-08 ${timeStr}`,
    location: locations[i % locations.length],
    status: (i % 7 === 0) ? 'Gagal' : 'Berhasil',
    evidence,
    notes: `Laporan rutin shift ${shiftValue} berjalan lancar. Tidak ada anomali berat. Foto ke-${numPairs} sedikit blur karena cuaca.`,
    checklist: ['Pengecekan area', 'Laporan visual', 'Konfirmasi PIC'],
    shift: shiftValue,
  };
});

export const mockEmployees: Employee[] = names.map((name, i) => ({
  id: String(i + 1),
  name,
  reportCount: (i * 3) + 5,
  lastActive: `2026-04-08 10:0${i}`,
  phone: `628123456789${i}`, // WhatsApp format requires no '+' typically, e.g. 628...
}));

export const getStats = () => ({
  totalReportsToday: mockReports.length,
  activeEmployees: mockEmployees.length,
});
