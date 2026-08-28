import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import History from '../components/History';
import RoomGrid from '../components/RoomGrid';
import RoomDetailModal from '../components/RoomDetailModal';
import Experiences from '../components/Experiences';
import Services from '../components/Services';
import Location from '../components/Location';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export default function LandingPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#5e265e] selection:text-white">
      {/* HEADER / NAVBAR */}
      <Navbar />

      {/* HERO SECTION WITH SEARCH WIDGET */}
      <Hero />

      {/* HOTEL HISTORY SECTION */}
      <History />

      {/* ROOMS CATALOG SECTION */}
      <RoomGrid onSelectRoom={(room) => setSelectedRoom(room)} />

      {/* EXPERIENCES SECTION */}
      <Experiences />

      {/* SERVICES & ROOFTOP RESTAURANT */}
      <Services />

      {/* LOCATION SECTION */}
      <Location />

      {/* GUEST REVIEWS */}
      {/* <Reviews /> */}

      {/* FOOTER */}
      <Footer />

      {/* FLOATING WHATSAPP BUTTON */}
      <FloatingWhatsApp />

      {/* ROOM DETAIL MODAL */}
      {selectedRoom && (
        <RoomDetailModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
