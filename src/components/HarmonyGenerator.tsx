
import React, { useState } from 'react';
import { Palette, Shuffle } from 'lucide-react';
import { ColorInfo, generateColorHarmony } from '@/utils/colorUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ColorSwatch from './ColorSwatch';

interface HarmonyGeneratorProps {
  baseColor: ColorInfo | null;
  onHarmonyGenerated: (colors: ColorInfo[], harmony: string) => void;
}

const HarmonyGenerator: React.FC<HarmonyGeneratorProps> = ({ 
  baseColor, 
  onHarmonyGenerated 
}) => {
  const [selectedHarmony, setSelectedHarmony] = useState('complementary');

  const harmonyTypes = [
    { value: 'complementary', label: 'Complementary', description: '2 colors opposite on color wheel' },
    { value: 'triadic', label: 'Triadic', description: '3 colors evenly spaced' },
    { value: 'analogous', label: 'Analogous', description: '5 colors next to each other' },
    { value: 'monochromatic', label: 'Monochromatic', description: '5 shades of same hue' },
    { value: 'tetradic', label: 'Tetradic', description: '4 colors forming rectangle' }
  ];

  const generateHarmony = () => {
    if (!baseColor) return;

    const harmonizedColors = generateColorHarmony(baseColor, selectedHarmony);
    onHarmonyGenerated(harmonizedColors, selectedHarmony);
  };

  const generateRandomHarmony = () => {
    const randomHarmony = harmonyTypes[Math.floor(Math.random() * harmonyTypes.length)];
    setSelectedHarmony(randomHarmony.value);
    
    if (baseColor) {
      const harmonizedColors = generateColorHarmony(baseColor, randomHarmony.value);
      onHarmonyGenerated(harmonizedColors, randomHarmony.value);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Color Harmony Generator
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {baseColor && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Base Color</h4>
            <div className="flex items-center gap-3">
              <ColorSwatch color={baseColor} size="medium" />
              <div>
                <p className="font-mono text-sm">{baseColor.hex}</p>
                <p className="text-xs text-muted-foreground">
                  HSL({baseColor.hsl.h}°, {baseColor.hsl.s}%, {baseColor.hsl.l}%)
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Harmony Type
            </label>
            <Select value={selectedHarmony} onValueChange={setSelectedHarmony}>
              <SelectTrigger>
                <SelectValue placeholder="Select harmony type" />
              </SelectTrigger>
              <SelectContent>
                {harmonyTypes.map((harmony) => (
                  <SelectItem key={harmony.value} value={harmony.value}>
                    <div>
                      <div className="font-medium">{harmony.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {harmony.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={generateHarmony}
              disabled={!baseColor}
              className="btn-primary flex-1"
            >
              <Palette className="w-4 h-4 mr-2" />
              Generate Harmony
            </Button>

            <Button
              onClick={generateRandomHarmony}
              disabled={!baseColor}
              variant="outline"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!baseColor && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Upload an image or select a color to generate harmonies
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HarmonyGenerator;
