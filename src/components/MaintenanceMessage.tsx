import { Bolt, FileDown } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { ContactForm } from './ContactForm';

export function MaintenanceMessage() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'Under Maintenance',
      subtitle: "I'm making some improvements!",
      description: "I'm working my magic on this site. It'll be back before you can say \"sudo make me a sandwich\" 🥪!",
      expectedTime: 'Expected downtime: A few moments ⏳',
      downloadCV: 'Download CV',
    },
    es: {
      title: 'En Mantenimiento',
      subtitle: '¡Estoy haciendo mejoras!',
      description: 'Estoy trabajando en la magia de este sitio. ¡Volverá antes de que puedas decir "sudo hazme un sándwich" 🥪!',
      expectedTime: 'Tiempo estimado: Unos momentos ⏳',
      downloadCV: 'Descargar CV',
    },
  };

  const t = content[language];

  return (
    <div className="text-center space-y-6 md:space-y-8">
      <div className="space-y-4 md:space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter relative">
          <span className="relative z-10">{t.title}</span>
          <Bolt className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 text-[#FF6B6B] opacity-10 -z-10" />
        </h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
        <p className="text-xl sm:text-2xl md:text-3xl font-bold">
          {t.subtitle}
        </p>
        <p className="text-lg sm:text-xl md:text-2xl">
          {t.description}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-md p-4 md:p-6 bg-[#4FFFB0] dark:bg-[#FF6B6B] border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
          <p className="text-base sm:text-lg md:text-xl font-bold">
            {t.expectedTime}
          </p>
        </div>

        <a
          href="/IngenieroInformatico_YuangTong_CV.pdf"
          download="IngenieroInformatico_YuangTong_CV.pdf"
          className="w-full max-w-md flex items-center justify-center gap-2 p-4 md:p-6 bg-white dark:bg-neutral-800 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
        >
          <FileDown className="w-5 h-5 md:w-6 md:h-6" />
          <span className="text-base sm:text-lg md:text-xl font-bold">
            {t.downloadCV}
          </span>
        </a>
      </div>

      <div className="mt-12">
        <ContactForm />
      </div>
    </div>
  );
}