export function Header() {
  return (
    <header className="fixed top-3 left-3 md:top-4 md:left-4 z-50">
      <a 
        href="/"
        className="inline-block p-2.5 md:p-3 bg-[#4FFFB0] dark:bg-[#FF6B6B] border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
      >
        <span className="text-base md:text-lg font-bold whitespace-nowrap">
          yuangtong.dev
        </span>
      </a>
    </header>
  );
}