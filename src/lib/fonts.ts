import {
  JetBrains_Mono as FontMono,
  Roboto_Mono as FontRoboto,
} from 'next/font/google';
import localFont from 'next/font/local';

export const fontRoboto = FontRoboto({
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

// Font files can be colocated inside of `pages`
export const fontRoobert = localFont({
  src: '../assets/fonts/Roobert-Regular.ttf',
  variable: '--font-roobert',
});

export const fontReckless = localFont({
  src: '../assets/fonts/RecklessNeue-Regular.ttf',
  variable: '--font-reckless',
});
