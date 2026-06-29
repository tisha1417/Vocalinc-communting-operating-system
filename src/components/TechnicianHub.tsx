import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Technician {
  id: string;
  name: string;
  status: string;
  specialty?: string;
  created_at?: string;
}

interface TechnicianHubProps {
  refreshTrigger?: number;
}

export const TechnicianHub = ({ refreshTrigger }: TechnicianHubProps) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [newTechName, setNewTechName] = useState("");
  const [newTechSpecialty, setNewTechSpecialty] = useState("General");
  const [activeTickets, setActiveTickets] = useState<any[]>([]);

  useEffect(() => {
    fetchTechnicians();
    fetchTickets();
  }, [refreshTrigger]);

  const fetchTickets = async () => {
    const { data } = await supabase.from('tickets').select('*').eq('status', 'open');
    setActiveTickets(data || []);
  };

  const fetchTechnicians = async () => {
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching technicians:', error);
    } else {
      setTechnicians(data || []);
    }
  };

  const handleAddTechnician = async () => {
    if (!newTechName) return;
    
    await supabase.from('technicians').insert({
      name: newTechName,
      specialty: newTechSpecialty,
      status: 'available'
    });
    
    setNewTechName("");
    fetchTechnicians();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'busy':
        return 'secondary';
      case 'offline':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getDerivedStatus = (technician: Technician) => {
    return technician.status;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="h-5 w-5 text-accent" />
              Add Technician
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                placeholder="Technician Name" 
                value={newTechName} 
                onChange={(e) => setNewTechName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <Select value={newTechSpecialty} onValueChange={setNewTechSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="HVAC">HVAC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddTechnician} className="w-full">Add Technician</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-accent" />
              Active Allocations Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-card rounded-lg border">
                <span className="text-sm font-medium">Total Technicians</span>
                <span className="font-bold text-lg">{technicians.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Currently Busy</span>
                <span className="font-bold text-lg text-yellow-700 dark:text-yellow-400">
                  {technicians.filter(t => getDerivedStatus(t) === 'busy').length}
                </span>
              </div>
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Current Work</h4>
                {activeTickets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active work.</p>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {activeTickets.map(ticket => (
                      <div key={ticket.id} className="text-sm border-l-2 border-primary pl-3 py-1">
                        <span className="font-medium">{ticket.technician_name}</span> is working on <span className="text-muted-foreground">{ticket.complaint}</span> at {ticket.building}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Technician Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {technicians.map((technician) => {
            const derivedStatus = getDerivedStatus(technician);
            return (
            <div
              key={technician.id}
              className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                    {getInitials(technician.name)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(derivedStatus)}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{technician.name}</h3>
                  <div className="text-xs text-muted-foreground mt-0.5">{technician.specialty || 'General'}</div>
                  <Badge 
                    variant={getStatusBadgeVariant(derivedStatus)}
                    className="text-xs mt-1"
                  >
                    {derivedStatus}
                  </Badge>
                </div>
              </div>
            </div>
          )})}
        </div>
        
        {technicians.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No technicians found
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
};
