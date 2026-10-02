import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import siteConfig from '../siteConfig';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const getNavLinks = () => {
    const routes = {
      ourStory: '/our-story',
      events: '/events',
      photoGallery: '/gallery',
      uploadPhotos: '/upload-photos',
      blessings: '/blessings',
      weddingParty: '/wedding-party',
      registry: '/registry',
      travel: '/travel',
      faq: '/faq',
      timeline: '/timeline',
    };
    return Object.entries(siteConfig.features)
      .filter(([key, f]) => f.enabled && key !== 'homepage' && routes[key])
      .map(([key, f]) => ({ path: routes[key], label: f.label, key }));
  };

  const navLinks = getNavLinks();
  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white shadow-sm'
          : isHome
            ? 'bg-transparent border-b border-white/30'
            : 'bg-black/45 border-b border-white/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">

          {/* Couple name — cursive script */}
          <Link
            to="/"
            className={`transition-colors mr-5 duration-300  ${
              scrolled ? 'text-gray-800' : 'text-white'
            }`}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.25rem',
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {siteConfig.couple.name1}
            {' '}
            <span style={{ fontStyle: 'normal', fontSize: '1rem' }}>♥</span>
            {' '}
            {siteConfig.couple.name2}
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center space-x-8 pr-6">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                className={`text-sm tracking-widest uppercase transition-all duration-200 pb-0.5 ${
                  isActive(link.path)
                    ? scrolled
                      ? 'text-gray-900 border-b border-gray-900'
                      : 'text-white border-b border-white'
                    : scrolled
                    ? 'text-gray-500 hover:text-gray-900'
                    : 'text-white/80 hover:text-white'
                }`}
                style={{ fontFamily: "'EB Garamond', Georgia, serif", letterSpacing: '0.12em' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMenu}
            className={`lg:hidden p-2 transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className={`lg:hidden pb-6 space-y-1 border-t ${scrolled ? 'border-gray-100' : 'border-white/20'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.path}
                onClick={toggleMenu}
                className={`block py-3 px-2 text-sm tracking-widest uppercase transition-colors ${
                  isActive(link.path)
                    ? scrolled ? 'text-gray-900 font-medium' : 'text-white font-medium'
                    : scrolled ? 'text-gray-500 hover:text-gray-900' : 'text-white/80 hover:text-white'
                }`}
                style={{ fontFamily: "'EB Garamond', Georgia, serif", letterSpacing: '0.12em' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
