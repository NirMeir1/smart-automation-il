export const theme = {
  colors: {
    navy: '#0E2A47',
    ink: '#1C2B3A', 
    muted: '#F6F7FB',
    card: '#FFFFFF',
    outline: '#E6EAF2',
    accent: {
      from: '#6C4CE3',
      to: '#FF4E86',
      gradient: 'linear-gradient(90deg, #6C4CE3, #FF4E86)'
    },
    background: '#ffffff',
    foreground: '#171717'
  },
  typography: {
    h1: {
      fontSize: '56px',
      fontWeight: '700',
      lineHeight: '1.5'
    },
    h2: {
      fontSize: '40px', 
      fontWeight: '700',
      lineHeight: '1.5'
    },
    h3: {
      fontSize: '22px',
      fontWeight: '600', 
      lineHeight: '1.5'
    },
    body: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5'
    }
  },
  radius: '24px',
  radiusSm: '20px',
  shadow: '0 10px 30px rgba(16,24,40,0.08)',
  spacing: {
    1: '8px',
    2: '12px', 
    3: '16px',
    4: '24px',
    5: '32px'
  }
} as const

export type Theme = typeof theme