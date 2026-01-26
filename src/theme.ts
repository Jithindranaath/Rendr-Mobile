export const COLORS = {
    primary: '#0F172A', // Deep Charcoal (Authority)
    background: '#F8FAFC', // Soft Off-White (Cleanliness)
    accent: '#C8A96A', // Muted Gold (Premium)
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    white: '#FFFFFF',
    success: '#22C55E',
    error: '#EF4444',
    surface: '#FFFFFF',
};

export const TYPOGRAPHY = {
    // Can expand with font families later if custom fonts are loaded
    family: {
        regular: 'System', // Fallback to system sans-serif which is usually good (San Francisco/Roboto)
        bold: 'System',
    },
    size: {
        xs: 12,
        s: 14,
        m: 16,
        l: 18,
        xl: 24,
        xxl: 32,
    },
    weight: {
        regular: '400',
        medium: '500',
        bold: '700',
    } as const,
};

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
};

export const SHADOWS = {
    small: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    medium: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
};
