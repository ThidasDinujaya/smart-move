import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  ArrowRight,
  Bus,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Search,
  Ticket,
} from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { api } from '../../api/client.js';
import '../../styles/SearchBuses.css';
import '../../styles/CustomerFooter.css';

const bookingSteps = [
  { icon: MapPin, title: 'Choose your route', text: 'Select your departure city, destination, and travel date.' },
  { icon: Bus, title: 'Compare services', text: 'Review bus types, departure times, available seats, and fares.' },
  { icon: Ticket, title: 'Book your seat', text: 'Choose your seats and keep your trip details together.' },
];

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const SearchBuses = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ from: '', to: '', date: '' });
  const [error, setError] = useState('');
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    let active = true;
    api.get('/api/routes')
      .then((items) => { if (active) setRoutes(Array.isArray(items) ? items : []); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, []);

  const locations = useMemo(() => [...new Set(routes
    .filter((route) => String(route.status || '').toLowerCase() !== 'inactive')
    .flatMap((route) => [route.startLocation, route.endLocation])
    .filter(Boolean))].sort((left, right) => left.localeCompare(right)), [routes]);

  const updateSearch = (key, value) => {
    setSearchParams((current) => ({ ...current, [key]: value }));
    setError('');
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (searchParams.from === searchParams.to) {
      setError('Choose two different cities for your journey.');
      return;
    }

    navigate('/search-results', { state: searchParams });
  };

  const swapLocations = () => {
    setSearchParams((current) => ({ ...current, from: current.to, to: current.from }));
    setError('');
  };

  return (
    <div className="search-buses-page">
      <CustomerNavbar />

      <main>
        <section className="search-hero">
          <div className="search-hero-inner">
            <div className="search-hero-copy">
              <span className="search-eyebrow"><Bus size={15} aria-hidden="true" /> SMARTMOVE JOURNEY PLANNER</span>
              <h1>Find the right vehicle<br /><span>for your next journey</span></h1>
              <p>Explore available travel options between cities across Sri Lanka and plan your trip with confidence.</p>
            </div>
          </div>
        </section>

        <div className="search-content">
          <form className="search-form-card" onSubmit={handleSearch}>
            <div className="search-form-heading">
              <div>
                <span className="search-section-kicker">PLAN YOUR TRIP</span>
                <h2>Where would you like to go?</h2>
                <p>Enter your route and travel date to find available services.</p>
              </div>
            </div>

            <div className="search-fields-grid">
              <div className="search-field-group">
                <label htmlFor="search-from">From</label>
                <div className="search-field-control">
                  <MapPin size={17} aria-hidden="true" />
                  <select id="search-from" value={searchParams.from} onChange={(event) => updateSearch('from', event.target.value)} required>
                    <option value="">Select departure city</option>
                    {locations.map((city) => <option key={`from-${city}`} value={city}>{city}</option>)}
                  </select>
                </div>
              </div>

              <button className="search-swap-button" type="button" onClick={swapLocations} aria-label="Swap departure and destination">
                <ArrowLeftRight size={17} aria-hidden="true" />
              </button>

              <div className="search-field-group">
                <label htmlFor="search-to">To</label>
                <div className="search-field-control">
                  <MapPin size={17} aria-hidden="true" />
                  <select id="search-to" value={searchParams.to} onChange={(event) => updateSearch('to', event.target.value)} required>
                    <option value="">Select destination</option>
                    {locations.map((city) => <option key={`to-${city}`} value={city}>{city}</option>)}
                  </select>
                </div>
              </div>

              <div className="search-field-group search-date-field">
                <label htmlFor="search-date">Travel date</label>
                <div className="search-field-control">
                  <CalendarDays size={17} aria-hidden="true" />
                  <input id="search-date" type="date" value={searchParams.date} min={getLocalDate()} onChange={(event) => updateSearch('date', event.target.value)} required />
                </div>
              </div>

              <button className="search-submit-button" type="submit">
                <Search size={17} aria-hidden="true" /> Search vehicles <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
            {error && <p className="search-form-error" role="alert">{error}</p>}
          </form>

          <section className="search-steps" aria-labelledby="search-steps-heading">
            <div className="search-section-heading">
              <div>
                <span className="search-section-kicker">FROM SEARCH TO SEAT</span>
                <h2 id="search-steps-heading">Your journey, made simple</h2>
              </div>
            </div>
            <div className="search-steps-grid">
              {bookingSteps.map(({ icon: Icon, title, text }, index) => (
                <article className="search-step-card" key={title}>
                  <span className="search-step-number">0{index + 1}</span>
                  <span className="search-step-icon"><Icon size={19} aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="customer-footer">
        <div className="customer-footer-main">
          <div className="customer-footer-brand">
            <span className="customer-footer-logo"><Bus size={22} aria-hidden="true" /></span>
            <div>
              <strong>SmartMove</strong>
              <p>Simple, reliable bus travel across Sri Lanka.</p>
            </div>
          </div>

          <div className="customer-footer-contact">
            <h2>Contact</h2>
            <a href="mailto:smartmove@gmail.com"><Mail size={16} aria-hidden="true" /><span>smartmove@gmail.com</span></a>
            <a href="tel:0771234567"><Phone size={16} aria-hidden="true" /><span>0771234567</span></a>
          </div>
        </div>
        <div className="customer-footer-bottom">
          <span>© {new Date().getFullYear()} SmartMove</span>
          <span>Travel safely. Travel SmartMove.</span>
        </div>
      </footer>
    </div>
  );
};

export default SearchBuses;
