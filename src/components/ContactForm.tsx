import { Send } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export function ContactForm() {
  const { language } = useLanguage();

  const labels = {
    en: {
      title: 'Get in Touch',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
    },
    es: {
      title: 'Contacto',
      name: 'Nombre',
      email: 'Correo',
      message: 'Mensaje',
      send: 'Enviar Mensaje',
    },
  };

  const t = labels[language];

  return (
    <form 
      name="contact"
      method="POST"
      data-netlify="true"
      className="max-w-md w-full mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold mb-6">{t.title}</h2>
      
      <div className="space-y-2">
        <input
          type="text"
          name="name"
          placeholder={t.name}
          required
          className="w-full p-3 bg-white dark:bg-neutral-800 border-4 border-black dark:border-white focus:outline-none focus:ring-2 focus:ring-[#4FFFB0] dark:focus:ring-[#6B2B9E]"
        />
      </div>

      <div className="space-y-2">
        <input
          type="email"
          name="email"
          placeholder={t.email}
          required
          className="w-full p-3 bg-white dark:bg-neutral-800 border-4 border-black dark:border-white focus:outline-none focus:ring-2 focus:ring-[#4FFFB0] dark:focus:ring-[#6B2B9E]"
        />
      </div>

      <div className="space-y-2">
        <textarea
          name="message"
          placeholder={t.message}
          required
          rows={4}
          className="w-full p-3 bg-white dark:bg-neutral-800 border-4 border-black dark:border-white focus:outline-none focus:ring-2 focus:ring-[#4FFFB0] dark:focus:ring-[#6B2B9E]"
        />
      </div>

      <button
        type="submit"
        className="w-full p-4 bg-[#4FFFB0] dark:bg-[#6B2B9E] border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all flex items-center justify-center gap-2"
      >
        <Send className="w-5 h-5" />
        <span className="font-bold">{t.send}</span>
      </button>
    </form>
  );
}