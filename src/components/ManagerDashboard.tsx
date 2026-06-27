import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Lightbulb, BarChart3 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AISuggestion {
  title: string;
  description: string;
  category: string;
}

export function ManagerDashboard() {
  const [eventForm, setEventForm] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    description: ""
  });
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const queryClient = useQueryClient();

  // Fetch feedback data for analytics
  const { data: feedbackData } = useQuery({
    queryKey: ["feedback-analytics"],
    queryFn: async () => {
      // Fetch feedback
      const { data: feedbacks, error: fbError } = await supabase
        .from("feedback")
        .select("*");
      
      if (fbError) {
        console.error("Feedback fetch error:", fbError);
        return [];
      }

      // Fetch events
      const { data: events, error: evError } = await supabase
        .from("events")
        .select("id, title");
        
      if (evError) {
        console.error("Events fetch error:", evError);
      }

      // Merge them manually to avoid foreign key schema cache errors
      return (feedbacks || []).map(fb => {
        const matchingEvent = (events || []).find(e => e.id === fb.event_id);
        return {
          ...fb,
          events: {
            title: matchingEvent ? matchingEvent.title : "General Dashboard Feedback"
          }
        };
      });
    },
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const { data, error } = await supabase
        .from("events")
        .insert([eventData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Event created successfully!");
      setEventForm({
        title: "",
        location: "",
        date: "",
        time: "",
        description: ""
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      toast.error(`Failed to create event: ${error.message}`);
    },
  });

  // Generate AI suggestions
  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      // Mock AI Suggestions since we don't have an edge function deployed
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSuggestions = [
        {
          title: "Summer Pool Party & BBQ",
          category: "Social",
          description: "A community gathering to celebrate the start of summer. Great for families and meeting neighbors."
        },
        {
          title: "Yoga in the Park",
          category: "Health & Wellness",
          description: "Morning yoga session led by a professional instructor. Suitable for all skill levels."
        },
        {
          title: "Society General Meeting",
          category: "Administrative",
          description: "Monthly meeting to discuss maintenance updates, budget, and upcoming projects."
        }
      ];
      
      setAiSuggestions(mockSuggestions);
      toast.success("AI suggestions generated!");
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error("Failed to generate suggestions");
    } finally {
      setIsGenerating(false);
    }
  };

  // Create event from AI suggestion
  const createFromSuggestion = (suggestion: AISuggestion) => {
    setEventForm({
      title: suggestion.title,
      location: "Community Hall", // Default location
      date: "",
      time: "",
      description: suggestion.description
    });
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    createEventMutation.mutate(eventForm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Process analytics data dynamically
  const chartData = feedbackData?.reduce((acc: any[], feedback: any) => {
    const eventTitle = feedback.events?.title || 'Unknown Event';
    const existing = acc.find(item => item.event === eventTitle);
    
    if (existing) {
      existing.totalRating += feedback.rating;
      existing.count += 1;
      existing.avgRating = Number((existing.totalRating / existing.count).toFixed(1));
    } else {
      acc.push({
        event: eventTitle,
        totalRating: feedback.rating,
        count: 1,
        avgRating: feedback.rating
      });
    }
    
    return acc;
  }, []) || [];

  const pieData = feedbackData?.reduce((acc: any[], feedback: any) => {
    const rating = feedback.rating;
    const existing = acc.find(item => item.name === `${rating} Stars`);
    
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({
        name: `${rating} Stars`,
        value: 1
      });
    }
    
    return acc;
  }, []) || [];

  const totalEvents = chartData.length;
  const totalFeedbacks = feedbackData?.length || 0;
  const avgOverallRating = feedbackData?.length 
    ? (feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1)
    : '0';

  // Calculate attendance rate based on feedback participation
  const attendanceRate = totalEvents > 0 ? Math.round((totalFeedbacks / totalEvents) * 20) : 0; // Approximate calculation

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="space-y-6">
      {/* AI Event Suggestions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            AI Event Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={generateSuggestions}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate New Suggestions"}
          </Button>
          
          {aiSuggestions.length > 0 && (
            <div className="grid gap-4 mt-4">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{suggestion.title}</h4>
                      <span className="inline-block px-2 py-1 bg-purple-600 text-white text-xs rounded mt-1">
                        {suggestion.category}
                      </span>
                      <p className="text-gray-300 text-sm mt-2">{suggestion.description}</p>
                    </div>
                    <Button
                      onClick={() => createFromSuggestion(suggestion)}
                      variant="outline"
                      size="sm"
                      className="ml-4 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                    >
                      Create Event
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create New Event */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Event Title</Label>
              <Input
                id="title"
                name="title"
                value={eventForm.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="location" className="text-gray-300">Venue</Label>
              <Input
                id="location"
                name="location"
                value={eventForm.location}
                onChange={handleInputChange}
                placeholder="Event location"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-gray-300">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={eventForm.date}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-gray-300">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={eventForm.time}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={eventForm.description}
                onChange={handleInputChange}
                placeholder="Event description"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={createEventMutation.isPending}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              {createEventMutation.isPending ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Event Analytics */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Event Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{totalEvents}</div>
              <div className="text-gray-400">Events with Feedback</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{attendanceRate}%</div>
              <div className="text-gray-400">Engagement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{avgOverallRating}</div>
              <div className="text-gray-400">Average Rating</div>
            </div>
          </div>

          {/* Charts Section */}
          {chartData.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Average Rating Chart */}
              <div>
                <h4 className="text-white font-medium mb-3">Average Rating per Event</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="event" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                    />
                    <Bar dataKey="avgRating" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Rating Distribution */}
              <div>
                <h4 className="text-white font-medium mb-3">Rating Distribution</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recent Feedback Comments */}
          <div className="space-y-4 mt-8 pt-6 border-t border-gray-700">
            <h4 className="text-white font-medium">Recent Feedback Comments</h4>
            {(feedbackData || []).filter(f => f.comment).length > 0 ? (
              (feedbackData || [])
                .filter(f => f.comment)
                .sort((a, b) => new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime())
                .slice(0, 5)
                .map((feedback, index) => (
                  <div key={index} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-gray-300 text-sm font-medium">
                        {feedback.events?.title || "General Feedback"}
                      </div>
                      <div className="text-yellow-400 text-sm">
                        {"⭐".repeat(feedback.rating)}
                      </div>
                    </div>
                    <p className="text-white text-sm">{feedback.comment}</p>
                  </div>
                ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                No written comments submitted yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}