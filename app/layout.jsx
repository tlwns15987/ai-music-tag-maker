import "./globals.css";

export const metadata = {
  title: "AI Music Tag Maker",
  description: "AI 음악 태그 생성기",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
