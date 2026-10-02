import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import siteConfig from './siteConfig';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';

// Lazy load components for better performance
const OurStory = lazy(() => import('./components/OurStory'));
const EventPage = lazy(() => import('./components/EventPage'));
const PhotoGallery = lazy(() => import('./components/PhotoGallery'));
const UploadPhotos = lazy(() => import('./components/UploadPhotos'));
const Blessings = lazy(() => import('./components/Blessings'));
const WeddingParty = lazy(() => import('./components/WeddingParty'));
const Registry = lazy(() => import('./components/Registry'));
const Travel = lazy(() => import('./components/Travel'));
const FAQ = lazy(() => import('./components/FAQ'));
const Timeline = lazy(() => import('./components/Timeline'));

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-apple-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-gray-900 mx-auto mb-4"></div>
      <p className="text-apple-gray-600">Loading...</p>
    </div>
  </div>
);

// Route configuration
const routeMap = {
  ourStory: { path: '/our-story', Component: OurStory },
  events: { path: '/events', Component: EventPage },
  photoGallery: { path: '/gallery', Component: PhotoGallery },
  uploadPhotos: { path: '/upload-photos', Component: UploadPhotos },
  blessings: { path: '/blessings', Component: Blessings },
  weddingParty: { path: '/wedding-party', Component: WeddingParty },
  registry: { path: '/registry', Component: Registry },
  travel: { path: '/travel', Component: Travel },
  faq: { path: '/faq', Component: FAQ },
  timeline: { path: '/timeline', Component: Timeline },
};

const PASSWORD = process.env.REACT_APP_PASSWORD || 'k+g2027';

function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem('wedding_auth') === 'true'
  );
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem('wedding_auth', 'true');
      setUnlocked(true);
    } else {
      setError(true);
      setInput('');
    }
  };

  if (unlocked) return children;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <h1
          className="mb-2 text-gray-800"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '2.5rem',
            fontWeight: 400,
            fontStyle: 'italic',
          }}
        >
          Kevin &amp; Gabriela
        </h1>
        <p
          className="mb-8 text-gray-400 tracking-widest uppercase text-xs"
          style={{ letterSpacing: '0.25em' }}
        >
          2027
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Enter password"
            autoFocus
            className="w-64 px-4 py-3 border border-gray-200 text-center text-sm tracking-widest focus:outline-none focus:border-gray-400 transition-colors"
            style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
          />
          {error && (
            <p className="text-red-400 text-xs tracking-widest uppercase" style={{ letterSpacing: '0.15em' }}>
              Incorrect password
            </p>
          )}
          <button
            type="submit"
            className="px-10 py-3 border border-gray-800 text-gray-800 text-xs tracking-widest uppercase hover:bg-gray-800 hover:text-white transition-all duration-300"
            style={{ fontFamily: "'EB Garamond', Georgia, serif", letterSpacing: '0.2em' }}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  // Generate routes based on enabled features
  const getRoutes = () => {
    const routes = [];

    Object.entries(siteConfig.features).forEach(([key, feature]) => {
      if (feature.enabled && routeMap[key]) {
        const { path, Component } = routeMap[key];
        routes.push(
          <Route
            key={key}
            path={path}
            element={
              <Suspense fallback={<Loading />}>
                <Component />
              </Suspense>
            }
          />
        );
      }
    });

    return routes;
  };

  return (
    <Router>
      <PasswordGate>
        <div className="App flex flex-col min-h-screen bg-apple-gray-50">
          <ScrollToTop />
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {getRoutes()}
            </Routes>
          </div>
          <Footer />
        </div>
      </PasswordGate>
    </Router>
  );
}

export default App;
