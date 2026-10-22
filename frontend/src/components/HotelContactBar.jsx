import React from 'react';
import { MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { HOTEL_INFO } from '../data/bacHuongData';

export default function HotelContactBar() {
  return (
    <div className="hotel-contact-bar">
      <div className="container hotel-contact-inner">
        {/* Địa chỉ */}
        <div className="contact-item">
          <MapPin size={16} color="#b45309" />
          <span>{HOTEL_INFO.address}</span>
        </div>

        {/* Hotline & Email & Nút Chỉ Đường Google Map */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <a href={`tel:${HOTEL_INFO.hotline}`} className="contact-item">
            <Phone size={15} color="#b45309" />
            <span>Hotline: {HOTEL_INFO.hotline}</span>
          </a>

          <a href={`mailto:${HOTEL_INFO.email}`} className="contact-item">
            <Mail size={15} color="#b45309" />
            <span>{HOTEL_INFO.email}</span>
          </a>

          {/* Nút mở Google Maps chỉ đường */}
          <a 
            href={HOTEL_INFO.googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="google-map-btn"
            title="Bấm để mở bản đồ Google Maps chỉ đường"
          >
            <Navigation size={14} />
            <span>Chỉ đường Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
}
