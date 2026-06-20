import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import ProviderNavbar from "../../components/ProviderNavbar";
import { LogOut, User, Mail, Shield, Phone } from 'lucide-react';

function ProviderProfile() {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({});

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await api.get("provider/details/list/");
                setProfileData(response.data);
                console.log("Fetched provider profile data:", response.data);
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

    return (
       <div className="min-h-screen bg-white flex flex-col font-sans antialiased">
    <ProviderNavbar />

    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 bg-white">

        {/* Page Header */}
        <div className="mb-12 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Your Profile
            </h1>
            <p className="text-lg text-gray-600">
                Manage your account settings and professional information
            </p>
        </div>

        {/* Profile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 bg-white">

            {/* Left Column: Avatar & Quick Actions */}
            <div className="lg:col-span-1 w-60 bg-transparent">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 sticky top-8">
                    
                    {/* Avatar */}
                    <div className="flex flex-col items-center  text-center bg-white">
                        <div className="w-24 h-24 bg-linear-to-br from-gray-900 to-black text-white flex items-center justify-center font-bold text-3xl rounded-xl mb-5 shadow-md">
                            {userInitial}
                        </div>
                        
                        {/* Username */}
                        <h2 className="text-2xl font-bold text-gray-900 text-center">
                            {profileData.username}
                        </h2>
                        
                        {/* Role Badge */}
                        <div className="mt-3 px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            {profileData.role}
                        </div>

                        {/* Verification Status */}
                        {profileData.is_verified && (
                            <div className="mt-3 flex items-center gap-1 text-emerald-600 text-sm font-semibold">
                                <span>✓</span>
                                <span>Verified</span>
                            </div>
                        )}
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

                            {/* Role/Access Field */}
                            <div className="px-6 py-5 flex items-start justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-3 flex-1">
                                    <Shield size={18} className="text-gray-400 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                            Account Role
                                        </p>
                                        <div className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                            {profileData.role}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Professional Statistics Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Professional Stats</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            
                            {/* Category Card */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Category
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                    {profileData.category || "—"}
                                </p>
                            </div>

                            {/* Rating Card */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Rating
                                </p>
                                <div className="flex items-center gap-1">
                                    <span className="text-lg font-bold text-amber-600">
                                        {profileData.rating || "—"}
                                    </span>
                                    <span className="text-amber-400">★</span>
                                </div>
                            </div>

                            {/* Completed Jobs Card */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Jobs Completed
                                </p>
                                <p className="text-lg font-bold text-emerald-600">
                                    {profileData.total_jobs_completed || 0}
                                </p>
                            </div>

                            {/* Verification Status Card */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Status
                                </p>
                                <div className="flex items-center gap-1.5">
                                    {profileData.is_verified ? (
                                        <>
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                            <span className="text-sm font-bold text-emerald-600">Verified</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                            <span className="text-sm font-bold text-amber-600">Pending</span>
                                        </>
                                    )}
                                </div>
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

export default ProviderProfile;