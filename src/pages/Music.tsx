
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import MusicSection from '@/components/music/MusicSection';

const Music = () => {
  return (
    <AppLayout pageTitle="Music">
      <div className="container mx-auto px-4 py-6">
        <MusicSection />
      </div>
    </AppLayout>
  );
};

export default Music;
