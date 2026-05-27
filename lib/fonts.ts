import {
  Cormorant_Garamond,
  DM_Sans,
  Noto_Sans_TC,
  Noto_Serif_TC
} from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap"
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap"
});

export const notoSerifTC = Noto_Serif_TC({
  weight: ["400", "700"],
  variable: "--font-noto-serif",
  preload: false,
  display: "swap"
});

export const notoSansTC = Noto_Sans_TC({
  weight: ["400"],
  variable: "--font-noto-sans",
  preload: false,
  display: "swap"
});

export const fontVariables = [
  cormorant.variable,
  dmSans.variable,
  notoSerifTC.variable,
  notoSansTC.variable
].join(" ");
