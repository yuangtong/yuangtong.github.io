import { Send } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useState } from 'react';

export function ContactForm() {
  const { language } = useLanguage();
  const [showOtherReason, setShowOtherReason] = useState(false);

  const labels = {
    en: {
      title: 'Get in Touch',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      reason: 'Reason for Contact',
      otherReason: 'Specify Reason',
      reasons: {
        inquiry: 'Inquiry',
        quote: 'Quote',
        general: 'General Message',
        other: 'Other'
      }
    },
    es: {
      title: 'Contacto',
      name: 'Nombre',
      email: 'Correo',
      message: 'Mensaje',
      send: 'Enviar Mensaje',
      reason: 'Motivo de Contacto',
      otherReason: 'Especificar Motivo',
      reasons: {
        inquiry: 'Consulta',
        quote: 'Cotización',
        general: 'Mensaje General',
        other: 'Otro'
      }
    }
  };

  const t = labels[language];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Let Netlify handle the form submission
    // The form will be submitted and redirected to Netlify's success page
  };
  
  const handleReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShowOtherReason(e.target.value === 'other');
  };

  return (
    <>
      <form name="contact" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <select name="reason"></select>
        <input type="text" name="otherReason" />
        <textarea name="message"></textarea>
      </form>

      <form 
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="max-w-md w-full mx-auto space-y-4"
      >
        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="bot-field" />
        
        {/* Rest of your form remains the same */}
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
          <select
            name="reason"
            required
            onChange={handleReasonChange}
            aria-label={t.reason}
            className="w-full p-3 bg-white dark:bg-neutral-800 border-4 border-black dark:border-white focus:outline-none focus:ring-2 focus:ring-[#4FFFB0] dark:focus:ring-[#6B2B9E]"
          >
            <option value="" disabled selected>{t.reason}</option>
            <option value="inquiry">{t.reasons.inquiry}</option>
            <option value="quote">{t.reasons.quote}</option>
            <option value="general">{t.reasons.general}</option>
            <option value="other">{t.reasons.other}</option>
          </select>
        </div>

        {showOtherReason && (
          <div className="space-y-2">
            <input
              type="text"
              name="otherReason"
              placeholder={t.otherReason}
              required
              className="w-full p-3 bg-white dark:bg-neutral-800 border-4 border-black dark:border-white focus:outline-none focus:ring-2 focus:ring-[#4FFFB0] dark:focus:ring-[#6B2B9E]"
            />
          </div>
        )}

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
    </>
  );
}