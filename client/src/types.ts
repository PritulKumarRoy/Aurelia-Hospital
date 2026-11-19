export type PageRoute = 'home' | 'specialities' | 'doctors' | 'book' | 'about';

export type SpecialityCategory = 'Medical & Preventive' | 'Surgical' | 'Diagnostics';

export type SpecialityIconKey =
  | 'heart-pulse'
  | 'brain'
  | 'bone'
  | 'stethoscope'
  | 'scan'
  | 'shield-plus'
  | 'microscope'
  | 'eye';

export interface Speciality {
  id: string;
  name: string;
  category: SpecialityCategory;
  featured: boolean;
  iconKey: SpecialityIconKey;
  shortDesc: string;
  procedures: string[];
  waitTime: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialityId: string;
  specialityName: string;
  credentials: string;
  fellowship: string;
  experienceYears: number;
  languages: string[];
  consultationDays: string;
  image: string;
  bio: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  patientName: string;
  department: string;
  outcome: string;
}

export interface AppointmentRequestPayload {
  patientName: string;
  phone: string;
  email: string;
  speciality: string;
  preferredDoctorId: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

export interface AppointmentConfirmation {
  id: string;
  referenceCode: string;
  patientName: string;
  phone: string;
  email: string;
  specialityId: string;
  specialityName: string;
  doctorId: string | null;
  doctorName: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: string;
  createdAt: string;
}

export interface BookingPrefill {
  specialityId?: string;
  doctorId?: string;
}
