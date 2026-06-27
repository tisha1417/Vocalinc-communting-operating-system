import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import emailjs from 'emailjs-com';

export const SilentSOS: React.FC = () => {
  const [isActivating, setIsActivating] = useState(false);

  const sendEmergencyAlerts = async () => {
    setIsActivating(true);
    
    try {
      // Fetch emergency contacts
      const { data: contacts, error } = await supabase
        .from('emergency_contacts')
        .select('*');

      if (error) throw error;

      if (contacts && contacts.length > 0) {
        // Initialize EmailJS (you'll need to set up your EmailJS account)
        emailjs.init("your_emailjs_user_id"); // Replace with your EmailJS user ID

        // Send email to each contact
        for (const contact of contacts) {
          const templateParams = {
            to_name: contact.name,
            to_email: contact.email,
            from_name: 'Aura Safety Engine',
            message: `EMERGENCY ALERT: Your contact has activated a Silent SOS. This is an automated emergency notification. Please check on them immediately.`,
            timestamp: new Date().toLocaleString()
          };

          try {
            await emailjs.send(
              'your_service_id', // Replace with your EmailJS service ID
              'your_template_id', // Replace with your EmailJS template ID
              templateParams
            );
          } catch (emailError) {
            console.error('Error sending email to', contact.email, emailError);
          }
        }

        alert('Emergency alerts sent successfully!');
      } else {
        alert('No emergency contacts found. Please add emergency contacts first.');
      }
    } catch (error) {
      console.error('Error sending emergency alerts:', error);
      alert('Error sending emergency alerts. Please try again.');
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-2xl p-6 border border-red-700">
      <div className="flex items-center gap-3 mb-4">
        <Phone className="w-6 h-6 text-red-300" />
        <h3 className="text-xl font-semibold text-white">Silent SOS</h3>
      </div>

      <div className="text-center">
        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <Phone className="w-12 h-12 text-white" />
        </div>

        <h4 className="text-lg font-semibold text-white mb-2">Emergency Alert</h4>
        <p className="text-red-200 mb-6 text-sm">
          Silent distress signal - no sound, immediate response
        </p>

        <button
          onClick={sendEmergencyAlerts}
          disabled={isActivating}
          className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {isActivating ? 'Sending Alerts...' : 'Activate Silent SOS'}
        </button>
      </div>
    </div>
  );
};