import React, { useState, useEffect } from 'react';
import { Plus, Trash2, User, Phone, Mail } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface Contact {
  id?: string;
  name: string;
  phone: string;
  email: string;
  user_id?: string;
}

export const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [formData, setFormData] = useState<Contact>({ name: '', phone: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile) {
      fetchContacts();
    }
  }, [profile]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contacts.length >= 3) {
      alert('Maximum of 3 emergency contacts allowed');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .insert([{ ...formData, user_id: profile?.id }]);

      if (error) throw error;

      setFormData({ name: '', phone: '', email: '' });
      setShowForm(false);
      fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Error saving contact. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Emergency Contacts</h3>
        {contacts.length < 3 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
              placeholder="email@example.com"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              {isLoading ? 'Saving...' : 'Add Contact'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-slate-700 bg-opacity-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-white">{contact.name}</h4>
              <p className="text-sm text-gray-300">{contact.phone}</p>
              <p className="text-sm text-gray-400">{contact.email}</p>
            </div>
            <button
              onClick={() => contact.id && handleDelete(contact.id)}
              className="text-red-400 hover:text-red-300 p-2 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {contacts.length === 0 && (
          <p className="text-gray-400 text-center py-4">No emergency contacts added yet</p>
        )}
      </div>

      {contacts.length >= 3 && (
        <p className="text-amber-400 text-sm mt-4 text-center">
          Maximum of 3 emergency contacts reached
        </p>
      )}
    </div>
  );
};