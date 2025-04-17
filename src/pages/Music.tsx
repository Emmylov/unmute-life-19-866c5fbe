
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import MusicSection from '@/components/music/MusicSection';

const Music = () => {
  return (
    <AppLayout pageTitle="Music">
      <div className="container mx-auto px-0 sm:px-1 pt-1">
        <MusicSection />
      </div>
    </AppLayout>
  );
};

export default Music;
