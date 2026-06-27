import React, { useState } from "react";
import { VoiceOverlay } from "@/components/VoiceOverlay";
import { SilentSOS } from "@/components/SilentSOS";
import { GoogleMap } from "@/components/GoogleMap";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { SafeRoutes } from "@/components/SafeRoutes";
import { supabase } from "@/lib/supabase";

function App() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [needsHelp, setNeedsHelp] = useState(false);

  const handleVoiceResponse = async (response: boolean) => {
    setNeedsHelp(response);

    if (response) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const { data: contacts, error } = await supabase
          .from("emergency_contacts")
          .select("*")
          .eq("user_id", session?.user?.id);

        if (error) throw error;

        if (contacts && contacts.length > 0) {
          // Get live location
          let locationString = "Live Location: https://www.google.com/maps?q=28.6139,77.2090 (Simulated)";
          try {
            if (navigator.geolocation) {
              const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 15000 });
              });
              locationString = `Live Location: https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
            }
          } catch (e) {
            console.error("Geolocation error, using simulated location:", e);
          }

          // Twilio credentials from environment
          const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
          const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
          const twilioPhone = '+16592215971';
          
          let successCount = 0;

          // Send SMS to each contact
          for (const contact of contacts) {
            try {
              const res = await fetch(`/twilio-api/2010-04-01/Accounts/${accountSid}/Messages.json`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`)
                },
                body: new URLSearchParams({
                  To: contact.phone,
                  From: twilioPhone,
                  Body: `URGENT (Aura Safety Engine): I need help! ${locationString} Please contact me immediately.`
                })
              });
              
              if (res.ok) {
                successCount++;
              } else {
                const errorData = await res.json();
                console.error(`Twilio API Error for ${contact.phone}:`, errorData);
                const errorMessage = errorData.detail || errorData.message || 'Unknown error';
                alert(`Twilio Error for ${contact.phone}:\n${errorMessage}\n\n(This means your Twilio Account SID or Auth Token is incorrect in the code!)`);
              }
            } catch (err) {
              console.error(`Failed to send SMS to ${contact.phone}`, err);
            }
          }

          if (successCount > 0) {
            alert(`Emergency alerts (SMS) have been sent to ${successCount} of your contacts via Twilio!`);
          } else {
            // Error alert already handled in the loop for specific reasons
          }
        } else {
          alert(
            "No emergency contacts found. Please add emergency contacts below."
          );
        }
      } catch (error) {
        console.error("Error sending emergency alerts:", error);
        alert("System error sending alerts.");
      }
    }

    setShowOverlay(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {showOverlay && <VoiceOverlay onResponse={handleVoiceResponse} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Silent SOS */}
        <SilentSOS />

        {/* Community Watch with Google Map */}
        <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold text-white">
              Community Watch
            </h3>
          </div>

          <div className="h-80 rounded-lg overflow-hidden">
            <GoogleMap apiKey="AIzaSyAVQ9f3kL82FIsZgB4_eH2paS0rIzUo8r8" />
          </div>

          <div className="mt-4 text-center">
            <h4 className="text-white font-medium">Interactive Safety Map</h4>
            <p className="text-gray-400 text-sm">Real-time incident tracking</p>
          </div>
        </div>
      </div>

      {/* Safe Routes */}
      <div className="mb-6">
        <SafeRoutes />
      </div>

      {/* Emergency Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmergencyContacts />

        {/* Additional sections can be added here */}
        <div className="grid grid-cols-2 gap-4">
          {/* Visitor Protocols */}
          <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <h4 className="font-semibold text-white text-sm">
                Visitor Protocols
              </h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Registration</span>
                <span className="text-xs text-green-400 bg-green-400 bg-opacity-20 px-2 py-1 rounded">
                  active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">ID Verification</span>
                <span className="text-xs text-green-400 bg-green-400 bg-opacity-20 px-2 py-1 rounded">
                  active
                </span>
              </div>
            </div>
          </div>

          {/* Child Guardian */}
          <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <h4 className="font-semibold text-white text-sm">
                Child Guardian
              </h4>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-300">Safe Play Zones</p>
              <p className="text-xs text-gray-400">
                Monitored areas with child-friendly safety measures
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
