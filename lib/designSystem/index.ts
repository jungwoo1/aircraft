// index.ts - 디자인 시스템 전체 export
import React from 'react';

// 타입 정의
export type {
  TagColor,
  DesignColors
} from './colorPalette';

export type {
  FontFamilies,
  FontWeights,
  FontSizes,
  LineHeights,
  TextStyle,
  TextStyles
} from './fontLibrary';

// 컬러 팔레트 관련
export {
  tagColors,
  designColors,
  allColors,
  getColorByName,
  getRandomColor,
  getColorByIndex,
  colorGroups
} from './colorPalette';

// 폰트 라이브러리 관련
export {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  textStyles,
  createTextStyle,
  getTextStyle,
  fontImports,
  fontCSSVariables
} from './fontLibrary';

// import된 값들을 사용하여 추가 정의
import { designColors } from './colorPalette';
import { textStyles } from './fontLibrary';

// RGB 타입 정의
export interface RGB {
  r: number;
  g: number;
  b: number;
}

// 테마 타입 정의
export interface Theme {
  colors: any;
  fonts: any;
}

// 브레이크포인트 타입 정의
export interface Breakpoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// CSS 스타일 타입 정의 - React.CSSProperties 호환
export type CSSStyle = React.CSSProperties;

// 컴포넌트 스타일 타입 정의 - 수정된 버전
export interface ComponentStyles {
  button: {
    primary: CSSStyle;
    secondary: CSSStyle;
  };
  card: {
    default: CSSStyle;
  };
  input: {
    default: CSSStyle;
  };
}

// TextStyle을 React.CSSProperties로 변환하는 헬퍼 함수
export const convertTextStyleToCSSProperties = (textStyle: any): React.CSSProperties => ({
  fontFamily: textStyle.fontFamily,
  fontSize: textStyle.fontSize,
  fontWeight: textStyle.fontWeight,
  lineHeight: textStyle.lineHeight,
});

// 추가적인 유틸리티 함수들

// 컬러 변환 유틸리티
export const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// 알파값이 있는 rgba 생성
export const addAlpha = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : hex;
};

// 컬러 컨트라스트 체크
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// 접근성 체크 (WCAG 기준)
export const isAccessible = (
  textColor: string, 
  backgroundColor: string, 
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  const contrast = getContrastRatio(textColor, backgroundColor);
  return level === 'AAA' ? contrast >= 7 : contrast >= 4.5;
};

// 반응형 폰트 사이즈 계산
export const getResponsiveFontSize = (baseSize: string, screenWidth: number): string => {
  const minSize = parseFloat(baseSize) * 0.8;
  const maxSize = parseFloat(baseSize) * 1.2;
  const scaleFactor = Math.min(Math.max(screenWidth / 1200, 0.8), 1.2);
  return `${minSize + (maxSize - minSize) * (scaleFactor - 0.8) / 0.4}px`;
};

// 스타일 객체를 CSS 문자열로 변환
export const styleToCss = (styleObj: React.CSSProperties): string => {
  return Object.entries(styleObj)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ');
};

// 테마 생성 헬퍼
export const createTheme = (customColors: any = {}, customFonts: any = {}): Theme => {
  return {
    colors: { ...designColors, ...customColors },
    fonts: { ...textStyles, ...customFonts }
  };
};

// 다크 모드 컬러 변형
export const createDarkTheme = () => {
  return {
    ...designColors,
    text: {
      primary: '#FFFFFF',
      secondary: '#E5E7EB',
      tertiary: '#D1D5DB',
      muted: '#9CA3AF',
      light: '#6B7280',
      lighter: '#4B5563',
      disabled: '#374151'
    },
    background: {
      white: '#111827',
      gray50: '#1F2937',
      gray100: '#374151',
      gray200: '#4B5563',
      gray300: '#6B7280'
    }
  };
};

// 컴포넌트별 스타일 프리셋 - 수정된 버전
export const componentStyles: ComponentStyles = {
  button: {
    primary: {
      backgroundColor: designColors.primary.purple,
      color: designColors.background.white,
      border: `1px solid ${designColors.border.focus}`,
      borderRadius: '8px',
      padding: '8px 16px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      // 텍스트 스타일 적용
      ...convertTextStyleToCSSProperties(textStyles.button.medium)
    },
    secondary: {
      backgroundColor: designColors.background.white,
      color: designColors.text.primary,
      border: `1px solid ${designColors.border.light}`,
      borderRadius: '8px',
      padding: '8px 16px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      // 텍스트 스타일 적용
      ...convertTextStyleToCSSProperties(textStyles.button.medium)
    }
  },
  
  card: {
    default: {
      backgroundColor: designColors.background.white,
      border: `1px solid ${designColors.border.light}`,
      borderRadius: '8px',
      padding: '20px',
      boxShadow: `0px 1px 3px ${designColors.interactive.shadowMedium}`
    }
  },
  
  input: {
    default: {
      padding: '8px 12px',
      border: `1px solid ${designColors.border.light}`,
      borderRadius: '4px',
      backgroundColor: designColors.background.white,
      color: designColors.text.primary,
      outline: 'none',
      // 텍스트 스타일 적용
      ...convertTextStyleToCSSProperties(textStyles.body.medium)
    }
  }
};

// 브레이크포인트 정의
export const breakpoints: Breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// 미디어 쿼리 헬퍼
export const mediaQuery = (size: keyof Breakpoints): string => 
  `@media (min-width: ${breakpoints[size]})`;

// 전체 디자인 시스템 객체
export const designSystem = {
  colors: designColors,
  fonts: textStyles,
  components: componentStyles,
  breakpoints,
  utils: {
    hexToRgb,
    rgbToHex,
    addAlpha,
    getContrastRatio,
    isAccessible,
    getResponsiveFontSize,
    styleToCss,
    createTheme,
    createDarkTheme,
    mediaQuery,
    convertTextStyleToCSSProperties
  }
} as const;

export default designSystem;