import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Upload, Download, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageUpload from '@/components/ImageUpload';
import PaletteDisplay from '@/components/PaletteDisplay';
import HarmonyGenerator from '@/components/HarmonyGenerator';
import SavedPalettes from '@/components/SavedPalettes';
import AllPalettesDisplay from '@/components/AllPalettesDisplay';
import { ColorInfo, ColorPalette, extractColorsFromImage, extractAllColorPalettes } from '@/utils/colorUtils';

const Index = () => {
  const [extractedColors, setExtractedColors] = useState<ColorInfo[]>([]);
  const [allPalettes, setAllPalettes] = useState<{
    dominant: ColorInfo[];
    vibrant: ColorInfo[];
    muted: ColorInfo[];
    light: ColorInfo[];
    dark: ColorInfo[];
  }>({
    dominant: [],
    vibrant: [],
    muted: [],
    light: [],
    dark: []
  });
  const [currentPalette, setCurrentPalette] = useState<ColorInfo[]>([]);
  const [currentHarmony, setCurrentHarmony] = useState<string>('extracted');
  const [hasImage, setHasImage] = useState(false);
  const [refreshSavedPalettes, setRefreshSavedPalettes] = useState(0);

  // Ref to trigger refresh of saved palettes
  const savedPalettesRef = useRef<{ refreshPalettes: () => void }>(null);

  const handleImageUpload = (imageData: ImageData) => {
    console.log('Image uploaded, extracting colors...'); // Debug log
    const colors = extractColorsFromImage(imageData);
    const palettes = extractAllColorPalettes(imageData);
    
    setExtractedColors(colors);
    setAllPalettes(palettes);
    setCurrentPalette(palettes.dominant);
    setCurrentHarmony('dominant');
    setHasImage(true);
    
    console.log('Colors extracted:', colors.length); // Debug log
    console.log('Palettes extracted:', palettes); // Debug log
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setExtractedColors([]);
      setAllPalettes({
        dominant: [],
        vibrant: [],
        muted: [],
        light: [],
        dark: []
      });
      setCurrentPalette([]);
      setHasImage(false);
    }
  };

  const handleHarmonyGenerated = (colors: ColorInfo[], harmony: string) => {
    console.log('Harmony generated:', harmony, colors.length); // Debug log
    setCurrentPalette(colors);
    setCurrentHarmony(harmony);
  };

  const handlePaletteLoad = (colors: ColorInfo[], harmony: string) => {
    console.log('Palette loaded:', harmony, colors.length); // Debug log
    setCurrentPalette(colors);
    setCurrentHarmony(harmony);
  };

  const handlePaletteSelect = (colors: ColorInfo[], type: string) => {
    console.log('Palette selected:', type, colors.length); // Debug log
    setCurrentPalette(colors);
    setCurrentHarmony(type);
  };

  const handlePaletteSave = (palette: ColorPalette) => {
    console.log('Palette saved successfully:', palette.name); // Debug log
    // Trigger refresh of saved palettes component
    setRefreshSavedPalettes(prev => prev + 1);
  };

  return (
    <div className="min-h-screen gradient-bg p-4">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center glass-card">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ColorCraft Pro
              </h1>
              <p className="text-muted-foreground">Professional Color Palette Generator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top row - Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageUpload onImageUpload={handleImageUpload} onImageChange={handleImageChange} />
          <HarmonyGenerator 
            baseColor={extractedColors[0] || null} 
            onHarmonyGenerated={handleHarmonyGenerated}
          />
        </div>

        {/* All Palettes Display - Shows when image is uploaded */}
        {hasImage && (
          <AllPalettesDisplay 
            palettes={allPalettes} 
            onPaletteSelect={handlePaletteSelect}
          />
        )}

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Palette Display */}
          <PaletteDisplay 
            colors={currentPalette}
            harmony={currentHarmony}
            onSave={handlePaletteSave}
          />

          {/* Saved Palettes */}
          <SavedPalettes 
            key={refreshSavedPalettes} // This will force re-render when a palette is saved
            onPaletteLoad={handlePaletteLoad} 
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/20">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 ColorCraft Pro. Built with React, TypeScript & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
