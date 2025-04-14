
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface CustomizeExperienceStepProps {
  onNext: () => void;
}

const CustomizeExperienceStep = ({ onNext }: CustomizeExperienceStepProps) => {
  const [settings, setSettings] = useState({
    showEmotional: true,
    showAnonymous: true,
    limitIntense: false,
    soundEnabled: true,
    email: "",
  });

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6">
      <h2 className="text-3xl font-bold mb-2">Customize Your Experience</h2>
      <p className="text-gray-600 mb-8 text-center">
        Set up your preferences for a more personalized experience
      </p>

      <div className="w-full max-w-md space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <Label htmlFor="emotional">Show emotional content</Label>
          <Switch
            id="emotional"
            checked={settings.showEmotional}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, showEmotional: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="anonymous">Show anonymous posts</Label>
          <Switch
            id="anonymous"
            checked={settings.showAnonymous}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, showAnonymous: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="intense">Limit intense topics</Label>
          <Switch
            id="intense"
            checked={settings.limitIntense}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, limitIntense: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sound">Sound/Music on by default</Label>
          <Switch
            id="sound"
            checked={settings.soundEnabled}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, soundEnabled: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email for updates (optional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={settings.email}
            onChange={(e) =>
              setSettings({ ...settings, email: e.target.value })
            }
          />
        </div>
      </div>

      <Button onClick={onNext} className="unmute-primary-button">
        Complete Setup
      </Button>
    </div>
  );
};

export default CustomizeExperienceStep;
