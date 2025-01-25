import { ReactNode } from 'react';
import { SocialLinks } from './SocialLinks';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f0f0f0] dark:bg-[#121212] text-black dark:text-white transition-colors">
      <Header />
      <ThemeToggle />
      <LanguageToggle />
      
      <main className="container mx-auto px-4 py-20 min-h-[calc(100vh-6rem)]">
        {children}
      </main>

      <footer className="h-24 bg-[#f0f0f0] dark:bg-[#121212] border-t-4 border-black dark:border-white">
        <div className="container mx-auto h-full flex items-center justify-center px-4">
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}