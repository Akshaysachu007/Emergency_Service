import {useState, useEffect} from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import CustomerNavbar from "../../components/CustomerNavbar";
import { LogOut, User, Mail, Shield, Phone } from 'lucide-react';

function CustomerProfile()  {
      const navigate = useNavigate();
      const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        role: "",
        phone: ""
      });
      const [profiledetailsData, setProfiledetailsData] = useState({});

      useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await api.get("/customer/details/profile/");
                setProfileData(response.data);
                console.log("Fetched profile data:", response.data);

                const dataResponse = await api.get("/customer/profile/data/");
                setProfiledetailsData(dataResponse.data);
                console.log("Fetched profile data:", dataResponse.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchProfileData();
      }, []);

      const userInitial = profileData?.username?.charAt(0).toUpperCase() || 'U';

      const handleLogout = () => {
        navigate("/"); // Redirect to login page after logout
      }

      return(
       <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
    <CustomerNavbar />

    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Page Header */}
        <div className="mb-12 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Your Profile
            </h1>
            <p className="text-lg text-gray-600">
                Manage your account settings and personal information
            </p>
        </div>

        {/* Profile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Left Column: Avatar & Quick Actions */}
            <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 sticky top-8">
                    
                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-linear-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center font-bold text-3xl rounded-xl mb-5 shadow-md">
                            {userInitial}
                        </div>
                        
                        {/* Username */}
                        <h2 className="text-2xl font-bold text-gray-900 text-center">
                            {profileData.username}
                        </h2>
                        
                        {/* Customer Badge */}
                        <div className="mt-3 px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            {profileData.role}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gray-200 my-6" />

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 font-semibold rounded-lg transition-all duration-200 active:scale-95"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Right Column: Profile Information */}
            <div className="lg:col-span-3">
                <div className="space-y-6">

                    {/* Account Information Section */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
                        </div>

                        <div className="divide-y divide-gray-100">
                            
                            {/* Name Field */}
                            <div className="px-6 py-5 flex items-start justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-3 flex-1">
                                    <User size={18} className="text-gray-400 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                            Full Name
                                        </p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {profileData.username}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="px-6 py-5 flex items-start justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-3 flex-1">
                                    <Mail size={18} className="text-gray-400 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                            Email Address
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 break-all">
                                            {profileData.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div className="px-6 py-5 flex items-start justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-3 flex-1">
                                    <Phone size={18} className="text-gray-400 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                            Phone Number
                                        </p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {profileData.phone || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Type Field */}
                            <div className="px-6 py-5 flex items-start justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-3 flex-1">
                                    <Shield size={18} className="text-gray-400 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                            Account Type
                                        </p>
                                        <div className="inline-flex px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                            {profileData.role}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Account Statistics Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Activity</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            
                            {/* Total Requests Card */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Total Requests
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {profiledetailsData.total_requests || 0}
                                </p>
                            </div>

                            {/* Completed Orders Card */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Completed
                                </p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {profiledetailsData.completed_requests || 0}
                                </p>
                            </div>

                            {/* Active Orders Card */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Active Orders
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {profiledetailsData.active_requests || 0}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Details</h3>
                        <div className="space-y-4">
                            
                            {/* Member Since */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-600">Member Since</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {profileData.created_at 
                                        ? new Date(profileData.created_at).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })
                                        : "—"
                                    }
                                </p>
                            </div>

                            {/* Account Status */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-600">Account Status</p>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    <span className="text-sm font-semibold text-emerald-600">Active</span>
                                </div>
                            </div>

                            {/* Notification Preference */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-600">Email Notifications</p>
                                <span className="text-sm font-semibold text-gray-900">Enabled</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        </div>

    </main>
</div>
      )


}

export default CustomerProfile;