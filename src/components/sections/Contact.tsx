import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import Globe from '../ui/Globe';
import { useTranslation } from '../../context/TranslationContext';

const Contact = () => {
  const { language, translate } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [otherReason, setOtherReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('Inquiry');
  
  const initialContactReasons = ['Inquiry', 'Quote', 'General message', 'Other'];
  const [contactReasons, setContactReasons] = useState(initialContactReasons);

  const [translatedContent, setTranslatedContent] = useState({
    thankYou: 'Thank You!',
    confirmation: "Your message has been received. I'll get back to you soon!",
    letsWork: "Let's Work Together!",
    projectInMind: "Have a project in mind? Let's create something amazing.",
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email',
    reasonLabel: 'Reason for Contact',
    otherReasonPlaceholder: 'Please specify',
    messagePlaceholder: 'Your Message',
    sendMessage: 'Send Message',
    projectsAcross: 'Projects completed across',
    countries: '7 countries'
  });

  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedContent({
          thankYou: 'Thank You!',
          confirmation: "Your message has been received. I'll get back to you soon!",
          letsWork: "Let's Work Together!",
          projectInMind: "Have a project in mind? Let's create something amazing.",
          namePlaceholder: 'Name',
          emailPlaceholder: 'Email',
          reasonLabel: 'Reason for Contact',
          otherReasonPlaceholder: 'Please specify',
          messagePlaceholder: 'Your Message',
          sendMessage: 'Send Message',
          projectsAcross: 'Projects completed across',
          countries: '7 countries'
        });
        setContactReasons(initialContactReasons);
        return;
      }

      // Translate all static content
      const [
        thankYou,
        confirmation,
        letsWork,
        projectInMind,
        namePlaceholder,
        emailPlaceholder,
        reasonLabel,
        otherReasonPlaceholder,
        messagePlaceholder,
        sendMessage,
        projectsAcross,
        countries
      ] = await Promise.all([
        translate('Thank You!'),
        translate("Your message has been received. I'll get back to you soon!"),
        translate("Let's Work Together!"),
        translate("Have a project in mind? Let's create something amazing."),
        translate('Name'),
        translate('Email'),
        translate('Reason for Contact'),
        translate('Please specify'),
        translate('Your Message'),
        translate('Send Message'),
        translate('Projects completed across'),
        translate('7 countries')
      ]);

      setTranslatedContent({
        thankYou,
        confirmation,
        letsWork,
        projectInMind,
        namePlaceholder,
        emailPlaceholder,
        reasonLabel,
        otherReasonPlaceholder,
        messagePlaceholder,
        sendMessage,
        projectsAcross,
        countries
      });

      // Translate contact reasons
      const translatedReasons = await Promise.all(
        initialContactReasons.map(reason => translate(reason))
      );
      setContactReasons(translatedReasons);
    };

    translateContent();
  }, [language, translate]);

  if (submitted) {
    return (
      <section id="contact" className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-5xl font-bold mb-8">{translatedContent.thankYou}</h2>
            <p className="font-mono text-xl">
              {translatedContent.confirmation}
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl order-2 lg:order-1"
          >
            <h2 className="text-5xl font-bold mb-8">{translatedContent.letsWork}</h2>
            <p className="font-mono text-xl mb-12">
              {translatedContent.projectInMind}
            </p>

            {/* Formulario oculto para Netlify */}
            <form name="contact" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
              <input type="text" name="name" />
              <input type="email" name="email" />
              <select name="contactReason">
                {initialContactReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              <input type="text" name="otherReason" />
              <textarea name="message"></textarea>
            </form>

            {/* Formulario visible para el usuario */}
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                form.submit();
                setSubmitted(true);
              }}
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="contact" />
              <div className="hidden">
                <label htmlFor="bot-field" className="sr-only">Bot Field</label>
                <input id="bot-field" name="bot-field" aria-hidden="true" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  name="name"
                  placeholder={translatedContent.namePlaceholder}
                  required
                  className="w-full p-4 bg-white border-4 border-pink-500 text-black font-mono placeholder-gray-500 focus:outline-none focus:border-yellow-300"
                />
                
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  name="email"
                  placeholder={translatedContent.emailPlaceholder}
                  required
                  className="w-full p-4 bg-white border-4 border-pink-500 text-black font-mono placeholder-gray-500 focus:outline-none focus:border-yellow-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-sm">{translatedContent.reasonLabel}</label>
                <select
                  aria-label={translatedContent.reasonLabel}
                  name="contactReason"
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full p-4 bg-white border-4 border-pink-500 text-black font-mono focus:outline-none focus:border-yellow-300"
                  required
                >
                  {contactReasons.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
                {selectedReason === 'Other' && (
                  <motion.input
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="text"
                    name="otherReason"
                    placeholder={translatedContent.otherReasonPlaceholder}
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    required
                    className="w-full p-4 bg-white border-4 border-pink-500 text-black font-mono placeholder-gray-500 focus:outline-none focus:border-yellow-300"
                  />
                )}
              </div>
              
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                name="message"
                rows={6}
                placeholder={translatedContent.messagePlaceholder}
                required
                className="w-full p-4 bg-white border-4 border-pink-500 text-black font-mono placeholder-gray-500 focus:outline-none focus:border-yellow-300"
              />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-pink-500 text-white px-8 py-4 border-4 border-white font-bold text-lg flex items-center justify-center space-x-2 hover:bg-yellow-300 hover:text-black transition-colors w-full md:w-auto md:mr-auto"
              >
                <span>{translatedContent.sendMessage}</span>
                <Send className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative h-[500px] lg:h-[600px] block -ml-0 lg:-ml-12 order-1 lg:order-2"
          >
            <Globe disableInteractionOnMobile={true} />
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 md:bottom-0 md:right-0 md:left-auto md:transform-none bg-black bg-opacity-80 p-4 border-4 border-pink-500 w-[280px] md:w-auto text-center md:text-left">
              <p className="font-mono text-sm">
                {translatedContent.projectsAcross}
                <br />
                <span className="text-pink-500 font-bold text-xl">{translatedContent.countries}</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;