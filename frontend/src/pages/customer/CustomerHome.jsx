import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatRecordId } from '../../utils/recordIds.js';
import { ArrowRight, Bus, Mail, MapPin, Phone, ShieldCheck, Ticket } from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';
import '../../styles/CustomerHome.css';
import '../../styles/CustomerFooter.css';
import { api } from '../../api/client.js';

const features = [
  { icon: MapPin, title: 'Popular routes', subtitle: 'Travel between cities across Sri Lanka' },
  { icon: ShieldCheck, title: 'Book with confidence', subtitle: 'A clear and simple booking journey' },
  { icon: Bus, title: 'Compare bus options', subtitle: 'Review times, seats, and fares' },
  { icon: Ticket, title: 'Your trips in one place', subtitle: 'Return to your booking details anytime' },
];

const highlights = [
  {
    icon: MapPin,
    title: 'Choose your route',
    text: 'Choose your departure and destination from currently scheduled services.',
  },
  {
    icon: Bus,
    title: 'Compare buses',
    text: 'Review the available services, departure times, seat availability, and ticket prices for your trip.',
  },
  {
    icon: Ticket,
    title: 'Keep your booking together',
    text: 'Select seats, complete your booking, and return to My Bookings when you need your trip details.',
  },
];

const CustomerHome = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    let active = true;
    api.get('/api/content/announcements')
      .then((items) => {
        if (!active) return;
        setAnnouncements(Array.isArray(items) ? items : []);
      })
      .catch(() => { if (active) setAnnouncements([]); });
    return () => { active = false; };
  }, []);

  return (
  <div className="customer-home">
    <CustomerNavbar />

    <main>
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-hero-eyebrow"><Bus size={16} aria-hidden="true" /> BUS TRAVEL, MADE SIMPLE</span>
          <h1>Travel Smarter<br /><span>with SmartMove</span></h1>
          <p>Find a bus, compare your options, and plan your next journey across Sri Lanka.</p>
          <Link className="home-hero-button" to="/search">
            Search buses <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {announcements.length > 0 && (
        <section style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 20px' }} aria-label="Travel announcements">
          {announcements.map((announcement) => (
            <article key={announcement.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderLeft: `4px solid ${String(announcement.severity).toUpperCase() === 'WARNING' ? '#f59e0b' : '#0284c7'}`, borderRadius: '10px', padding: '16px 20px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{announcement.title}</h2>
                <span style={{ fontSize: '11px', color: '#475569' }}>{announcement.severity} · {announcement.active ? 'Active' : 'Inactive'}</span>
              </div>
              <p style={{ color: '#475569', fontSize: '13px', margin: '8px 0' }}>{announcement.message}</p>
              <p style={{ color: '#64748b', fontSize: '11px', margin: 0 }}>
                Audience: {(announcement.audience || []).join(', ') || 'All'}
                {announcement.routeOracleIds?.length ? ` · Route IDs: ${announcement.routeOracleIds.map((id) => formatRecordId('route', id)).join(', ')}` : ''}
                {announcement.publishedAt ? ` · Published: ${new Date(announcement.publishedAt).toLocaleDateString()}` : ''}
                {announcement.startsAt ? ` · Starts: ${new Date(announcement.startsAt).toLocaleDateString()}` : ''}
                {announcement.endsAt ? ` · Ends: ${new Date(announcement.endsAt).toLocaleDateString()}` : ''}
              </p>
              {(announcement.details?.source || announcement.details?.language) && (
                <p style={{ color: '#64748b', fontSize: '11px', margin: '6px 0 0' }}>
                  {announcement.details?.source ? `Source: ${announcement.details.source}` : ''}
                  {announcement.details?.source && announcement.details?.language ? ' · ' : ''}
                  {announcement.details?.language ? `Language: ${announcement.details.language}` : ''}
                </p>
              )}
            </article>
          ))}
        </section>
      )}

      <section className="home-features" aria-label="SmartMove benefits">
        {features.map(({ icon: Icon, title, subtitle }) => (
          <article className="home-feature-card" key={title}>
            <span className="home-feature-icon"><Icon size={21} aria-hidden="true" /></span>
            <span className="home-feature-copy">
              <strong>{title}</strong>
              <span>{subtitle}</span>
            </span>
          </article>
        ))}
      </section>

      <section className="home-about" aria-labelledby="home-about-heading">
        <div className="home-about-intro">
          <span className="home-section-eyebrow">ABOUT SMARTMOVE</span>
          <h2 id="home-about-heading">Travel planning, all in one place</h2>
          <p>
            SmartMove helps passengers find a bus for their journey, compare available services, choose seats, and manage booking details. Start with your route and travel date, then follow the booking steps through to your ticket.
          </p>
        </div>

        <div className="home-highlights">
          {highlights.map(({ icon: Icon, title, text }) => (
            <article className="home-highlight-card" key={title}>
              <span className="home-highlight-icon"><Icon size={21} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
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
          <a href="mailto:smartmove@gmail.com">
            <Mail size={16} aria-hidden="true" />
            <span>smartmove@gmail.com</span>
          </a>
          <a href="tel:0771234567">
            <Phone size={16} aria-hidden="true" />
            <span>0771234567</span>
          </a>
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

export default CustomerHome;
