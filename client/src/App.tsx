import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import type { BookingPrefill, Doctor, PageRoute, Speciality, Testimonial } from './types.ts';
import { SplashScreen } from './components/SplashScreen.tsx';
import { ScrollProgressBar } from './components/ScrollProgressBar.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { BackToTopButton } from './components/BackToTopButton.tsx';
import { MobileEmergencyBar } from './components/MobileEmergencyBar.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { SpecialitiesPage } from './pages/SpecialitiesPage.tsx';
import { DoctorsPage } from './pages/DoctorsPage.tsx';
import { AppointmentPage } from './pages/AppointmentPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';

function parseRouteFromPath(pathname: string): PageRoute {
  if (pathname.startsWith('/specialities')) return 'specialities';
  if (pathname.startsWith('/doctors')) return 'doctors';
  if (pathname.startsWith('/book')) return 'book';
  if (pathname.startsWith('/about')) return 'about';
  return 'home';
}

function routeToPath(route: PageRoute): string {
  switch (route) {
    case 'specialities':
      return '/specialities';
    case 'doctors':
      return '/doctors';
    case 'book':
      return '/book';
    case 'about':
      return '/about';
    default:
      return '/';
  }
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [route, setRoute] = useState<PageRoute>(() =>
    parseRouteFromPath(window.location.pathname)
  );
  const [bookingPrefill, setBookingPrefill] = useState<BookingPrefill>({});

  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();

  const loadHospitalData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [specRes, docRes, testRes] = await Promise.all([
        fetch('/api/specialities'),
        fetch('/api/doctors'),
        fetch('/api/testimonials'),
      ]);

      if (!specRes.ok || !docRes.ok || !testRes.ok) {
        throw new Error('Unable to load hospital directory.');
      }

      const [specJson, docJson, testJson] = await Promise.all([
        specRes.json(),
        docRes.json(),
        testRes.json(),
      ]);

      setSpecialities(specJson.specialities ?? []);
      setDoctors(docJson.doctors ?? []);
      setTestimonials(testJson.testimonials ?? []);
    } catch {
      setLoadError('Unable to reach the hospital service. Please refresh to try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHospitalData();
  }, [loadHospitalData]);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRouteFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((nextRoute: PageRoute, prefill?: BookingPrefill) => {
    if (prefill) {
      setBookingPrefill(prefill);
    } else if (nextRoute !== 'book') {
      setBookingPrefill({});
    }
    setRoute(nextRoute);
    const targetPath = routeToPath(nextRoute);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBookSpeciality = useCallback(
    (specialityId: string) => {
      navigate('book', { specialityId });
    },
    [navigate]
  );

  const handleBookDoctor = useCallback(
    (doctor: Doctor) => {
      navigate('book', {
        specialityId: doctor.specialityId,
        doctorId: doctor.id,
      });
    },
    [navigate]
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[var(--color-base)] text-[var(--color-ink)]">
        <ScrollProgressBar />

        <AnimatePresence>
          {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        </AnimatePresence>

        <Header currentRoute={route} onNavigate={(next) => navigate(next)} />

        <main className="flex-1">
          {loadError ? (
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-20 text-center">
              <h1 className="font-serif text-3xl text-[#0F3D3E]">
                Temporary Connection Interruption
              </h1>
              <p className="mt-3 text-sm text-[#4A5859]">{loadError}</p>
              <button
                type="button"
                onClick={() => void loadHospitalData()}
                className="mt-6 rounded-xl bg-[#0F3D3E] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#0A2C2D] transition-colors cursor-pointer min-h-[44px]"
              >
                Retry Loading Directory
              </button>
            </div>
          ) : isLoading ? (
            <div
              className="max-w-7xl mx-auto px-4 sm:px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-8"
              aria-busy="true"
              aria-label="Loading hospital information"
            >
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 rounded-2xl bg-white border border-[rgba(15,61,62,0.08)] p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#EFECE6]" />
                  <div className="mt-6 h-6 w-2/3 rounded bg-[#EFECE6]" />
                  <div className="mt-3 h-4 w-full rounded bg-[#EFECE6]" />
                  <div className="mt-2 h-4 w-4/5 rounded bg-[#EFECE6]" />
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={route}
                initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {route === 'home' && (
                  <HomePage
                    specialities={specialities}
                    doctors={doctors}
                    testimonials={testimonials}
                    onNavigate={(next) => navigate(next)}
                    onBookSpeciality={handleBookSpeciality}
                    onBookDoctor={handleBookDoctor}
                  />
                )}
                {route === 'specialities' && (
                  <SpecialitiesPage
                    specialities={specialities}
                    onBookSpeciality={handleBookSpeciality}
                  />
                )}
                {route === 'doctors' && (
                  <DoctorsPage
                    doctors={doctors}
                    specialities={specialities}
                    onBookDoctor={handleBookDoctor}
                  />
                )}
                {route === 'book' && (
                  <AppointmentPage
                    specialities={specialities}
                    doctors={doctors}
                    prefill={bookingPrefill}
                    onNavigate={(next) => navigate(next)}
                  />
                )}
                {route === 'about' && <AboutPage onNavigate={(next) => navigate(next)} />}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        <Footer onNavigate={(next) => navigate(next)} />
        <BackToTopButton />
        <MobileEmergencyBar onNavigate={(next) => navigate(next)} />
      </div>
    </MotionConfig>
  );
}
