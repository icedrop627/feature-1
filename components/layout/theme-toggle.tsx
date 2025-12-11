'use client';

import { Moon, Sun, Sparkles, Leaf, Crown, Minimize2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const themes = [
    { id: 'light', name: '라이트', icon: Sun },
    { id: 'dark', name: '다크', icon: Moon },
    { id: 'minimal', name: '미니멀', icon: Minimize2 },
    { id: 'neon-cyber', name: '네온 사이버', icon: Sparkles },
    { id: 'nature', name: '네이처', icon: Leaf },
    { id: 'luxury', name: '럭셔리', icon: Crown },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">테마 변경</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>테마 선택</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map(({ id, name, icon: Icon }) => (
          <DropdownMenuItem
            key={id}
            onClick={() => setTheme(id)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            <span>{name}</span>
            {theme === id && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
