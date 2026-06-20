import { useState, useEffect } from 'react';
import api from '../../api/axios';
import CustomerNavbar from '../../components/CustomerNavbar';
import { Search } from 'lucide-react';


function CustomerRequests() {
    const [requests, setRequests] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("pending");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [reviewComments, setReviewComments] = useState("");
    const [reviewRating, setReviewRating] = useState(5);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const response = await api.get("customer/all-requests/");
                setRequests(response.data);
                console.log("Fetched requests:", response.data);
            } catch (error) {
                console.log("Failed to fetch requests:", error);
                alert("Failed to fetch requests. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchRequests();
    }, []);


    const filteredRequests =
        requests.filter((request) => {
            const matchStatus = request.status === selectedStatus;

            const matchesSearch =
                (request.description || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||

                (request.category || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||

                (request.provider || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            return (matchStatus && matchesSearch);
        })

    const cancelRequest = async (requestId) => {
        try {
            await api.post(`cancel-request/${requestId}/`);
            alert("Request cancelled successfully!");
            setRequests((prevRequests) => prevRequests.map((request) => request.id === requestId ? { ...request, status: "cancelled" } : request));
        } catch (error) {
            console.log(error);
            alert("Failed to cancel request. Please try again.");
        }
    }


    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!selectedRequest) {
            alert("No request selected for review.");
            return;
        }
        try {
            await api.post('create/review/', {
                service_request_id: selectedRequest.id,
                rating: reviewRating,
                comments: reviewComments,
            })
            alert("Review submitted successfully!");
            setReviewModalOpen(false);
            setReviewComments("");
            setReviewRating(5);
            setSelectedRequest(null);
            setRequests((prevRequests) => prevRequests.map((request) => request.id === selectedRequest.id ? { ...request, review: { rating: reviewRating, comments: reviewComments } } : request));
        } catch (error) {
            console.log("Failed to submit review:", error);
            alert("Failed to submit review. Please try again.");
        }
    }


    return (
        <div className="min-h-screen bg-white flex flex-col font-sans antialiased selection:bg-black selection:text-white">
            {/* Navigation bar */}
            <CustomerNavbar />

            {/* Main Application Content */}
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 bg-white">

                {/* Section Header */}
                <div className="w-full mb-8 pb-6 bg-white border-b border-gray-100 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Requests
                        </h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Track your service requests, manage active orders, and review providers.
                        </p>
                    </div>

                    {/* Search Field */}
                    <div className="w-full md:w-72 relative flex items-center">
                        <div className="absolute left-4 text-gray-400 pointer-events-none">
                            <Search size={16} strokeWidth={2} />
                        </div>

                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2.5 pl-10 pr-4 bg-white border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm font-medium transition-all placeholder:text-gray-400 shadow-sm"
                        />
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex border-b border-gray-200 gap-1 mb-8 overflow-x-auto pb-0">
                    {["pending", "accepted", "completed", "cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`capitalize text-sm font-semibold px-5 py-3 transition-all border-b-2 ${
                                selectedStatus === status
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="py-24 flex flex-col justify-center items-center gap-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-gray-500">Loading requests...</p>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="py-20 text-center bg-white border border-dashed border-gray-200 rounded-lg p-6 shadow-sm">
                            <p className="text-sm text-gray-500">No requests found matching your search.</p>
                        </div>
                    ) : (
                        filteredRequests.map((request) => (
                            <div
                                key={request.id}
                                className="bg-white border border-gray-200 p-5 sm:p-6 rounded-lg shadow-sm hover:shadow-md hover:border-gray-400 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
                            >
                                {/* Left Section: Request Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                                        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded border border-gray-200">
                                            {request.category}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            ID: #{String(request.id).padStart(5, '0')}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-4">
                                        {request.description}
                                    </h3>

                                    {/* Provider Details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-4 border-t border-gray-100 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 font-semibold">Provider:</span>
                                            <span className="text-gray-900 font-medium">{request.provider || "Awaiting Assignment"}</span>
                                        </div>
                                        {request.provider && (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500 font-semibold">Phone:</span>
                                                    <span className="text-gray-900 font-medium">{request.provider_phone || "—"}</span>
                                                </div>
                                                <div className="flex items-center gap-2 sm:col-span-2">
                                                    <span className="text-gray-500 font-semibold">Email:</span>
                                                    <span className="text-gray-900 font-medium break-all">{request.provider_email || "—"}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Review Section */}
                                    {request.review && (
                                        <div className="mt-5 p-4 bg-gray-50 border border-gray-100 rounded-lg flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 text-sm font-semibold">Rating:</span>
                                                <div className="text-amber-500 font-semibold">
                                                    {request.review.rating} ⭐
                                                </div>
                                            </div>
                                            <p className="text-sm italic text-gray-600 leading-relaxed">
                                                "{request.review.comments || "No review submitted."}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Section: Status & Actions */}
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${
                                            request.status === 'completed' ? 'bg-emerald-500' :
                                            request.status === 'accepted' ? 'bg-sky-500' :
                                            request.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                                        }`} />
                                        <span className="text-xs font-semibold text-gray-900 capitalize">
                                            {request.status}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    {request.status === "pending" && (
                                        <button
                                            onClick={() => cancelRequest(request.id)}
                                            className="w-full sm:w-auto bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold py-2 px-4 rounded-lg transition-all active:scale-95"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    {request.status === "completed" && !request.review && (
                                        <button
                                            onClick={() => { 
                                                setReviewModalOpen(true); 
                                                setSelectedRequest(request); 
                                            }}
                                            className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all active:scale-95"
                                        >
                                            Leave Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Review Modal */}
            {selectedRequest && reviewModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-full max-w-md">

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Review {selectedRequest.provider || "Provider"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Share your feedback about this service.</p>
                        </div>

                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Rating
                                </label>
                                <select
                                    value={reviewRating}
                                    onChange={(e) => setReviewRating(Number(e.target.value))}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black cursor-pointer"
                                >
                                    <option value={5}>5 ⭐ Excellent</option>
                                    <option value={4}>4 ⭐ Good</option>
                                    <option value={3}>3 ⭐ Average</option>
                                    <option value={2}>2 ⭐ Poor</option>
                                    <option value={1}>1 ⭐ Very Poor</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Comments
                                </label>
                                <textarea
                                    placeholder="Tell us about your experience..."
                                    value={reviewComments}
                                    onChange={(e) => setReviewComments(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm font-medium placeholder:text-gray-400 resize-none"
                                    rows={4}
                                />
                            </div>

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReviewModalOpen(false);
                                        setSelectedRequest(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-black hover:bg-gray-900 text-white text-sm font-semibold rounded-lg transition-all active:scale-95"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )








}

export default CustomerRequests;
