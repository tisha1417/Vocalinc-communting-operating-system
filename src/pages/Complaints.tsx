import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, AlertCircle, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Ticket {
  id: string;
  complaint: string;
  building: string;
  flat_number?: string;
  date: string;
  priority: string;
  specialty?: string;
  technician_name: string;
  estimated_completion?: string;
  status: string;
  created_at?: string;
  user_id?: string;
}

const Complaints: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { profile, loading } = useAuth();
  const { toast } = useToast();
  
  // Form State
  const [complaint, setComplaint] = useState('');
  const [building, setBuilding] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [specialty, setSpecialty] = useState('General');

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, [profile]);

  const fetchTickets = async () => {
    let query = supabase.from('tickets').select('*');
    
    // If not admin, only show their own tickets
    if (profile && profile.role !== 'admin') {
      query = query.eq('user_id', profile.id);
    }
    
    const { data } = await query;
    if (data) {
      setTickets(data);
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'P1') return 'bg-red-500';
    if (priority === 'P2') return 'bg-orange-500';
    if (priority === 'P3') return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    // 1. Auto-assign technician based on specialty
    const { data: techs } = await supabase
      .from('technicians')
      .select('*')
      .eq('specialty', specialty)
      .eq('status', 'available');

    let assignedTech = 'Unassigned';
    let assignedTechId = null;

    if (techs && techs.length > 0) {
      // Pick a random available tech with this specialty
      const tech = techs[Math.floor(Math.random() * techs.length)];
      assignedTech = tech.name;
      assignedTechId = tech.id;

      // Mark them as busy
      await supabase.from('technicians').update({ status: 'busy' }).eq('id', tech.id);
    }

    let dynamicPriority = 'P3';
    if (complaint.toLowerCase().includes('fire')) {
      dynamicPriority = 'P1';
    } else if (complaint.toLowerCase().includes('leak') || complaint.toLowerCase().includes('water')) {
      dynamicPriority = 'P2';
    }

    const newTicket = {
      user_id: profile.id,
      complaint,
      building,
      flat_number: flatNumber,
      specialty,
      priority: dynamicPriority,
      date: new Date().toLocaleDateString(),
      technician_name: assignedTech,
      technician_id: assignedTechId,
      status: 'open',
      estimated_completion: 'Within 24 hours'
    };

    const { error } = await supabase.from('tickets').insert([newTicket]);

    if (!error) {
      toast({
        title: "Request Submitted!",
        description: `Your issue has been assigned to ${assignedTech}.`,
      });
      setComplaint('');
      setBuilding('');
      setFlatNumber('');
      fetchTickets();
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h1 className="text-2xl font-bold text-white">
          {profile?.role === 'admin' ? 'All Active Society Requests' : 'My Active Requests'}
        </h1>
        <p className="text-slate-400">Track the status and estimated completion of tickets.</p>
      </div>
      
      {/* User Issue Form */}
      {profile?.role !== 'admin' && (
        <Card className="bg-slate-800 border-slate-700 text-white mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              Report a New Issue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue Description</label>
                  <Input required value={complaint} onChange={e => setComplaint(e.target.value)} placeholder="e.g. Leaking pipe" className="bg-slate-700 border-slate-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Required Specialty</label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="HVAC">HVAC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Building / Block</label>
                  <Input required value={building} onChange={e => setBuilding(e.target.value)} placeholder="e.g. Block A" className="bg-slate-700 border-slate-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Flat Number / Floor</label>
                  <Input required value={flatNumber} onChange={e => setFlatNumber(e.target.value)} placeholder="e.g. 402" className="bg-slate-700 border-slate-600" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Submit Request</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tickets.filter(t => t.status === 'open').map(ticket => (
          <Card key={ticket.id} className="bg-slate-800 border-slate-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{ticket.complaint}</CardTitle>
              <Badge className={`${getPriorityColor(ticket.priority)}`}>{ticket.priority}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Location:</span>
                  <span>{ticket.building} {ticket.flat_number ? `- Flat ${ticket.flat_number}` : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Specialty:</span>
                  <span>{ticket.specialty || 'General'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Assigned To:</span>
                  <span>{ticket.technician_name}</span>
                </div>
                
                {/* Countdown Timer (Admin Only) */}
                {profile?.role === 'admin' && (
                  <div className="mt-4 p-3 bg-slate-700/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-medium">Estimated Time Remaining:</span>
                    </div>
                    <CountdownTimer createdAt={ticket.created_at} estimatedCompletion={ticket.estimated_completion} />
                  </div>
                )}
                
                {/* Mark as Solved Button (User Only) */}
                {profile?.role !== 'admin' && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <Button 
                      variant="outline" 
                      className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
                      onClick={async () => {
                        // 1. Mark ticket as closed
                        await supabase.from('tickets').update({ status: 'closed' }).eq('id', ticket.id);
                        
                        // 2. Release the technician back to the available pool
                        if (ticket.technician_id) {
                          await supabase.from('technicians').update({ status: 'available' }).eq('id', ticket.technician_id);
                        }

                        toast({ title: 'Issue marked as solved and technician released!' });
                        fetchTickets();
                      }}
                    >
                      Mark as Solved
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {tickets.filter(t => t.status === 'open').length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CountdownTimer: React.FC<{ createdAt?: string, estimatedCompletion?: string }> = ({ createdAt, estimatedCompletion }) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!createdAt || !estimatedCompletion) return 'Unknown';
      
      let hoursToAdd = 48;
      if (estimatedCompletion.includes('2 hours')) hoursToAdd = 2;
      else if (estimatedCompletion.includes('24 hours')) hoursToAdd = 24;
      
      const createdTime = new Date(createdAt).getTime();
      const targetTime = createdTime + (hoursToAdd * 60 * 60 * 1000);
      const now = new Date().getTime();
      
      const diff = targetTime - now;
      if (diff <= 0) return 'Overdue';
      
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${h}h ${m}m ${s}s`;
    };

    setTimeRemaining(calculateTimeRemaining());
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [createdAt, estimatedCompletion]);

  return <span className="font-mono text-indigo-400 font-bold">{timeRemaining}</span>;
};

export default Complaints;
