
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Palette, Sparkles, Volume2, Sun, Moon } from 'lucide-react';
import { ColorInfo } from '@/utils/colorUtils';
import ColorSwatch from './ColorSwatch';

interface AllPalettesDisplayProps {
  palettes: {
    dominant: ColorInfo[];
    vibrant: ColorInfo[];
    muted: ColorInfo[];
    light: ColorInfo[];
    dark: ColorInfo[];
  };
  onPaletteSelect: (colors: ColorInfo[], type: string) => void;
}

const AllPalettesDisplay: React.FC<AllPalettesDisplayProps> = ({ palettes, onPaletteSelect }) => {
  const [selectedTab, setSelectedTab] = useState('dominant');

  const paletteTypes = [
    { key: 'dominant', label: 'Dominant', icon: Palette, description: 'Most frequent colors' },
    { key: 'vibrant', label: 'Vibrant', icon: Sparkles, description: 'High saturation colors' },
    { key: 'muted', label: 'Muted', icon: Volume2, description: 'Low saturation colors' },
    { key: 'light', label: 'Light', icon: Sun, description: 'Bright tones' },
    { key: 'dark', label: 'Dark', icon: Moon, description: 'Deep tones' }
  ];

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          All Color Palettes
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Explore all color palettes extracted from your image
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 glass-card">
            {paletteTypes.map((type) => {
              const Icon = type.icon;
              return (
                <TabsTrigger 
                  key={type.key} 
                  value={type.key}
                  className="flex flex-col items-center gap-1 p-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{type.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {paletteTypes.map((type) => (
            <TabsContent key={type.key} value={type.key} className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{type.label} Colors</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                <Button
                  onClick={() => onPaletteSelect(palettes[type.key as keyof typeof palettes], type.key)}
                  variant="outline"
                  size="sm"
                >
                  Use Palette
                </Button>
              </div>

              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {palettes[type.key as keyof typeof palettes].map((color, index) => (
                  <ColorSwatch
                    key={`${type.key}-${index}`}
                    color={color}
                    size="medium"
                    showDetails={false}
                  />
                ))}
              </div>

              {palettes[type.key as keyof typeof palettes].length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No {type.label.toLowerCase()} colors found in this image</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AllPalettesDisplay;
