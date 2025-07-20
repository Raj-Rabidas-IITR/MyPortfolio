'use client';

import React, { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSent, setIsSent] = useState(false);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      .then(
        () => {
          setIsSent(true);
          form.current?.reset();
          toast.success('Message sent successfully! ✅', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'dark',
          });
        },
        (error) => {
          console.error(error);
          toast.error('Failed to send message. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'dark',
          });
        }
      );
  };

  return (
    <section
      id='contact'
      className='flex flex-col items-center justify-center py-30 px-[12vw] md:px-[7vw] lg:px-[20vw]'
    >
      <ToastContainer />

      {/* Section Title */}
      <div className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-white'>CONTACT</h2>
        <div className='w-40 h-1 bg-cyan-500 mx-auto mt-4'></div>
        <p className='text-gray-400 mt-5 text-lg font-semibold'>
          I'd love to hear from you — reach out for any opportunities or questions!
        </p>
      </div>

      {/* Contact Form */}
      <div className='mt-10 w-full max-w-md bg-[#0d081f] p-6 rounded-lg shadow-lg border border-gray-700'>
        <h3 className='text-xl font-semibold text-white text-center'>
          Connect With Me
        </h3>
        <form ref={form} onSubmit={sendEmail} className='mt-4 flex flex-col space-y-4'>
          <input
            type='email'
            name='user_email'
            placeholder='Your Email'
            required
            className='w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-cyan-400'
          />
          <input
            type='text'
            name='user_name'
            placeholder='Your Name'
            required
            className='w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-cyan-400'
          />
          <input
            type='text'
            name='subject'
            placeholder='Subject'
            required
            className='w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-cyan-400'
          />
          <textarea
            name='message'
            rows={4}
            placeholder='Message'
            className='w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-cyan-400'
          ></textarea>

          <button
            type='submit'
            className='w-full bg-gradient-to-r from-cyan-400 to-purple-500 py-3 text-white font-semibold rounded-md hover:opacity-70 transition transform duration-300 hover:scale-105'
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
