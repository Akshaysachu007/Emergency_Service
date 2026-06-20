import ProviderNavbar from "../../components/ProviderNavbar";
import { useEffect } from "react";
import api from "../../api/axios";


function ProviderDashboard() {

      useEffect(() => {
         navigator.geolocation.getCurrentPosition( async(position) => {
            try{
              const fetchLocationResponse = await api.patch("/provider/location/", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
              console.log("Location updated successfully:", fetchLocationResponse.data);
            } catch (error) {
              console.error("Error updating location:", error);
            }
         })
      },[]);




    return (
        <div className="min-h-screen bg-white flex flex-col font-sans antialiased selection:bg-black selection:text-white">
            {/* Global Modern Navigation Bar */}
            <ProviderNavbar />
            
            {/* Main Center Stage */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
                
                {/* Visual Identity Wrapper with Smooth Upward Reveal */}
                <div className="max-w-2xl text-center transform transition-all duration-700 animate-fade-in-up">
                    
                    {/* Pulsing Active System Indicator Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold bg-black text-white rounded-full tracking-wider uppercase mb-6 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Platform
                    </span>

                    {/* Premium Bold Branding Title */}
                    <h1 className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tighter mb-4">
                        Welcome to{" "}
                        <span className="from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-black hover:scale-105 transition-transform duration-500 inline-block cursor-default">
                            Nimble
                        </span>
                    </h1>
                    
                    {/* Minimalist Context Subtitle */}
                    <div className="max-w-md mx-auto">
                        <p className="text-base sm:text-lg text-gray-500 font-medium leading-relaxed">
                            Request Emergency Service and Track Your Requests with absolute precision.
                        </p>
                    </div>

                    {/* Dynamic Graphic Accent Line */}
                    <div className="mt-8 flex justify-center gap-1 opacity-40">
                        <span className="h-1 w-8 bg-gray-900 rounded-full" />
                        <span className="h-1 w-2 bg-gray-600 rounded-full" />
                        <span className="h-1 w-1 bg-gray-400 rounded-full" />
                    </div>

                </div>
            </div>
        </div>
    )
}
export default ProviderDashboard;