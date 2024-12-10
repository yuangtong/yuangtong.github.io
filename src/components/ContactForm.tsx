import { useState } from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export function ContactForm() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const t = labels[language];

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-6">{t.title}</h2>
      
      <div className="space-y-2">
        <input
          type="text"
          name="name"
          placeholder={t.name}
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 bg-white dark:bg-neutral-800 border-4 border-black dark:border-white focus:outline-none focus:ring-2 focus:ring-[#4FFFB0] dark:focus:ring-[#FF6B6B]"
        />
      </div>

      <div className="space-y-2">
        <input
          type="email"
          name="email"
          placeholder={t.email}
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 bg-white dark:bg-neutral-800 border-4 border-black dark:border-white focus:outline-none focus:ring-2 focus:ring-[#4FFFB0] dark:focus:ring-[#FF6B6B]"
        />
      </div>

      <div className="space-y-2">
        <textarea
          name="message"
          placeholder={t.message}
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 bg-white dark:bg-neutral-800 border-4 border-black dark:border-white focus:outline-none focus:ring-2 focus:ring-[#4FFFB0] dark:focus:ring-[#FF6B6B]"
        />
      </div>

      <button
        type="submit"
        className="w-full p-4 bg-[#4FFFB0] dark:bg-[#FF6B6B] border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all flex items-center justify-center gap-2"
      >
        <Send className="w-5 h-5" />
        <span className="font-bold">{t.send}</span>
      </button>
    </form>
  );
}