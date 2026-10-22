import React from 'react';
import { HOTEL_INFO } from '../data/bacHuongData';
import { Building, MapPin, Phone, Mail, Navigation } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-bh">
      <div className="container">
        <div className="footer-inner-bh">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div className="brand-icon-bh" style={{ width: '38px', height: '38px' }}>
                <Building size={20} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>{HOTEL_INFO.name}</span>
            </div>
            <p style={{ color: '#a8a29e', fontSize: '0.92rem', lineHeight: '1.7', maxWidth: '450px' }}>
              {HOTEL_INFO.description}
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1rem' }}>Thông Tin Liên Hệ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#d6d3d1' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <MapPin size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
                <span>{HOTEL_INFO.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Phone size={16} color="#f59e0b" />
                <span>Hotline: {HOTEL_INFO.hotline}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Mail size={16} color="#f59e0b" />
                <span>{HOTEL_INFO.email}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1rem' }}>Chỉ Đường & Vị Trí</h4>
            <p style={{ color: '#a8a29e', fontSize: '0.88rem', marginBottom: '14px' }}>
              Khách sạn tọa lạc tại trung tâm TP. Kon Tum, rất gần Nhà Thờ Gỗ, Tòa Giám Mục và Cầu treo Kon Klor.
            </p>
            <a 
              href={HOTEL_INFO.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="google-map-btn"
            >
              <Navigation size={14} />
              <span>Xem trên Google Maps</span>
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #292524', paddingTop: '20px', textAlign: 'center', fontSize: '0.82rem', color: '#78716c' }}>
          © 2026 Khách Sạn Bắc Hương Kon Tum. Bản quyền thuộc về Khách Sạn Bắc Hương.
        </div>
      </div>
    </footer>
  );
}
