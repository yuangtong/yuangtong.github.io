import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import Globe from './Globe';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [otherReason, setOtherReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('Inquiry');

  const contactReasons = ['Inquiry', 'Quote', 'General message', 'Other'];

  if (submitted) {
    return (
      <section id="contact" className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-5xl font-bold mb-8">Thank You!</h2>
            <p className="font-mono text-xl">
              Your message has been received. I'll get back to you soon!
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
            className="max-w-2xl"
          >
            <h2 className="text-5xl font-bold mb-8">Let's Work Together!</h2>
            <p className="font-mono text-xl mb-12">
              Have a project in mind? Let's create something amazing.
            </p>

            <form
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="contact" />
              <div className="hidden">
                <input name="bot-field" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  className="w-full p-4 bg-white border-4 border-pink-500 text-black font-mono placeholder-gray-500 focus:outline-none focus:border-yellow-300"
                />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full p-4 bg-white border-4 border-pink-500 text-black font-mono placeholder-gray-500 focus:outline-none focus:border-yellow-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-sm">Reason for Contact</label>
                <select
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
                    placeholder="Please specify"
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
                placeholder="Your Message"
                required
                className="w-full p-4 bg-white border-4 border-pink-500 text-black font-mono placeholder-gray-500 focus:outline-none focus:border-yellow-300"
              />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-pink-500 text-white px-8 py-4 border-4 border-white font-bold text-lg flex items-center justify-center space-x-2 hover:bg-yellow-300 hover:text-black transition-colors"
              >
                <span>Send Message</span>
                <Send className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative h-[400px] lg:h-[600px] block -ml-0 lg:-ml-12"
          >
            <Globe />
            <div className="absolute bottom-0 right-0 bg-black bg-opacity-80 p-4 border-4 border-pink-500">
              <p className="font-mono text-sm">
                Projects completed across
                <br />
                <span className="text-pink-500 font-bold text-xl">7 countries</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;