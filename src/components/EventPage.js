import React, { useState } from 'react';
import siteConfig from '../siteConfig';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';

// Steps: 1=email lookup, 2=guest selection, 3=event selection, 4=accommodation, 5=details+submit

function EventPage() {
  const [step, setStep] = useState(1);

  // Step 1 — email lookup
  const [emailInput, setEmailInput] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // Step 2 — guest selection
  const [allowedNames, setAllowedNames] = useState([]); // from backend
  const [selectedNames, setSelectedNames] = useState({}); // { "John Doe": true, "Jane Doe": false }

  // Step 3 — event selection
  const [openEvent, setOpenEvent] = useState(null);
  const [rsvp, setRsvp] = useState({});
  const [perform, setPerform] = useState(false);

  // Step 4 — accommodation
  const [needAccommodation, setNeedAccommodation] = useState('');

  // Step 5 — submit
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const events = siteConfig.events.events;

  // ── Calendar helpers ──────────────────────────────────────────────────────
  const formatDateForCalendar = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-');
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return new Date(year, month - 1, day, hours, minutes || 0);
  };

  const formatICSDate = (date) =>
    date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const getGoogleCalendarUrl = (event) => {
    const startDate = formatDateForCalendar(event.date, event.time);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.name,
      dates: `${formatICSDate(startDate)}/${formatICSDate(endDate)}`,
      details: `${event.description || ''}\n\nVenue: ${event.venue}\nDress Code: ${event.dressCode || 'Not specified'}`,
      location: event.venue,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const getOutlookCalendarUrl = (event) => {
    const startDate = formatDateForCalendar(event.date, event.time);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const params = new URLSearchParams({
      subject: event.name,
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString(),
      body: `${event.description || ''}\n\nVenue: ${event.venue}\nDress Code: ${event.dressCode || 'Not specified'}`,
      location: event.venue,
    });
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  };

  const downloadICSFile = (event) => {
    const startDate = formatDateForCalendar(event.date, event.time);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const icsContent = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Website//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${event.name}`,
      `DESCRIPTION:${event.description || ''}\\n\\nVenue: ${event.venue}\\nDress Code: ${event.dressCode || 'Not specified'}`,
      `LOCATION:${event.venue}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.name.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Step handlers ─────────────────────────────────────────────────────────

  // Step 1: look up email
  const handleEmailLookup = async (e) => {
    e.preventDefault();
    setLookupError('');
    setLookupLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/rsvp/lookup?email=${encodeURIComponent(emailInput.trim())}`
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        setLookupError(data.message || 'Email not found on the guest list.');
        return;
      }
      // Initialise all names as selected (attending) by default
      const initial = {};
      data.names.forEach((n) => { initial[n] = true; });
      setAllowedNames(data.names);
      setSelectedNames(initial);
      setStep(2);
    } catch (err) {
      setLookupError('Could not reach the server. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  // Step 2: toggle a guest name checkbox
  const toggleName = (name) => {
    setSelectedNames((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const attendingNames = allowedNames.filter((n) => selectedNames[n]);
  const declinedNames  = allowedNames.filter((n) => !selectedNames[n]);

  // Step 3: event accordion
  const toggleEvent = (eventId) => setOpenEvent(openEvent === eventId ? null : eventId);
  const handleRsvpChange = (eventId) => setRsvp({ ...rsvp, [eventId]: !rsvp[eventId] });
  const handlePerformClick = () => {
    setPerform(!perform);
    alert(!perform
      ? "Fantastic! Can't wait to see your moves on the big night!"
      : "Changed your mind? No worries, you're still part of the fun!"
    );
  };

  // Step 5: final submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const countryCode = e.target.countryCode.value.trim();
    const contact = e.target.contact.value.trim();

    if (!countryCode || !contact) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/rsvp/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          attending: attendingNames,
          declined: declinedNames,
          events: Object.entries(rsvp)
            .filter(([, v]) => v)
            .map(([id]) => events.find((ev) => ev.id === Number(id))?.name)
            .filter(Boolean),
          accommodation: needAccommodation || 'Not Specified',
          performance: perform,
          countryCode,
          contact,
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setFormSubmitted(true);
      } else {
        alert(`Something went wrong: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Could not reach the server. Please try again.\nError: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="section-container">

        {/* Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h1 className="text-4xl sm:text-title font-semibold text-apple-gray-900">
              {siteConfig.events.title}
            </h1>
            <button
              onClick={() => window.print()}
              className="no-print px-3 py-2 text-apple-gray-600 hover:text-apple-gray-900 transition-colors"
              aria-label="Print page"
              title="Print events"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
          </div>
          <p className="text-lg text-apple-gray-600 max-w-2xl mx-auto">
            {siteConfig.events.subtitle}
          </p>
        </div>

        {/* ── Success ── */}
        {formSubmitted ? (
          <Card className="p-8 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-semibold text-apple-gray-900 mb-2">
              Thank you for your RSVP!
            </h2>
            <p className="text-apple-gray-600 mb-2">
              {attendingNames.length > 0 && (
                <>We can't wait to celebrate with <strong>{attendingNames.join(', ')}</strong>!</>
              )}
            </p>
            <p className="text-apple-gray-600">We look forward to celebrating with you.</p>
          </Card>

        /* ── Step 1: Email lookup ── */
        ) : step === 1 ? (
          <Card className="max-w-md mx-auto p-8">
            <h3 className="text-2xl font-semibold text-apple-gray-900 mb-2 text-center">
              Let's find your invitation
            </h3>
            <p className="text-sm text-apple-gray-600 mb-6 text-center">
              Enter the email address your invitation was sent to.
            </p>
            <form onSubmit={handleEmailLookup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={emailInput}
                  onChange={(e) => { setEmailInput(e.target.value); setLookupError(''); }}
                  placeholder="you@example.com"
                  required
                />
                {lookupError && (
                  <p className="mt-2 text-sm text-red-600">{lookupError}</p>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={lookupLoading}
                className="w-full"
              >
                {lookupLoading ? 'Looking up…' : 'Find My Invitation'}
              </Button>
            </form>
          </Card>

        /* ── Step 2: Guest selection ── */
        ) : step === 2 ? (
          <Card className="max-w-md mx-auto p-8">
            <h3 className="text-2xl font-semibold text-apple-gray-900 mb-2 text-center">
              Who's coming?
            </h3>
            <p className="text-sm text-apple-gray-600 mb-6 text-center">
              Check the names of everyone in your party who will be attending.
            </p>
            <div className="space-y-3 mb-8">
              {allowedNames.map((name) => (
                <label
                  key={name}
                  className="flex items-center gap-3 p-4 rounded-xl border border-apple-gray-200 cursor-pointer hover:bg-apple-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!selectedNames[name]}
                    onChange={() => toggleName(name)}
                    className="w-5 h-5 accent-apple-gray-900 rounded"
                  />
                  <span className="text-apple-gray-900 font-medium">{name}</span>
                </label>
              ))}
            </div>
            {attendingNames.length === 0 && (
              <p className="text-sm text-amber-600 mb-4 text-center">
                Please select at least one guest attending.
              </p>
            )}
            <Button
              variant="primary"
              size="lg"
              disabled={attendingNames.length === 0}
              onClick={() => setStep(3)}
              className="w-full"
            >
              Next
            </Button>
          </Card>

        /* ── Step 3: Event selection ── */
        ) : step === 3 ? (
          <>
            <div className="max-w-4xl mx-auto grid gap-6 lg:grid-cols-2">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className={`p-6 cursor-pointer ${openEvent === event.id ? 'lg:col-span-2' : ''}`}
                  onClick={() => toggleEvent(event.id)}
                >
                  <h2 className="text-xl font-semibold text-apple-gray-900 mb-2">{event.name}</h2>
                  {openEvent === event.id && (
                    <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-2">
                        <p className="text-apple-gray-700"><strong>Date:</strong> {event.date}</p>
                        <p className="text-apple-gray-700"><strong>Time:</strong> {event.time}</p>
                        <p className="text-apple-gray-700"><strong>Venue:</strong> {event.venue}</p>
                        {event.dressCode && (
                          <p className="text-apple-gray-700"><strong>Dress Code:</strong> {event.dressCode}</p>
                        )}
                        {event.description && (
                          <p className="text-apple-gray-600 mt-2">{event.description}</p>
                        )}
                      </div>
                      {event.mapEmbed && (
                        <div className="mt-4 rounded-xl overflow-hidden">
                          <iframe
                            src={event.mapEmbed}
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title={`${event.name} Location`}
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant={rsvp[event.id] ? 'primary' : 'secondary'}
                          onClick={() => handleRsvpChange(event.id)}
                          size="sm"
                        >
                          {rsvp[event.id] ? '✓ Attending' : 'I will attend'}
                        </Button>
                        {event.id === 2 && (
                          <Button
                            variant={perform ? 'primary' : 'secondary'}
                            onClick={handlePerformClick}
                            size="sm"
                          >
                            {perform ? '🎤 Stage is mine!' : 'I want to take the stage!'}
                          </Button>
                        )}
                      </div>

                      {/* Add to Calendar */}
                      <div className="mt-4 pt-4 border-t border-apple-gray-200">
                        <p className="text-sm font-medium text-apple-gray-700 mb-2">Add to Calendar:</p>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={getGoogleCalendarUrl(event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                          </a>
                          <a
                            href={getOutlookCalendarUrl(event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v3.75h9v-3.75zM7.5 18v-5.25h9V18h-9z"/>
                            </svg>
                            Outlook
                          </a>
                          <button
                            onClick={() => downloadICSFile(event)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-apple-gray-700 text-white rounded-full hover:bg-apple-gray-800 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Apple/iCal
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button variant="primary" size="lg" onClick={() => setStep(4)}>
                Next
              </Button>
            </div>
          </>

        /* ── Step 4: Accommodation ── */
        ) : step === 4 ? (
          <Card className="max-w-lg mx-auto p-8">
            <h3 className="text-2xl font-semibold text-apple-gray-900 mb-6 text-center">
              When can we expect to welcome you?
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                Select your arrival time:
              </label>
              <select
                onChange={(e) => setNeedAccommodation(e.target.value)}
                className="input-apple"
              >
                <option value="" disabled>Please choose an option</option>
                {siteConfig.events.accommodationOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="text-center mb-6">
              <Button
                variant={needAccommodation === 'NoStay' ? 'primary' : 'secondary'}
                onClick={() => setNeedAccommodation('NoStay')}
                size="sm"
              >
                No, I won't be staying
              </Button>
            </div>
            <div className="text-center">
              <Button variant="primary" size="lg" onClick={() => setStep(5)} className="w-full">
                Next
              </Button>
            </div>
          </Card>

        /* ── Step 5: Contact details + submit ── */
        ) : (
          <Card className="max-w-lg mx-auto p-8">
            <form onSubmit={handleFormSubmit}>
              <h3 className="text-2xl font-semibold text-apple-gray-900 mb-6 text-center">
                Your Details
              </h3>
              <p className="text-sm text-apple-gray-600 mb-6 text-center italic">
                Rest assured, your details are safe with us! No marketing gimmicks here—just ensuring we stay connected.
              </p>

              {/* Attending summary */}
              <div className="mb-6 p-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200">
                <p className="text-sm font-medium text-apple-gray-700 mb-1">Attending:</p>
                {attendingNames.length > 0
                  ? <p className="text-apple-gray-900">{attendingNames.join(', ')}</p>
                  : <p className="text-apple-gray-500 italic">None selected</p>
                }
                {declinedNames.length > 0 && (
                  <>
                    <p className="text-sm font-medium text-apple-gray-700 mt-2 mb-1">Not attending:</p>
                    <p className="text-apple-gray-500">{declinedNames.join(', ')}</p>
                  </>
                )}
              </div>

              {/* Contact Number */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-apple-gray-700 mb-2">
                  Contact Number
                </label>
                <div className="flex gap-2">
                  <select
                    name="countryCode"
                    className="px-4 py-3 rounded-xl border border-apple-gray-200 focus:ring-2 focus:ring-apple-blue-500"
                    required
                  >
                    <option value="+1">+1 (USA)</option>
                    <option value="+91">+91 (India)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (Australia)</option>
                  </select>
                  <Input
                    type="tel"
                    name="contact"
                    placeholder="Your Phone Number"
                    className="flex-1"
                    required
                  />
                </div>
              </div>

              {loading && (
                <div className="text-center mb-4">
                  <p className="text-apple-blue-600">Submitting your response…</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                Submit RSVP
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}

export default EventPage;
