import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import PostHogPageview from '../components/PostHogPageview';

const inter = Inter({ subsets: ["latin"] });

const protoMonoSemiBoldShadow = localFont({
  src: '../fonts/Webfont/Proto Mono SemBd Shadow/ProtoMono-SemiBoldShadow.woff',
  variable: '--font-proto-mono-semibold-shadow',
});

const protoMonoLight = localFont({
  src: '../fonts/Webfont/Proto Mono Light/ProtoMono-Light.woff',
  variable: '--font-proto-mono-light',
});

const protoMonoRegular = localFont({
  src: '../fonts/Webfont/Proto Mono Regular/ProtoMono-Regular.woff',
  variable: '--font-proto-mono-regular',
});

export const metadata: Metadata = {
  title: "Pointer - The Generalist Browser Agent for Everyone",
  description: "A Generalist Browser Agent for Everyone",
  icons: {
    icon: [{ url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⬜</text></svg>" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${protoMonoSemiBoldShadow.variable} ${protoMonoLight.variable} ${protoMonoRegular.variable}`}>
        <PostHogPageview />
        {children}
      </body>
    </html>
  );
}
