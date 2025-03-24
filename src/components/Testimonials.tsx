import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Emilio R.',
    role: 'CEO at TechFlow',
    image: '',
    quote: 'Yuang is great at his work, an excellent communicator, and works very fast. Got the WordPress theme install and site redesign done very quickly. Will hire again in the future.',
    company: 'El Brifin'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Creative Director',
    image: '',
    quote: 'The level of creativity and technical expertise Yuang brings to projects is exceptional. They delivered a website that perfectly captures our brand essence.',
    company: 'Design Studio X'
  },
  {
    name: 'Emily Thompson',
    role: 'Product Manager',
    image: '',
    quote: "Yuang's ability to translate complex requirements into elegant solutions is remarkable. They're not just a developer, but a true partner in success.",
    company: 'InnovateTech'
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Client Testimonials</h2>
          <p className="text-lg font-mono text-gray-400">
            What people are saying about working with me
          </p>
        </motion.div>

        {/* Changed from grid to flex with overflow for horizontal scrolling on smaller screens */}
        <div className="flex overflow-x-auto pb-6 gap-8 lg:grid lg:grid-cols-3 lg:overflow-visible scrollbar-hide">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-900 p-6 rounded-none border-4 border-pink-500 relative group flex-shrink-0 w-[85vw] sm:w-[40vw] md:w-[30vw] lg:w-auto"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -top-6 left-6"
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-none border-4 border-black object-cover"
                />
              </motion.div>

              <Quote 
                size={40} 
                className="text-pink-500 mb-4 transform -scale-x-100" 
              />

              <p className="text-lg mb-6 font-mono">
                "{testimonial.quote}"
              </p>

              <div className="border-t-2 border-gray-800 pt-4">
                <p className="font-bold text-lg">{testimonial.name}</p>
                <p className="text-pink-500 font-mono">{testimonial.role}</p>
                <p className="text-gray-400 font-mono text-sm">{testimonial.company}</p>
              </div>

              <motion.div
                className="absolute -bottom-2 -right-2 w-full h-full border-4 border-yellow-300 -z-10"
                initial={false}
                whileHover={{ 
                  x: 8,
                  y: 8,
                  transition: { duration: 0.2 }
                }}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Optional: Add scroll indicators for mobile */}
        <div className="flex justify-center mt-6 gap-2 lg:hidden">
          {testimonials.map((_, index) => (
            <div 
              key={index} 
              className="w-2 h-2 rounded-full bg-gray-600"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;