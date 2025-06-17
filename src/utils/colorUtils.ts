export interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: ColorInfo[];
  harmony: string;
  createdAt: string;
}

// RGB to HEX conversion
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

// HEX to RGB conversion
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// RGB to HSL conversion
export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Extract more comprehensive color palettes from image
export const extractColorsFromImage = (imageData: ImageData): ColorInfo[] => {
  const data = imageData.data;
  const colorMap = new Map<string, number>();
  
  // Sample every 5th pixel for better coverage
  for (let i = 0; i < data.length; i += 20) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];
    
    // Skip transparent pixels
    if (alpha < 125) continue;
    
    const hex = rgbToHex(r, g, b);
    colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
  }
  
  // Sort by frequency and take more colors (up to 20)
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([hex]) => {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      return {
        hex,
        rgb,
        hsl
      };
    });
  
  return sortedColors;
};

// Extract additional palette variations
export const extractAllColorPalettes = (imageData: ImageData): { 
  dominant: ColorInfo[];
  vibrant: ColorInfo[];
  muted: ColorInfo[];
  light: ColorInfo[];
  dark: ColorInfo[];
} => {
  const data = imageData.data;
  const allColors: ColorInfo[] = [];
  
  // Sample more comprehensively
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = data[i + 3];
    
    if (alpha < 125) continue;
    
    const hex = rgbToHex(r, g, b);
    const rgb = { r, g, b };
    const hsl = rgbToHsl(r, g, b);
    
    allColors.push({ hex, rgb, hsl });
  }
  
  // Categorize colors
  const dominant = getTopColors(allColors, 12);
  const vibrant = allColors.filter(color => color.hsl.s > 60 && color.hsl.l > 20 && color.hsl.l < 80).slice(0, 10);
  const muted = allColors.filter(color => color.hsl.s < 50 && color.hsl.l > 30 && color.hsl.l < 70).slice(0, 8);
  const light = allColors.filter(color => color.hsl.l > 70).slice(0, 8);
  const dark = allColors.filter(color => color.hsl.l < 30).slice(0, 8);
  
  return { dominant, vibrant, muted, light, dark };
};

const getTopColors = (colors: ColorInfo[], count: number): ColorInfo[] => {
  const colorMap = new Map<string, number>();
  
  colors.forEach(color => {
    colorMap.set(color.hex, (colorMap.get(color.hex) || 0) + 1);
  });
  
  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([hex]) => colors.find(c => c.hex === hex)!)
    .filter(Boolean);
};

// Generate color harmony based on base color
export const generateColorHarmony = (baseColor: ColorInfo, harmonyType: string): ColorInfo[] => {
  const { h, s, l } = baseColor.hsl;
  const colors: ColorInfo[] = [baseColor];

  switch (harmonyType) {
    case 'complementary':
      colors.push(createColorFromHsl((h + 180) % 360, s, l));
      break;
      
    case 'triadic':
      colors.push(createColorFromHsl((h + 120) % 360, s, l));
      colors.push(createColorFromHsl((h + 240) % 360, s, l));
      break;
      
    case 'analogous':
      for (let i = 1; i <= 4; i++) {
        colors.push(createColorFromHsl((h + i * 30) % 360, s, l));
      }
      break;
      
    case 'monochromatic':
      for (let i = 1; i <= 4; i++) {
        colors.push(createColorFromHsl(h, s, Math.max(10, Math.min(90, l + i * 15))));
      }
      break;
      
    case 'tetradic':
      colors.push(createColorFromHsl((h + 90) % 360, s, l));
      colors.push(createColorFromHsl((h + 180) % 360, s, l));
      colors.push(createColorFromHsl((h + 270) % 360, s, l));
      break;
  }

  return colors;
};

const createColorFromHsl = (h: number, s: number, l: number): ColorInfo => {
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  
  return {
    hex,
    rgb,
    hsl: { h, s, l }
  };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
  };
};

export const savePalette = (palette: ColorPalette): void => {
  const saved = getSavedPalettes();
  const updated = saved.filter(p => p.id !== palette.id);
  updated.unshift(palette);
  localStorage.setItem('colorcraft-palettes', JSON.stringify(updated.slice(0, 50)));
};

export const getSavedPalettes = (): ColorPalette[] => {
  try {
    const saved = localStorage.getItem('colorcraft-palettes');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const deletePalette = (paletteId: string): void => {
  const saved = getSavedPalettes();
  const updated = saved.filter(p => p.id !== paletteId);
  localStorage.setItem('colorcraft-palettes', JSON.stringify(updated));
};

export const exportPalette = (palette: ColorPalette, format: string): string => {
  switch (format) {
    case 'css':
      return palette.colors.map((color, index) => 
        `--color-${index + 1}: ${color.hex};`
      ).join('\n');
      
    case 'scss':
      return palette.colors.map((color, index) => 
        `$color-${index + 1}: ${color.hex};`
      ).join('\n');
      
    case 'json':
      return JSON.stringify(palette, null, 2);
      
    case 'txt':
      return palette.colors.map(color => color.hex).join('\n');
      
    default:
      return palette.colors.map(color => color.hex).join('\n');
  }
};
