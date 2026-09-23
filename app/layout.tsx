import type { Metadata } from "next";
import "./globals.css";
import { WebMcpTools } from "@/components/webmcp-tools";
import { PwaRegistrar } from "@/components/pwa-registrar";

export const metadata: Metadata = {
  title: "Coonto — Entre na obra. Saia compreendendo.",
  description: "Experiências de aprendizagem por narrativas, decisões e consequências. Comece gratuitamente por O Alienista.",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><WebMcpTools /><PwaRegistrar />{children}</body></html>;
}
