'use client';

import React, { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(form.current!);
    const subject = formData.get('subject') as string;
    const messageText = formData.get('message') as string;
    
    const data = {
      name: formData.get('user_name') as string,
      email: formData.get('user_email') as string,
      message: `Subject: ${subject}\n\n${messageText}`,
    };

    try {
      setIsSending(true);

      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('Message sent successfully! We will get back to you soon.', { 
          position: 'top-right', 
          theme: 'dark' 
        });
        form.current?.reset();
      } else {
        throw new Error(result.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message. Please try again.', { 
        position: 'top-right', 
        theme: 'dark' 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section
      id='contact'
      className='flex flex-col items-center justify-center py-30 px-[12vw] md:px-[7vw] lg:px-[20vw]'
    >
      <ToastContainer />

      <div className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-white'>CONTACT</h2>
        <div className='w-40 h-1 bg-cyan-500 mx-auto mt-4'></div>
        <p className='text-gray-400 mt-5 text-lg font-semibold'>
          Id love to hear from you — reach out for any opportunities or questions!
        </p>
      </div>

      <div className='mt-10 w-full max-w-md bg-[#0d081f] p-6 rounded-lg shadow-lg border border-gray-700'>
        <h3 className='text-xl font-semibold text-white text-center'>Connect With Me</h3>
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
            disabled={isSending}
            className='w-full bg-gradient-to-r from-cyan-400 to-purple-500 py-3 text-white font-semibold rounded-md hover:opacity-80 transition transform duration-300 hover:scale-105 disabled:opacity-50'
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
