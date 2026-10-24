const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Default Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@kampus.ac.id' },
    update: {},
    create: {
      name: 'Administrator PMB',
      email: 'admin@kampus.ac.id',
      passwordHash: adminPassword,
      role: 'SUPERADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Seed Faculties
  const ft = await prisma.faculty.upsert({
    where: { code: 'FTI' },
    update: {},
    create: {
      code: 'FTI',
      name: 'Fakultas Teknologi Informasi',
      description: 'Menghasilkan lulusan kompeten di bidang rekayasa teknologi dan komputasi cerdas.',
    },
  });

  const feb = await prisma.faculty.upsert({
    where: { code: 'FEB' },
    update: {},
    create: {
      code: 'FEB',
      name: 'Fakultas Ekonomi & Bisnis',
      description: 'Membentuk pemimpin bisnis modern, technopreneur, dan analis finansial terkemuka.',
    },
  });

  const fdk = await prisma.faculty.upsert({
    where: { code: 'FDK' },
    update: {},
    create: {
      code: 'FDK',
      name: 'Fakultas Desain & Komunikasi Kreatif',
      description: 'Mengembangkan inovasi visual, multimedia digital, dan strategi komunikasi global.',
    },
  });

  // 3. Seed Study Programs
  const prodis = [
    {
      facultyId: ft.id,
      name: 'Teknik Informatika',
      degree: 'S1',
      code: 'TI-S1',
      accreditation: 'Unggul',
      capacity: 120,
      registrationFee: 250000,
      description: 'Fokus pada Software Engineering, Artificial Intelligence, dan Cloud Computing.',
    },
    {
      facultyId: ft.id,
      name: 'Sistem Informasi',
      degree: 'S1',
      code: 'SI-S1',
      accreditation: 'Unggul',
      capacity: 100,
      registrationFee: 250000,
      description: 'Menghubungkan proses bisnis modern dengan strategi arsitektur sistem enterprise.',
    },
    {
      facultyId: feb.id,
      name: 'Manajemen Bisnis Digital',
      degree: 'S1',
      code: 'MBD-S1',
      accreditation: 'Baik Sekali',
      capacity: 80,
      registrationFee: 250000,
      description: 'Mempersiapkan entrepreneur dan pengelola bisnis di era ekonomi internet & AI.',
    },
    {
      facultyId: feb.id,
      name: 'Akuntansi & Keuangan',
      degree: 'S1',
      code: 'AKT-S1',
      accreditation: 'Baik Sekali',
      capacity: 80,
      registrationFee: 250000,
      description: 'Keahlian audit, analisis data keuangan, dan fintech banking.',
    },
    {
      facultyId: fdk.id,
      name: 'Desain Komunikasi Visual (DKV)',
      degree: 'S1',
      code: 'DKV-S1',
      accreditation: 'Unggul',
      capacity: 90,
      registrationFee: 250000,
      description: 'Animasi, UI/UX design, branding korporat, dan media interaktif digital.',
    },
  ];

  for (const p of prodis) {
    await prisma.studyProgram.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }
  console.log('✅ Study programs created');

  // 4. Seed Announcements
  await prisma.announcement.upsert({
    where: { slug: 'jadwal-pmb-gelombang-1' },
    update: {},
    create: {
      title: 'Pendaftaran Mahasiswa Baru Gelombang 1 Telah Dibuka!',
      slug: 'jadwal-pmb-gelombang-1',
      category: 'INFO_PMB',
      content: 'Pendaftaran Mahasiswa Baru Tahun Akademik 2025/2026 Gelombang 1 resmi dibuka. Dapatkan potongan biaya kuliah awal sebesar 20% bagi pendaftar 100 pertama.',
      isPublished: true,
      authorId: admin.id,
    },
  });

  await prisma.announcement.upsert({
    where: { slug: 'jalur-beasiswa-prestasi' },
    update: {},
    create: {
      title: 'Jalur Beasiswa Prestasi Akademik & Non-Akademik',
      slug: 'jalur-beasiswa-prestasi',
      category: 'BEASISWA',
      content: 'Tersedia kuota beasiswa penuh 100% dan parsial 50% untuk calon mahasiswa berprestasi tingkat provinsi atau nasional.',
      isPublished: true,
      authorId: admin.id,
    },
  });
  console.log('✅ Announcements seeded');

  // 5. Seed Settings
  const settings = [
    { key: 'CAMPUS_NAME', value: 'Universitas Nusantara Teknologi (UNT)', description: 'Nama Resmi Kampus' },
    { key: 'CAMPUS_TAGLINE', value: 'Unggul, Berkarakter, Berdaya Saing Global', description: 'Slogan Kampus' },
    { key: 'CAMPUS_PHONE', value: '+62 21 8899 7700', description: 'Nomor Telepon Hotline PMB' },
    { key: 'CAMPUS_EMAIL', value: 'pmb@kampus.ac.id', description: 'Email Resmi PMB' },
    { key: 'REGISTRATION_FEE', value: '250000', description: 'Biaya Pendaftaran Default (IDR)' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('✅ Default settings seeded');

  console.log('🎉 Seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
