/**
 * Componente: FlyoutNav
 * Propósito: Navbar con fondo que cambia al hacer scroll y flyouts al pasar el cursor.
 * Uso: Se integra en Header sólo para la ruta '/' (Home).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';

type NavLinkItem = {
  key: string;
  label: string;
  to: any; // react-router Link supports string | Location
  title: string;
  FlyoutContent?: React.FC;
};

const AboutFlyout: React.FC = () => (
  <div className="grid h-fit w-full grid-cols-12 shadow-xl lg:h-64 lg:w-[580px] bg-white text-black">
    <div className="col-span-12 flex flex-col justify-between bg-neutral-950 p-4 lg:col-span-4">
      <div>
        <h2 className="mb-1 text-lg font-semibold text-white">About</h2>
        <p className="text-sm text-neutral-400">Quick look at the about section.</p>
      </div>
      <Link to={{ pathname: '/', hash: '#about' }} className="text-xs text-indigo-300 hover:underline">Go to About</Link>
    </div>
    <div className="col-span-12 grid grid-cols-2 gap-3 bg-white p-4 lg:col-span-8">
      <Link to={{ pathname: '/', hash: '#timeline' }} className="rounded border-2 border-neutral-200 bg-white p-3 transition-colors hover:bg-neutral-100">
        <h3 className="mb-1 font-semibold">Timeline</h3>
        <p className="text-xs">Experience highlights and milestones.</p>
      </Link>
      <Link to={{ pathname: '/', hash: '#contact' }} className="rounded border-2 border-neutral-200 bg-white p-3 transition-colors hover:bg-neutral-100">
        <h3 className="mb-1 font-semibold">Contact</h3>
        <p className="text-xs">Get in touch quickly.</p>
      </Link>
    </div>
  </div>
);

const ProjectsFlyout: React.FC = () => (
  <div className="w-full bg-white p-4 shadow-none lg:w-[280px] text-black">
    <div className="grid grid-cols-2 lg:grid-cols-1">
      <div className="mb-3 space-y-2">
        <h3 className="font-semibold">Projects</h3>
        <Link to="/projects" className="block text-sm hover:underline">All Projects</Link>
        <Link to={{ pathname: '/', hash: '#projects' }} className="block text-sm hover:underline">Featured</Link>
      </div>
    </div>
  </div>
);

const WorksFlyout: React.FC = () => (
  <div className="w-full bg-white p-4 shadow-none lg:w-[280px] text-black">
    <div className="space-y-2">
      <h3 className="font-semibold">Works</h3>
      <Link to="/work" className="block text-sm hover:underline">Portfolio</Link>
      <Link to={{ pathname: '/', hash: '#home' }} className="block text-sm hover:underline">Home</Link>
    </div>
  </div>
);

const BlogFlyout: React.FC = () => (
  <div className="w-full bg-white p-4 shadow-none lg:w-[280px] text-black">
    <div className="space-y-2">
      <h3 className="font-semibold">Blog</h3>
      <Link to="/blog" className="block text-sm hover:underline">All posts</Link>
    </div>
  </div>
);

const NavLinkWithFlyout: React.FC<{ item: NavLinkItem }> = ({ item }) => {
  const [open, setOpen] = useState(false);
  const showFlyout = !!item.FlyoutContent && open;
  const FlyoutContent = item.FlyoutContent!;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative h-fit w-fit"
    >
      <Link to={item.to} title={item.title} className="relative">
        <span className="text-white hover:text-pink-500 font-mono text-lg lowercase">{item.label}</span>
        <span
          style={{ transform: showFlyout ? 'scaleX(1)' : 'scaleX(0)' }}
          className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left scale-x-0 rounded-full bg-indigo-300 transition-transform duration-300 ease-out"
        />
      </Link>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: '-50%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute left-1/2 top-12"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FlyoutNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 250));

  const items: NavLinkItem[] = [
    { key: 'home', label: 'home', to: { pathname: '/' }, title: 'Go to Home' },
    { key: 'about', label: 'about', to: { pathname: '/', hash: '#about' }, title: 'Go to About section', FlyoutContent: AboutFlyout },
    { key: 'works', label: 'works', to: { pathname: '/work' }, title: 'View all works', FlyoutContent: WorksFlyout },
    { key: 'projects', label: 'projects', to: { pathname: '/projects' }, title: 'View all projects', FlyoutContent: ProjectsFlyout },
    { key: 'blog', label: 'blog', to: { pathname: '/blog' }, title: 'View all blog posts', FlyoutContent: BlogFlyout },
    { key: 'contact', label: 'contact', to: { pathname: '/', hash: '#contact' }, title: 'Go to Contact section' },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full px-6 transition-all duration-300 ease-out lg:px-12 ${
        scrolled ? 'bg-neutral-950 py-3 shadow-xl' : 'bg-neutral-950/0 py-6 shadow-none'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" aria-label="Go to home" className="text-2xl font-bold cursor-pointer text-white">YT</Link>
        <div className="hidden gap-6 lg:flex">
          <div className="flex items-center gap-6">
            {items.map((it) => (
              it.FlyoutContent ? <NavLinkWithFlyout key={it.key} item={it} /> : (
                <Link key={it.key} to={it.to} title={it.title} className="text-white hover:text-pink-500 font-mono text-lg lowercase">
                  {it.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FlyoutNav;