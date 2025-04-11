
import React from 'react';
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import CollabCreator from "@/components/collab/CollabCreator";

const CreateCollab: React.FC = () => {
  return (
    <AppLayout pageTitle="Create Collaboration">
      <div className="max-w-5xl mx-auto">
        <CollabCreator />
      </div>
    </AppLayout>
  );
};

export default CreateCollab;
