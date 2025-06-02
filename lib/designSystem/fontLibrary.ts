// fontLibrary.ts

// 폰트 패밀리 타입 정의
export interface FontFamilies {
  inter: string;
  roboto: string;
  system: string;
}

// 폰트 웨이트 타입 정의
export interface FontWeights {
  thin: number;
  extraLight: number;
  light: number;
  normal: number;
  medium: number;
  semiBold: number;
  bold: number;
  extraBold: number;
  black: number;
}

// 폰트 사이즈 타입 정의
export interface FontSizes {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

// 라인 하이트 타입 정의
export interface LineHeights {
  tight: string;
  snug: string;
  normal: string;
  relaxed: string;
  loose: string;
  '2xl': string;
  '3xl': string;
}

// 텍스트 스타일 타입 정의
export interface TextStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
}

export interface TextStyles {
  heading: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    h4: TextStyle;
  };
  body: {
    large: TextStyle;
    medium: TextStyle;
    small: TextStyle;
    extraSmall: TextStyle;
  };
  emphasis: {
    bold: TextStyle;
    semiBold: TextStyle;
    medium: TextStyle;
  };
  button: {
    large: TextStyle;
    medium: TextStyle;
    small: TextStyle;
  };
  caption: {
    medium: TextStyle;
    normal: TextStyle;
  };
  roboto: {
    normal: TextStyle;
    medium: TextStyle;
    bold: TextStyle;
  };
}

// 폰트 패밀리 정의
export const fontFamilies: FontFamilies = {
  inter: '"Inter", sans-serif',
  roboto: '"Roboto", sans-serif',
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
};

// 폰트 웨이트 정의
export const fontWeights: FontWeights = {
  thin: 100,
  extraLight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900
};

// 폰트 사이즈 정의 (디자인에서 사용된 사이즈들)
export const fontSizes: FontSizes = {
  xs: '11px',    // 11px
  sm: '12px',    // 12px
  base: '14px',  // 14px (기본)
  lg: '16px',    // 16px
  xl: '18px',    // 18px
  '2xl': '30px', // 30px
  '3xl': '36px'  // 36px
};

// 라인 하이트 정의
export const lineHeights: LineHeights = {
  tight: '16px',    // 16px
  snug: '19.32px',  // 19.32px
  normal: '20px',   // 20px
  relaxed: '24px',  // 24px
  loose: '28px',    // 28px
  '2xl': '36px',    // 36px
  '3xl': '40px'     // 40px
};

// 텍스트 스타일 조합 (자주 사용되는 조합들)
export const textStyles: TextStyles = {
  // 헤딩 스타일
  heading: {
    h1: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes['3xl'],
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights['3xl']
    },
    h2: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes['2xl'],
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights['2xl']
    },
    h3: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.loose
    },
    h4: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.relaxed
    }
  },

  // 본문 텍스트 스타일
  body: {
    large: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.relaxed
    },
    medium: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal
    },
    small: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.tight
    },
    extraSmall: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.tight
    }
  },

  // 강조 텍스트 스타일
  emphasis: {
    bold: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.normal
    },
    semiBold: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.normal
    },
    medium: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal
    }
  },

  // 버튼 텍스트 스타일
  button: {
    large: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.relaxed
    },
    medium: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.semiBold,
      lineHeight: lineHeights.normal
    },
    small: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.tight
    }
  },

  // 캡션 및 라벨 스타일
  caption: {
    medium: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.tight
    },
    normal: {
      fontFamily: fontFamilies.inter,
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.tight
    }
  },

  // Roboto 스타일 (특정 섹션에서 사용)
  roboto: {
    normal: {
      fontFamily: fontFamilies.roboto,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal
    },
    medium: {
      fontFamily: fontFamilies.roboto,
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.relaxed
    },
    bold: {
      fontFamily: fontFamilies.roboto,
      fontSize: fontSizes.base,
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.snug
    }
  }
};

// CSS 스타일 문자열 생성 헬퍼 함수
export const createTextStyle = (styleObject: TextStyle): string => {
  return Object.entries(styleObject)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ');
};

// React 컴포넌트용 스타일 객체 생성 헬퍼 함수
export const getTextStyle = (
  category: keyof TextStyles, 
  variant: string
): TextStyle => {
  const categoryStyles = textStyles[category] as any;
  return categoryStyles?.[variant] || textStyles.body.medium;
};

// 폰트 CSS import 문자열 (Google Fonts에서 로드)
export const fontImports = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
`;

// CSS 변수로 폰트 정의
export const fontCSSVariables = `
:root {
  --font-inter: ${fontFamilies.inter};
  --font-roboto: ${fontFamilies.roboto};
  --font-system: ${fontFamilies.system};
  
  --font-weight-thin: ${fontWeights.thin};
  --font-weight-light: ${fontWeights.light};
  --font-weight-normal: ${fontWeights.normal};
  --font-weight-medium: ${fontWeights.medium};
  --font-weight-semibold: ${fontWeights.semiBold};
  --font-weight-bold: ${fontWeights.bold};
  --font-weight-extrabold: ${fontWeights.extraBold};
  
  --font-size-xs: ${fontSizes.xs};
  --font-size-sm: ${fontSizes.sm};
  --font-size-base: ${fontSizes.base};
  --font-size-lg: ${fontSizes.lg};
  --font-size-xl: ${fontSizes.xl};
  --font-size-2xl: ${fontSizes['2xl']};
  --font-size-3xl: ${fontSizes['3xl']};
  
  --line-height-tight: ${lineHeights.tight};
  --line-height-normal: ${lineHeights.normal};
  --line-height-relaxed: ${lineHeights.relaxed};
  --line-height-loose: ${lineHeights.loose};
  --line-height-2xl: ${lineHeights['2xl']};
  --line-height-3xl: ${lineHeights['3xl']};
}
`;