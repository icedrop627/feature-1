import Link from 'next/link';
import { MapPin, Github, Twitter, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { label: '프로젝트 소개', href: '#' },
      { label: '데이터 출처', href: '#' },
      { label: '문의하기', href: '#' },
    ],
    legal: [
      { label: '개인정보처리방침', href: '#' },
      { label: '이용약관', href: '#' },
    ],
    social: [
      { icon: Github, href: '#', label: 'GitHub' },
      { icon: Twitter, href: '#', label: 'Twitter' },
      { icon: Mail, href: 'mailto:contact@k-nomad.com', label: 'Email' },
    ],
  };

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                K-Nomad
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              한국 디지털 노마드를 위한 도시 정보 플랫폼입니다.
            </p>
          </div>

          {/* About Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">정보</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">법적 고지</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">소셜</h3>
            <div className="flex gap-4">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} K-Nomad. All rights reserved.</p>
          <p>
            Made with ❤️ for Digital Nomads in Korea
          </p>
        </div>
      </div>
    </footer>
  );
}
