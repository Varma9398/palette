
import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Download } from 'lucide-react';
import { ColorPalette, getSavedPalettes, deletePalette, exportPalette } from '@/utils/colorUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import ColorSwatch from './ColorSwatch';

interface SavedPalettesProps {
  onPaletteLoad: (colors: any[], harmony: string) => void;
}

const SavedPalettes: React.FC<SavedPalettesProps> = ({ onPaletteLoad }) => {
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);

  useEffect(() => {
    loadSavedPalettes();
  }, []);

  const loadSavedPalettes = () => {
    const palettes = getSavedPalettes();
    setSavedPalettes(palettes);
  };

  const handleDelete = (paletteId: string) => {
    deletePalette(paletteId);
    loadSavedPalettes();
    toast({
      title: "Deleted!",
      description: "Palette removed from your collection",
    });
  };

  const handleExport = (palette: ColorPalette, format: string = 'css') => {
    const exportedData = exportPalette(palette, format);
    
    const blob = new Blob([exportedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.name.replace(/\s+/g, '-').toLowerCase()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: `Palette exported as ${format.toUpperCase()}`,
    });
  };

  const handleLoad = (palette: ColorPalette) => {
    onPaletteLoad(palette.colors, palette.harmony);
    toast({
      title: "Loaded!",
      description: `${palette.name} loaded into editor`,
    });
  };

  if (savedPalettes.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No saved palettes yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create and save your first palette to see it here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Saved Palettes ({savedPalettes.length})
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {savedPalettes.map((palette) => (
            <div
              key={palette.id}
              className="p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-all duration-200 cursor-pointer"
              onClick={() => handleLoad(palette)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">{palette.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {palette.harmony} • {new Date(palette.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(palette);
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(palette.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                {palette.colors.slice(0, 6).map((color, index) => (
                  <ColorSwatch
                    key={index}
                    color={color}
                    size="small"
                  />
                ))}
                {palette.colors.length > 6 && (
                  <div className="w-12 h-12 rounded-lg border-2 border-border/20 flex items-center justify-center text-xs text-muted-foreground">
                    +{palette.colors.length - 6}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedPalettes;
