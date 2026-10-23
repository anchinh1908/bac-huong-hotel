import React from 'react';
import { HOTEL_INFO } from '../data/bacHuongData';
import { Sparkles, ArrowDown } from 'lucide-react';

export default function Hero({ onExploreRooms, hotelInfo }) {
  const info = hotelInfo || HOTEL_INFO;

  return (
    <section className="hero-bh">
      <div className="container">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fef3c7', color: '#92400e', padding: '6px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '18px' }}>
          <Sparkles size={16} />
          <span>{info.tagline || 'Chào mừng quý khách đến với TP. Kon Tum'}</span>
        </div>

        <h1 className="hero-title-bh">
          {info.name}
        </h1>

        <p className="hero-desc-bh">
          {info.description}
        </p>

        <button 
          onClick={onExploreRooms}
          style={{
            background: 'linear-gradient(135deg, #78350f, #b45309)',
            color: 'white',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '50px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(120, 53, 15, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Khám phá các hạng phòng</span>
          <ArrowDown size={18} />
        </button>
      </div>
    </section>
  );
}
