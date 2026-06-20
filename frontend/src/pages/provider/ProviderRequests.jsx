
import { useState, useEffect } from "react";
import api from "../../api/axios";
import ProviderNavbar from "../../components/ProviderNavbar";
import { Search } from "lucide-react";

function ProviderRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("pending");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    "provider/all-requests/"
                );

                setRequests(response.data);
                console.log("Fetched requests:", response.data);
            } catch (error) {
                console.log(error);
                alert("Failed to load requests");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const acceptRequest = async (requestId) => {
        try {
            await api.post(
                `requests/${requestId}/accept/`
            );

            setRequests((prev) =>
                prev.map((request) =>
                    request.id === requestId
                        ? {
                            ...request,
                            status: "accepted",
                        }
                        : request
                )
            );
        } catch (error) {
            console.log(error);
            alert("Failed to accept request");
        }
    };

    const completeRequest = async (requestId) => {
        try {
            await api.post(
                `requests/${requestId}/complete/`
            );

            setRequests((prev) =>
                prev.map((request) =>
                    request.id === requestId
                        ? {
                            ...request,
                            status: "completed",
                        }
                        : request
                )
            );
        } catch (error) {
            console.log(error);
            alert("Failed to complete request");
        }
    };

    const filteredRequests = requests.filter((request) => {
        const matchStatus =
            request.status === selectedStatus;

        const matchSearch =
            request.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            request.customer
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            request.category
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        return matchStatus && matchSearch;
    });

    return (
       <div className="min-h-screen bg-white font-sans antialiased ">
    <ProviderNavbar />

    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 bg-white">
        {/* Header Section */}
        <div className="flex flex-col  sm:flex-row sm:justify-between sm:items-end pb-6 border-b border-gray-200 gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Service Requests
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                    Manage and respond to customer service requests
                </p>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center w-full sm:w-72">
                <Search
                    size={16}
                    className="absolute left-3 text-gray-400 pointer-events-none"
                />
                <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-500"
                />
            </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
            {["pending", "accepted", "completed"].map((status) => (
                <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`capitalize px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                        selectedStatus === status
                            ? "border-black text-black"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                >
                    {status === "pending" && "Pending"}
                    {status === "accepted" && "Accepted"}
                    {status === "completed" && "Completed"}
                </button>
            ))}
        </div>

        {/* Requests List */}
        <div>
            {loading ? (
                <div className="py-20 text-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-gray-500">Loading requests...</p>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="py-16 text-center border border-gray-200 bg-white rounded-lg">
                    <p className="text-sm text-gray-500">No requests found for this status.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map((request) => (
                        <div
                            key={request.id}
                            className="bg-white border border-gray-200 p-6 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-300"
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start gap-4 mb-5">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <span className="inline-flex items-center text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                                            {request.category || "General"}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            ID: #{String(request.id).padStart(5, '0')}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-snug">
                                        {request.description}
                                    </h3>
                                </div>

                                {/* Status Badge */}
                                <span className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${
                                    request.status === "pending" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                                    request.status === "accepted" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                                    "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                }`}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                            </div>

                            {/* Customer Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-gray-100">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                        Customer Name
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {request.customer}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                        Contact Phone
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {request.customer_phone || "Not provided"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                        Request Date
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(request.created_at).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Customer Review Section */}
                            {request.status === "completed" && request.review && (
                                <div className="mt-6 p-4 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Customer Review</span>
                                        <span className="text-sm font-bold text-amber-600">★ {request.review?.rating || 0}/5</span>
                                    </div>
                                    <p className="text-sm text-gray-700 italic leading-relaxed">
                                        "{request.review?.comments || "No comments provided"}"
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {request.status !== "completed" && (
                                <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-gray-100">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 font-medium text-sm rounded-lg transition-all duration-200"
                                    >
                                        📍 View Location
                                    </a>

                                    {request.status === "pending" && (
                                        <button
                                            onClick={() => acceptRequest(request.id)}
                                            className="px-5 py-2 bg-black text-white hover:bg-gray-800 font-semibold text-sm rounded-lg transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                                        >
                                            Accept Request
                                        </button>
                                    )}

                                    {request.status === "accepted" && (
                                        <button
                                            onClick={() => completeRequest(request.id)}
                                            className="px-5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-sm rounded-lg transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </main>
</div>
    );
}

export default ProviderRequests;

