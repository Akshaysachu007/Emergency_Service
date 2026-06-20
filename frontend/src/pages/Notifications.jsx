import { useEffect, useState } from "react";
import api from "../api/axios";
import ProviderNavbar from "../components/ProviderNavbar";
import CustomerNavbar from "../components/CustomerNavbar";




function Notifications() {
    const [notifications , setNotifications] = useState([]);
    const [loading , setLoading] = useState(false);
    const [role , setRole] = useState("");


    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const response = await api.get("/notifications/");
                setNotifications(response.data);
                console.log(response.data);

                const roleResponse = await api.get("/current/user");
                setRole(roleResponse.data.role);
                console.log("User role:", roleResponse.data.role);

                if (response.data.length > 0){
                    const markReadResponse = await api.post("/mark/notifications/read/");
                    console.log("Notifications marked as read:", markReadResponse.data);
                }
            } catch (error) {
                console.log("Failed to fetch notifications:", error);
                alert("Failed to fetch notifications. Please try again.");
            }finally{
                setLoading(false);
            }
        }
        fetchNotifications();
    }, []);

   

   return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
    <div>
        {role === 'provider' ? (
            <ProviderNavbar />
        ) : (
            <CustomerNavbar />
        )}
    </div>

    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Page Header */}
        <div className="mb-10 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Notifications
            </h1>
            <p className="text-lg text-gray-600">
                Stay updated with your service requests and activities
            </p>
        </div>

        {/* Notifications Container */}
        <div>
            {loading ? (
                /* Loading State */
                <div className="py-20 flex flex-col justify-center items-center gap-4">
                    <div className="w-10 h-10 border-3 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Loading notifications...</p>
                </div>
            ) : notifications.length === 0 ? (
                /* Empty State */
                <div className="py-20 text-center bg-white border border-dashed border-gray-300 rounded-lg">
                    <div className="text-4xl mb-3">🔔</div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">No Notifications</p>
                    <p className="text-sm text-gray-600">
                        You're all caught up! Check back later for updates.
                    </p>
                </div>
            ) : (
                /* Notifications List */
                <div className="space-y-3">
                    {notifications.map((notification) => {
                        // Determine notification type and styling
                        const notificationType = notification.type || 'info';
                        const isUnread = !notification.is_read;
                        
                        const typeConfig = {
                            success: {
                                icon: '✓',
                                color: 'emerald',
                                bgColor: 'bg-emerald-50',
                                borderColor: 'border-emerald-200',
                                iconBg: 'bg-emerald-100'
                            },
                            warning: {
                                icon: '⚠',
                                color: 'amber',
                                bgColor: 'bg-amber-50',
                                borderColor: 'border-amber-200',
                                iconBg: 'bg-amber-100'
                            },
                            error: {
                                icon: '✕',
                                color: 'red',
                                bgColor: 'bg-red-50',
                                borderColor: 'border-red-200',
                                iconBg: 'bg-red-100'
                            },
                            info: {
                                icon: 'ℹ',
                                color: 'blue',
                                bgColor: 'bg-blue-50',
                                borderColor: 'border-blue-200',
                                iconBg: 'bg-blue-100'
                            }
                        };

                        const config = typeConfig[notificationType] || typeConfig.info;

                        return (
                            <div
                                key={notification.id}
                                className={`border rounded-lg p-5 transition-all duration-300 hover:shadow-md cursor-pointer ${
                                    isUnread
                                        ? `${config.bgColor} border-${config.color}-300 shadow-sm`
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex gap-4">
                                    {/* Icon Section */}
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${config.iconBg} text-${config.color}-700`}>
                                        {config.icon}
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className={`text-base font-semibold ${isUnread ? 'text-gray-900' : 'text-gray-800'}`}>
                                                {notification.title}
                                            </h3>
                                            {isUnread && (
                                                <span className="flex-shrink-0 w-2.5 h-2.5 bg-blue-600 rounded-full mt-2"></span>
                                            )}
                                        </div>

                                        <p className={`text-sm leading-relaxed mb-3 ${isUnread ? 'text-gray-700' : 'text-gray-600'}`}>
                                            {notification.message}
                                        </p>

                                        {/* Timestamp */}
                                        <p className="text-xs text-gray-500 font-medium">
                                            {new Date(notification.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })} at {new Date(notification.created_at).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

    </main>
</div>
   );





}

export default Notifications;