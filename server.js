import express from 'express';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDevMode = process.argv.includes('--dev');

// Load .env only if it exists on disk
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// In local AI Studio dev preview (--dev), provide default PORT if unset
if (isDevMode && !process.env.PORT) {
  process.env.PORT = '3000';
}

// Validate required environment variables at startup
const REQUIRED_ENV_VARS = ['PORT'];
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => {
  const value = process.env[key];
  return value === undefined || String(value).trim() === '';
});

if (missingEnvVars.length > 0) {
  throw new Error(
    `Startup failed: missing required environment variable(s): ${missingEnvVars.join(
      ', '
    )}. Create a .env file from .env.example or set them in your hosting environment.`
  );
}

const PORT = Number.parseInt(process.env.PORT, 10);
if (Number.isNaN(PORT) || PORT <= 0) {
  throw new Error(`Startup failed: PORT must be a valid positive integer, received "${process.env.PORT}".`);
}

const HOSPITAL_CONFIG = {
  name: process.env.HOSPITAL_NAME || 'Aurelia Private Hospital',
  contactEmail: process.env.CONTACT_EMAIL || 'concierge@aureliahospital.com',
  emergencyPhone: process.env.EMERGENCY_PHONE || '020 7946 0811',
};

const SPECIALITIES = [
  {
    id: 'cardiology',
    name: 'Cardiology & Vascular Care',
    category: 'Medical & Preventive',
    featured: true,
    iconKey: 'heart-pulse',
    shortDesc:
      'Preventive cardiac diagnostics, non-invasive echocardiography, arrhythmia management, and interventional coronary care led by senior consultants.',
    procedures: [
      'Coronary CT Angiography',
      '3D Echocardiography',
      'Electrophysiology & Pacing',
      'Preventive Lipid & Risk Clinic',
    ],
    waitTime: 'Same-week consultation',
  },
  {
    id: 'neurology',
    name: 'Neurology & Spine Institute',
    category: 'Surgical',
    featured: true,
    iconKey: 'brain',
    shortDesc:
      'Comprehensive evaluation and minimally invasive treatment for complex cranial, spinal, cerebrovascular, and movement disorders.',
    procedures: [
      '3.0T Neuro-Imaging & Mapping',
      'Microsurgical Spine Decompression',
      'Stroke & Vascular Prevention',
      'Migraine & Neuromodulation',
    ],
    waitTime: '48-hour diagnostic review',
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics & Joint Restoration',
    category: 'Surgical',
    featured: true,
    iconKey: 'bone',
    shortDesc:
      'Robotic-assisted joint reconstruction, arthroscopic sports medicine, and bespoke inpatient physiotherapy tailored to rapid mobility recovery.',
    procedures: [
      'Robotic Hip & Knee Arthroplasty',
      'Arthroscopic Ligament Repair',
      'Cartilage Preservation Therapy',
      'Post-Operative Gait Rehabilitation',
    ],
    waitTime: 'Next-day imaging available',
  },
  {
    id: 'internal-medicine',
    name: 'Executive & Internal Medicine',
    category: 'Medical & Preventive',
    featured: false,
    iconKey: 'stethoscope',
    shortDesc:
      'Whole-person diagnostic medicine, complex multi-system care coordination, and unhurried annual preventive health assessments.',
    procedures: [
      'Comprehensive Executive Health Panel',
      'Metabolic & Endocrine Management',
      'Complex Diagnostic Second Opinions',
      'Longevity & Cardiovascular Screening',
    ],
    waitTime: 'Same-day appointments',
  },
  {
    id: 'diagnostics',
    name: 'Diagnostic Imaging & Radiology',
    category: 'Diagnostics',
    featured: false,
    iconKey: 'scan',
    shortDesc:
      'Quiet wide-bore 3.0T MRI, low-dose dual-source CT, and high-resolution ultrasound with consultant radiologist reporting within hours.',
    procedures: [
      'Wide-Bore 3.0T MRI',
      'Low-Dose Thoracic & Cardiac CT',
      'Digital Mammography & Tomosynthesis',
      'Musculoskeletal Ultrasound',
    ],
    waitTime: 'Results within 4 hours',
  },
  {
    id: 'womens-health',
    name: "Women's Health & Gynecology",
    category: 'Medical & Preventive',
    featured: false,
    iconKey: 'shield-plus',
    shortDesc:
      'Discreet, consultant-led gynecological care, minimally invasive pelvic surgery, fertility diagnostics, and perimenopause medicine.',
    procedures: [
      'Minimally Invasive Laparoscopy',
      'Reproductive & Endocrine Care',
      'Comprehensive Well-Woman Screening',
      'Pelvic Floor Rehabilitation',
    ],
    waitTime: 'Within 3 business days',
  },
  {
    id: 'oncology',
    name: 'Precision Oncology',
    category: 'Medical & Preventive',
    featured: false,
    iconKey: 'microscope',
    shortDesc:
      'Multidisciplinary tumour board reviews, genomic profiling, and calm private infusion suites designed around patient comfort and dignity.',
    procedures: [
      'Molecular & Genomic Profiling',
      'Targeted Immunotherapy',
      'Multidisciplinary Tumour Board',
      'Integrative Supportive Care',
    ],
    waitTime: 'Priority 24-hour triage',
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology & Microsurgery',
    category: 'Surgical',
    featured: false,
    iconKey: 'eye',
    shortDesc:
      'High-precision cataract lens surgery, retinal diagnostics, and glaucoma preservation delivered in dedicated microsurgical suites.',
    procedures: [
      'Premium Intraocular Lens Surgery',
      'Optical Coherence Tomography',
      'Retinal Vascular Therapy',
      'Dry Eye & Corneal Care',
    ],
    waitTime: 'Within 5 business days',
  },
];

const DOCTORS = [
  {
    id: 'dr-sarah-jenkins',
    name: 'Dr. Sarah Jenkins',
    title: 'Chair of Cardiovascular Medicine',
    specialityId: 'cardiology',
    specialityName: 'Cardiology & Vascular Care',
    credentials: 'MD, FACC, FRCP',
    fellowship: 'Johns Hopkins Heart & Vascular Institute',
    experienceYears: 19,
    languages: ['English', 'French'],
    consultationDays: 'Mon, Wed, Thu',
    image: '/images/doctor-cardiology.jpg',
    bio: 'Specializes in non-invasive cardiac imaging, women’s cardiovascular health, and preventive coronary care with a focus on unhurried diagnostic clarity.',
  },
  {
    id: 'dr-arthur-vance',
    name: 'Dr. Arthur Vance',
    title: 'Director of Neurosurgery & Spine',
    specialityId: 'neurology',
    specialityName: 'Neurology & Spine Institute',
    credentials: 'MD, PhD, FACS',
    fellowship: 'University Hospital Zurich',
    experienceYears: 22,
    languages: ['English', 'German'],
    consultationDays: 'Tue, Thu, Fri',
    image: '/images/doctor-neurology.jpg',
    bio: 'Leads the hospital’s minimally invasive spine and cranial microsurgery programme, combining high-field intra-operative imaging with conservative surgical judgement.',
  },
  {
    id: 'dr-mei-lin',
    name: 'Dr. Mei Lin',
    title: 'Lead Consultant, Joint Reconstruction',
    specialityId: 'orthopedics',
    specialityName: 'Orthopedics & Joint Restoration',
    credentials: 'MD, FAAOS',
    fellowship: 'Hospital for Special Surgery, New York',
    experienceYears: 15,
    languages: ['English', 'Mandarin'],
    consultationDays: 'Mon, Tue, Thu',
    image: '/images/doctor-orthopedics.jpg',
    bio: 'Focuses on robotic-assisted hip and knee replacement, ligament reconstruction, and accelerated recovery protocols for active adults.',
  },
  {
    id: 'dr-vikram-nair',
    name: 'Dr. Vikram Nair',
    title: 'Senior Consultant, Internal Medicine',
    specialityId: 'internal-medicine',
    specialityName: 'Executive & Internal Medicine',
    credentials: 'MD, FACP, MRCP',
    fellowship: 'Imperial College Healthcare, London',
    experienceYears: 17,
    languages: ['English', 'Hindi'],
    consultationDays: 'Mon – Fri',
    image: '/images/doctor-internal.jpg',
    bio: 'Directs Aurelia’s diagnostic medicine and executive screening service, coordinating multi-disciplinary consultations for complex and preventive care.',
  },
];

const TESTIMONIALS = [
  {
    id: 't1',
    quote:
      'From my first diagnostic angiogram through follow-up six months later, Dr. Jenkins explained every measurement without haste. Nothing felt clinical or rushed—only calm precision.',
    patientName: 'Eleanor Whitfield',
    department: 'Cardiology & Vascular Care',
    outcome: 'Preventive coronary intervention, discharged in 24 hours',
  },
  {
    id: 't2',
    quote:
      'After two years of lumbar nerve pain, Dr. Vance walked me through my 3.0T MRI frame by frame and performed a micro-decompression. I was walking comfortably the same evening.',
    patientName: 'Marcus Lindqvist',
    department: 'Neurology & Spine Institute',
    outcome: 'Minimally invasive spinal recovery, full mobility in 3 weeks',
  },
  {
    id: 't3',
    quote:
      'The quiet architecture, private recovery suite, and daily physiotherapy visits turned an intimidating knee replacement into a remarkably composed experience.',
    patientName: 'Claire Beaumont',
    department: 'Orthopedics & Joint Restoration',
    outcome: 'Robotic knee arthroplasty with same-week gait rehabilitation',
  },
];

// In-memory store for appointment requests
const appointments = [];

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

// API Routes (strictly under /api/*)
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/hospital', (_req, res) => {
  res.json({
    ok: true,
    hospital: HOSPITAL_CONFIG,
  });
});

app.get('/api/specialities', (req, res) => {
  const { category, featured } = req.query;
  let results = SPECIALITIES;
  if (typeof category === 'string' && category !== 'All') {
    results = results.filter((item) => item.category === category);
  }
  if (featured === 'true') {
    results = results.filter((item) => item.featured);
  }
  res.json({ ok: true, specialities: results });
});

app.get('/api/doctors', (req, res) => {
  const { speciality } = req.query;
  let results = DOCTORS;
  if (typeof speciality === 'string' && speciality !== 'all') {
    results = results.filter((doc) => doc.specialityId === speciality);
  }
  res.json({ ok: true, doctors: results });
});

app.get('/api/testimonials', (_req, res) => {
  res.json({ ok: true, testimonials: TESTIMONIALS });
});

app.post('/api/appointments', (req, res) => {
  const {
    patientName,
    phone,
    email = '',
    speciality,
    preferredDoctorId = '',
    preferredDate,
    preferredTime = 'Morning (08:30 – 12:00)',
    notes = '',
  } = req.body ?? {};

  const errors = {};

  if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 2) {
    errors.patientName = 'Please enter the patient’s full name (at least 2 characters).';
  }

  const sanitizedPhone = typeof phone === 'string' ? phone.replace(/[\s\-().+]/g, '') : '';
  if (!sanitizedPhone || !/^\d{7,15}$/.test(sanitizedPhone)) {
    errors.phone = 'Please provide a valid contact telephone number (7 to 15 digits).';
  }

  if (email && typeof email === 'string' && email.trim() !== '') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid email address or leave this field blank.';
    }
  }

  const matchedSpeciality = SPECIALITIES.find((s) => s.id === speciality || s.name === speciality);
  if (!matchedSpeciality) {
    errors.speciality = 'Please select a clinical speciality.';
  }

  if (!preferredDate || typeof preferredDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
    errors.preferredDate = 'Please select a preferred appointment date.';
  } else {
    const selected = new Date(`${preferredDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(selected.getTime()) || selected < today) {
      errors.preferredDate = 'Please choose today or a future date.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      ok: false,
      error: 'Please review the highlighted fields before submitting.',
      fieldErrors: errors,
    });
  }

  const matchedDoctor = DOCTORS.find((d) => d.id === preferredDoctorId);
  const referenceCode = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;

  const appointment = {
    id: crypto.randomUUID(),
    referenceCode,
    patientName: patientName.trim(),
    phone: phone.trim(),
    email: typeof email === 'string' ? email.trim() : '',
    specialityId: matchedSpeciality.id,
    specialityName: matchedSpeciality.name,
    doctorId: matchedDoctor ? matchedDoctor.id : null,
    doctorName: matchedDoctor ? matchedDoctor.name : 'First Available Senior Consultant',
    preferredDate,
    preferredTime,
    notes: typeof notes === 'string' ? notes.trim().slice(0, 500) : '',
    status: 'Confirmed Request',
    createdAt: new Date().toISOString(),
  };

  appointments.push(appointment);

  return res.status(201).json({
    ok: true,
    appointment,
  });
});

app.get('/api/appointments/:referenceCode', (req, res) => {
  const record = appointments.find((a) => a.referenceCode === req.params.referenceCode);
  if (!record) {
    return res.status(404).json({ ok: false, error: 'Appointment reference not found.' });
  }
  return res.json({ ok: true, appointment: record });
});

// Unknown /api/* routes return JSON 404 rather than falling back to index.html
app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, error: 'API endpoint not found.' });
});

async function startServer() {
  if (isDevMode) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: path.join(__dirname, 'client'),
      configFile: path.join(__dirname, 'client', 'vite.config.ts'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const clientDistPath = path.join(__dirname, 'client', 'dist');
    const indexHtmlPath = path.join(clientDistPath, 'index.html');

    if (fs.existsSync(clientDistPath)) {
      app.use(express.static(clientDistPath, { index: false }));
    }

    // Fallback all non-/api GET routes to client/dist/index.html
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      if (!fs.existsSync(indexHtmlPath)) {
        return res
          .status(503)
          .send('Frontend build not found in /client/dist. Run "npm run build" before starting the server.');
      }
      return res.sendFile(indexHtmlPath);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`${HOSPITAL_CONFIG.name} server listening on http://0.0.0.0:${PORT} (${isDevMode ? 'dev' : 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server error:', err);
  process.exit(1);
});
