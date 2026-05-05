// src/constants/theme.js
export const COLORS = {
  // Primary palette
  navy: '#1A1A2E',
  navyDark: '#0D0D14',
  gold: '#F5A623',
  goldDark: '#E09510',
  goldPale: '#FFF8ED',

  // Backgrounds
  white: '#FFFFFF',
  cream: '#FAFAF7',
  surface: '#F7F7F4',
  border: '#E8E8E2',

  // Text
  textPrimary: '#0D0D14',
  textSecondary: '#555566',
  textMuted: '#888896',
  textLight: 'rgba(255,255,255,0.7)',
  textLighter: 'rgba(255,255,255,0.4)',

  // Status
  green: '#16A34A',
  greenBg: '#DCFCE7',
  greenText: '#15803D',
  orange: '#EA580C',
  orangeBg: '#FFF7ED',
  red: '#DC2626',
  redBg: '#FEE2E2',
  blue: '#2563EB',
  blueBg: '#EFF6FF',
  purple: '#7C3AED',
  purpleBg: '#EDE9FE',

  // Shadows
  shadowColor: '#000',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  mono: 'Courier',
};

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Border radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 999,

  // Font sizes
  fontXs: 10,
  fontSm: 12,
  fontMd: 14,
  fontLg: 16,
  fontXl: 18,
  fontXxl: 22,
  fontHero: 28,

  // Component heights
  inputHeight: 52,
  buttonHeight: 56,
  navHeight: 60,
  headerHeight: 56,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
};
