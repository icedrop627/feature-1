'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AuthModal } from '@/components/auth/auth-modal';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const navItems = [
    { label: '도시', href: '/#cities' },
    { label: '커뮤니티', href: '#' },
    { label: '가이드', href: '#' },
  ];

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            K-Nomad
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => openAuthModal('login')}>
            로그인
          </Button>
          <Button size="sm" onClick={() => openAuthModal('signup')}>
            회원가입
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? <X /> : <Menu />}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setIsOpen(false);
                      openAuthModal('login');
                    }}
                  >
                    로그인
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                      openAuthModal('signup');
                    }}
                  >
                    회원가입
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </nav>
  );
}
