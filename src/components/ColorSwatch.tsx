
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ColorInfo } from '@/utils/colorUtils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ColorSwatchProps {
  color: ColorInfo;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  onClick?: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  color, 
  size = 'medium', 
  showDetails = false,
  onClick 
}) => {
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: `${type} value copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const getContrastColor = (hex: string) => {
    const rgb = color.rgb;
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="group">
      <div
        className={`${sizeClasses[size]} rounded-xl border-2 border-border/20 cursor-pointer transition-all duration-200 hover:scale-110 hover:border-primary/50 relative overflow-hidden`}
        style={{ backgroundColor: color.hex }}
        onClick={onClick}
      >
        {size === 'large' && (
          <div
            className="absolute inset-x-0 bottom-0 p-2 text-xs font-medium transition-opacity duration-200 opacity-0 group-hover:opacity-100"
            style={{ 
              color: getContrastColor(color.hex),
              backgroundColor: `${color.hex}cc`
            }}
          >
            {color.hex}
          </div>
        )}
      </div>

      {showDetails && (
        <div className="mt-3 space-y-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">HEX</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => copyToClipboard(color.hex, 'HEX')}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
            <p className="text-sm font-mono">{color.hex}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">RGB</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, 'RGB')}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
            <p className="text-sm font-mono">
              {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">HSL</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, 'HSL')}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
            <p className="text-sm font-mono">
              {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSwatch;
