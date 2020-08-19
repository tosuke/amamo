import React from 'react';

export const colors = Object.freeze({
  textRaw: 'var(--color-text-raw)',
  text: 'var(--color-text)',
  caption: 'var(--color-caption)',
  border: 'var(--color-border)',
  accent: 'var(--color-accent)',
  alert: 'var(--color-alert)',
  foreground: 'var(--color-foreground)',
  background: 'var(--color-background)',
});

export const sizes = Object.freeze({
  minTappable: 'var(--size-minimum-tappable)',
});

export type ColorThemeProps = {
  mode?: 'light' | 'dark' | 'auto';
};

export const ColorTheme = ({ mode = 'auto' }: ColorThemeProps) => {
  const toVar = (name: string) => `var(--color-${mode}-${name})`;
  return (
    <style jsx global>{`
      :root {
        --color-text-raw: ${toVar('text-raw')};
        --color-text: ${toVar('text')};
        --color-caption: ${toVar('caption')};
        --color-border: ${toVar('border')};
        --color-accent: ${toVar('accent')};
        --color-alert: ${toVar('alert')};
        --color-foreground: ${toVar('foreground')};
        --color-background: ${toVar('background')};
      }
      * {
        transition: background-color 0.3s, border-color 0.3s;
      }
    `}</style>
  );
};

export const GlobalStyles = () => (
  <style jsx global>{`
    body {
      background-color: ${colors.background};
      color: ${colors.text};
      line-height: 1.15;
    }
    a {
      color: ${colors.accent};
    }
    input,
    button,
    textarea,
    select {
      margin: 0;
      padding: 0;
      background: none;
      border: none;
      border-radius: 0;
      outline: none;
      appearance: none;
      width: 100%;
    }
  `}</style>
);
