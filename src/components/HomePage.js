import React from 'react';
import { Link } from 'react-router-dom';
import siteConfig from '../siteConfig';
import Countdown from './ui/Countdown';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CollectionsIcon from '@mui/icons-material/Collections';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import NightlifeIcon from '@mui/icons-material/Nightlife';

function HeartOverlay() {
  const heartPath = `
    M 690,645
    C 545,530 385,435 385,315
    C 385,228 452,178 530,178
    C 581,178 632,203 665,245
    C 672,253 680,264 688,276
    C 692,270 697,263 703,255
    C 736,210 789,178 850,178
    C 928,178 995,228 995,315
    C 995,435 835,530 690,645 Z
  `;

  return (
    <svg
      viewBox="0 0 1380 820"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ pointerEvents: 'none' }}
    >
      {/* Heart outline */}
      <path
        d={heartPath}
        fill="rgba(255,255,255,0.07)"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />

    </svg>
  );
}

function HomePage() {
  const getQuickNavCards = () => {
    const routes = {
      ourStory:     { path: '/our-story',      icon: <AutoStoriesIcon fontSize="large" /> },
      events:       { path: '/events',          icon: <EventAvailableIcon fontSize="large" /> },
      photoGallery: { path: '/gallery',         icon: <CollectionsIcon fontSize="large" /> },
      uploadPhotos: { path: '/upload-photos',   icon: <FileUploadIcon fontSize="large" /> },
      blessings:    { path: '/blessings',       icon: <VolunteerActivismIcon fontSize="large" /> },
      weddingParty: { path: '/wedding-party',   icon: <NightlifeIcon fontSize="large" /> },
      registry:     { path: '/registry',        icon: '🎁' },
      travel:       { path: '/travel',          icon: '✈️' },
      faq:          { path: '/faq',             icon: '❓' },
      timeline:     { path: '/timeline',        icon: '⏱️' },
    };
    return Object.entries(siteConfig.features)
      .filter(([key, f]) => f.enabled && key !== 'homepage' && routes[key])
      .map(([key, f]) => ({ ...routes[key], label: f.label, key }))
      .slice(0, 6);
  };

  const quickNavCards = getQuickNavCards();

  // Format wedding date nicely e.g. "22 February 2025"
  const weddingDateFormatted = siteConfig.wedding?.date
    ? new Date(siteConfig.wedding.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <div
        id="hero"
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${siteConfig.homepage.backgroundImage})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Heart + sparkles SVG layer */}
        <HeartOverlay />

        {/* Text content — sits inside the heart */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4">
          {/* "WE'RE GETTING MARRIED" */}
          <p
            className="mb-3 tracking-widest text-white/90"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
            }}
          >
            We&rsquo;re Getting Married
          </p>

          {/* "Save Our Date" — large cursive */}
          <h1
            className="text-white leading-none mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '0.02em',
            }}
          >
            Save Our Date
          </h1>

          {/* Wedding date */}
          {weddingDateFormatted && (
            <p
              className="text-white/90 mb-10"
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              {weddingDateFormatted}
            </p>
          )}

          {/* CTA */}
          <Link to="/events">
            <button
              className="px-10 py-3 border border-white text-white text-sm tracking-widest uppercase hover:bg-white hover:text-gray-900 transition-all duration-300"
              style={{ fontFamily: "'EB Garamond', Georgia, serif", letterSpacing: '0.2em' }}
            >
              RSVP
            </button>
          </Link>
        </div>

        {/* Countdown pinned to bottom centre */}
        {siteConfig.homepage.showCountdown && siteConfig.wedding?.date && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full flex justify-center px-4">
            <Countdown targetDate={siteConfig.wedding.date} />
          </div>
        )}

        {/* Scroll arrow — scrolls to content below hero */}
        <button
          onClick={() => document.getElementById('below-hero')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer bg-transparent border-0 p-0"
          aria-label="Scroll down"
        >
          <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

      {/* ── Quick Nav Cards ── */}
      {quickNavCards.length > 0 && (
        <section id="below-hero" className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="text-center mb-14">
            <p
              className="text-gray-400 tracking-widest uppercase text-xs mb-3"
              style={{ letterSpacing: '0.25em' }}
            >
              Join Us
            </p>
            <h2
              className="text-gray-800"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 400,
                fontStyle: 'italic',
              }}
            >
              Explore Our Wedding
            </h2>
            <div className="mx-auto mt-4 w-12 border-t border-gray-300" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickNavCards.map((card) => (
              <Link key={card.key} to={card.path}>
                <div className="group text-center p-8 border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-md">
                  <div className="mb-4 text-gray-600">{card.icon}</div>
                  <h3
                    className="text-gray-800 mb-2"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: '1.4rem',
                      fontWeight: 500,
                    }}
                  >
                    {card.label}
                  </h3>
                  <p className="text-gray-400 text-sm tracking-wide">Explore →</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
