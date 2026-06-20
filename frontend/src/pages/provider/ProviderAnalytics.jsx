import { useEffect, useState } from "react";
import api from "../../api/axios";
import ProviderNavbar from "../../components/ProviderNavbar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";



function ProviderAnalytics() {
    const [stats , setStats] = useState({});
    const [reviews , setReviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsResponse = await api.get("provider/analytics/");
                setStats(statsResponse.data);
                console.log("Fetched analytics:", statsResponse.data);

                const reviewResponse = await api.get("provider/reviews/page/");
                setReviews(reviewResponse.data);
                console.log("Fetched reviews:", reviewResponse.data);
            }catch(error){
                console.log("Failed to fetch analytics:", error);
                alert("Failed to fetch analytics. Please try again.");
            }
        }
        fetchData();
    }, []);


    const pieData = [
        {
            name: "Completed",
            value: stats.completed_requests || 0
        },
        {
            name: "Pending",
            value: stats.pending_requests || 0
        },
        {
            name: "Accepted",
            value: stats.accepted_requests || 0
        },
    ];

    const COLORS = ["#10B981", "#FBBF24", "#3B82F6"];


    return (
        <div className="min-h-screen bg-white font-sans antialiased">
    <ProviderNavbar />
    
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Header Section */}
        <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Provider Analytics
            </h1>
            <p className="text-lg text-gray-600">
                Track your performance metrics and customer feedback
            </p>
        </div>

        {/* Stats Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            
            {/* Total Requests Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Total Requests
                    </h3>
                    <span className="text-2xl">📋</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                    {stats.total_requests || 0}
                </p>
                <p className="text-xs text-gray-500 mt-2">All requests received</p>
            </div>

            {/* Pending Requests Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Pending
                    </h3>
                    <span className="text-2xl">⏳</span>
                </div>
                <p className="text-3xl font-bold text-amber-600">
                    {stats.pending_requests || 0}
                </p>
                <p className="text-xs text-gray-500 mt-2">Awaiting your response</p>
            </div>

            {/* Accepted Requests Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Accepted
                    </h3>
                    <span className="text-2xl">✓</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                    {stats.accepted_requests || 0}
                </p>
                <p className="text-xs text-gray-500 mt-2">In progress</p>
            </div>

            {/* Completed Requests Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Completed
                    </h3>
                    <span className="text-2xl">✅</span>
                </div>
                <p className="text-3xl font-bold text-emerald-600">
                    {stats.completed_requests || 0}
                </p>
                <p className="text-xs text-gray-500 mt-2">Successfully finished</p>
            </div>

            {/* Average Rating Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Rating
                    </h3>
                    <span className="text-2xl">⭐</span>
                </div>
                <p className="text-3xl font-bold text-amber-600">
                    {stats.average_rating ? stats.average_rating.toFixed(1) : "N/A"}
                </p>
                <p className="text-xs text-gray-500 mt-2">Out of 5.0</p>
            </div>

        </div>

        {/* Charts Section */}
<div className="mb-12">
    {/* Section Header */}
    <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Overview
        </h2>
        <p className="text-lg text-gray-600">
            Request trends and status distribution at a glance
        </p>
    </div>

    {/* Charts Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pie Chart Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-400 hover:shadow-lg transition-all duration-300">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                    Request Status Distribution
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Breakdown of requests by status
                </p>
            </div>

            <div className="w-full h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={100}
                            innerRadius={60}
                            label={({ name, value }) => `${name}: ${value}`}
                            labelLine={true}
                        >
                            {pieData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value) => [`${value} requests`, 'Count']}
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                {pieData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm text-gray-700">{item.name}</span>
                        <span className="text-sm font-semibold text-gray-900 ml-auto">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Line Chart Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-400 hover:shadow-lg transition-all duration-300">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                    Monthly Request Trends
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Request volume over the last 12 months
                </p>
            </div>

            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={stats.monthly_requests || []}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="#e5e7eb"
                            vertical={false}
                        />
                        <XAxis 
                            dataKey="month"
                            stroke="#9ca3af"
                            style={{ fontSize: '0.875rem' }}
                        />
                        <YAxis 
                            stroke="#9ca3af"
                            style={{ fontSize: '0.875rem' }}
                        />
                        <Tooltip 
                            formatter={(value) => [value, 'Requests']}
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                            cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="count" 
                            stroke="#3B82F6" 
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', r: 4 }}
                            activeDot={{ r: 6 }}
                            fill="url(#colorCount)"
                            isAnimationActive={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Chart Info */}
            <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Request Count</span>
                </div>
            </div>
        </div>

    </div>

    {/* Summary Stats Below Charts */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">
                {pieData.reduce((sum, item) => sum + item.value, 0)}
            </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pending</p>
            <p className="text-2xl font-bold text-amber-600">
                {pieData.find(d => d.name === 'Pending')?.value || 0}
            </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Completed</p>
            <p className="text-2xl font-bold text-emerald-600">
                {pieData.find(d => d.name === 'Completed')?.value || 0}
            </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Acceptance Rate</p>
            <p className="text-2xl font-bold text-blue-600">
                {Math.round((pieData.find(d => d.name === 'Accepted')?.value || 0) / (pieData.reduce((sum, item) => sum + item.value, 0) || 1) * 100)}%
            </p>
        </div>

    </div>
</div>




        {/* Reviews Section */}
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Customer Reviews
                </h2>
                <p className="text-gray-600">
                    Feedback from customers you've served
                </p>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <p className="text-lg text-gray-500 mb-2">No reviews yet</p>
                    <p className="text-sm text-gray-400">Complete requests to receive customer feedback</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                        <div 
                            key={review.id} 
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-md transition-all duration-300"
                        >
                            {/* Review Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {review.customer}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(review.created_at).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                                    <span className="text-amber-600 font-bold text-sm">{review.rating}</span>
                                    <span className="text-amber-500">★</span>
                                </div>
                            </div>

                            {/* Review Divider */}
                            <div className="border-t border-gray-100 py-4"></div>

                            {/* Review Comment */}
                            <p className="text-gray-700 leading-relaxed text-sm">
                                "{review.comments}"
                            </p>

                            {/* Rating Breakdown */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <span 
                                                key={i} 
                                                className={`text-lg ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">
                                        {review.rating} out of 5
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    </main>
</div>
    )

}
export default ProviderAnalytics;