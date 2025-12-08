'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDown, Mail } from 'lucide-react';

export function HeroSection({ totalCities, totalReviews }: { totalCities: number; totalReviews: number }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - no actual functionality
    console.log('Email submitted:', email);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 dark:from-primary/5 dark:via-purple-950 dark:to-pink-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />

      {/* Content */}
      <div className="container relative z-10 text-center space-y-8 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="block">🌏 한국에서</span>
            <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              디지털 노마드로 살기
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            당신에게 맞는 도시를 찾아보세요
          </p>
          <p className="text-sm md:text-base text-muted-foreground">
            {totalCities}개 도시 · 실시간 데이터 · {totalReviews.toLocaleString()}개의 진짜 리뷰
          </p>
        </div>

        {/* Email Signup Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 text-base"
                required
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8">
              🚀 무료로 시작하기
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            또는{' '}
            <Link href="#cities" className="text-primary hover:underline">
              둘러보기만 하기 →
            </Link>
          </p>
        </form>
      </div>

      {/* Scroll Indicator */}
      <Link
        href="#cities"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </Link>
    </section>
  );
}
