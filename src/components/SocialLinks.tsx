import { Github, Linkedin, Twitter } from 'lucide-react';

export function SocialLinks() {
  const links = [
    {
      icon: Github,
      href: 'https://github.com',
      label: 'GitHub',
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com',
      label: 'LinkedIn',
    },
    {
      icon: Twitter,
      href: 'https://twitter.com',
      label: 'Twitter',
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      {links.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 p-2.5 md:p-3 bg-white dark:bg-neutral-900 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
          <span className="hidden md:inline font-bold">{label}</span>
        </a>
      ))}
    </div>
  );
}