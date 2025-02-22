import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultColors = {
  primary: '#f66435',
  secondary: '#f4efca',
  background: '#000000',
  floats: {
    primary: 'rgba(237, 116, 64, 0.85)',
  },
  text: {
    primary: '#1A1A1B',
    secondary: '#4A4A4B',
    input: '#4A4A4B',
    light: '#6E6E6F',
    icon: '#C3073F',
    veryLight: '#8E8E8F',
    inactive: '#6E6E6F',
  },
  // Background Colors
  background1: {
    primary: '#F7F7F7', // Cream White
    secondary: '#FFFFFF',
    alternative: '#F0F0F0',
    light: '#FAFAFA',
    dark: '#1A1A1B',
  },
  
  // Border Colors
  border: {
    default: '#E0E0E0',
    light: '#EEEEEE',
  },
  
  // Accent Colors
  accent: {
    primary: '#FFD700', // Golden Yellow
    link: '#C3073F',
    overlay: 'rgba(26, 26, 27, 0.5)',
  },
  
  // System Colors
  system: {
    shadow: '#1A1A1B',
    error: '#C3073F',
    success: '#28A745',
    warning: '#FFD700',
  },
  // ... other color definitions
};

let colors = { ...defaultColors };

const loadCustomColors = async () => {
  try {
    const savedColors = await AsyncStorage.getItem('APP_COLORS');
    if (savedColors) {
      colors = { ...colors, ...JSON.parse(savedColors) };
    }
  } catch (error) {
    console.error('Error loading custom colors:', error);
  }
};

loadCustomColors();

export default colors;
