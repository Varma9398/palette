
import React, { useState } from 'react';
import { Download, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import { ColorInfo, ColorPalette, exportPalette, savePalette } from '@/utils/colorUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import ColorSwatch from './ColorSwatch';

interface PaletteDisplayProps {
  colors: ColorInfo[];
  harmony: string;
  onSave?: (palette: ColorPalette) => void;
  onDelete?: (paletteId: string) => void;
  isEditable?: boolean;
  paletteId?: string;
}

const PaletteDisplay: React.FC<PaletteDisplayProps> = ({
  colors,
  harmony,
  onSave,
  onDelete,
  isEditable = true,
  paletteId
}) => {
  const [exportFormat, setExportFormat] = useState('css');
  const [paletteName, setPaletteName] = useState(`${harmony} Palette`);
  const [showDetails, setShowDetails] = useState(false);

  const handleExport = () => {
    if (colors.length === 0) {
      toast({
        title: "No colors to export",
        description: "Please generate or select colors first",
        variant: "destructive"
      });
      return;
    }

    const palette: ColorPalette = {
      id: paletteId || Date.now().toString(),
      name: paletteName || `${harmony} Palette`,
      colors,
      harmony,
      createdAt: new Date().toISOString()
    };

    const exportedData = exportPalette(palette, exportFormat);
    
    // Create and download file
    const blob = new Blob([exportedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paletteName.replace(/\s+/g, '-').toLowerCase()}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: `Palette exported as ${exportFormat.toUpperCase()}`,
    });
  };

  const handleSave = () => {
    console.log('Save button clicked'); // Debug log
    
    if (colors.length === 0) {
      console.log('No colors to save'); // Debug log
      toast({
        title: "No colors to save",
        description: "Please generate or select colors first",
        variant: "destructive"
      });
      return;
    }

    const palette: ColorPalette = {
      id: paletteId || `palette_${Date.now()}`,
      name: paletteName.trim() || `${harmony} Palette`,
      colors: [...colors], // Create a copy of the colors array
      harmony,
      createdAt: new Date().toISOString()
    };

    console.log('Saving palette:', palette); // Debug log

    try {
      savePalette(palette);
      onSave?.(palette);

      toast({
        title: "Saved!",
        description: `"${palette.name}" saved to your collection`,
      });
      
      console.log('Palette saved successfully'); // Debug log
    } catch (error) {
      console.error('Error saving palette:', error); // Debug log
      toast({
        title: "Save failed",
        description: "There was an error saving your palette",
        variant: "destructive"
      });
    }
  };

  const handleDelete = () => {
    if (paletteId) {
      onDelete?.(paletteId);
      toast({
        title: "Deleted!",
        description: "Palette removed from your collection",
      });
    }
  };

  if (colors.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No colors to display</p>
          <p className="text-sm text-muted-foreground mt-2">
            Upload an image or generate a harmony to see colors here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {harmony.charAt(0).toUpperCase() + harmony.slice(1)} Palette
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {colors.length} color{colors.length !== 1 ? 's' : ''} • {harmony} harmony
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Color Swatches */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {colors.map((color, index) => (
            <ColorSwatch
              key={`${color.hex}-${index}`}
              color={color}
              size="large"
              showDetails={showDetails}
            />
          ))}
        </div>

        {/* Color Values as Text */}
        <div className="bg-secondary/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Color Values</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-mono">
            {colors.map((color, index) => (
              <div key={`${color.hex}-${index}`} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded border border-border/20"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.hex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        {isEditable && (
          <div className="space-y-4">
            <Input
              placeholder="Enter palette name"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              className="w-full"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Export format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="css">CSS Variables</SelectItem>
                  <SelectItem value="scss">SCSS Variables</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="ase">Adobe Swatch</SelectItem>
                  <SelectItem value="txt">Text List</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2 flex-1">
                <Button 
                  onClick={handleSave} 
                  className="btn-primary flex-1"
                  disabled={colors.length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Palette
                </Button>

                <Button 
                  onClick={handleExport} 
                  variant="outline" 
                  className="flex-1"
                  disabled={colors.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>

                {paletteId && onDelete && (
                  <Button onClick={handleDelete} variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaletteDisplay;
