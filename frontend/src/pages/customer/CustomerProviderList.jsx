import { useEffect, useState } from "react";
import api from "../../api/axios";
import CustomerNavbar from "../../components/CustomerNavbar";

import {  Phone,  Star, ShieldCheck, ShieldAlert, MapPin, X } from 'lucide-react';



function CustomerProviderList() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState({
        longitude: null,
        latitude: null
    })
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [description, setDescription] = useState("");
    const [selectedRating, setSelectedRating] = useState("");
    const [selectedDistance, setSelectedDistance] = useState("");



    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude,
                });
            },
            (error) => {
                console.error(error);
            }
        );
    }, []);



    useEffect(() => {

        if (
            location.latitude === null ||
            location.longitude === null
        ) {
            return;
        }

        const fetchProviders = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/customer/provider-list/?lat=${location.latitude}&lng=${location.longitude}`
                );

                setProviders(response.data);

                const categoriesResponse = await api.get("category-list/");
                setCategoryList(categoriesResponse.data);
                console.log("Fetched providers:", response.data);
                console.log("Fetched categories:", categoriesResponse.data);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();

    }, [location.latitude, location.longitude]);


    const handleBookService = async (providerId) => {
        try {

            if (!description) {
                alert("Please enter a description for the service request.");
                return;
            }

            if (!location.longitude || !location.latitude) {
                alert("Unable to retrieve your location. Please allow location access and try again.");
                return;
            }

            const response = await api.post(`/book-provider/${providerId}/`, {
                description: description,
                longitude: Number(location.longitude.toFixed(6)),
                latitude: Number(location.latitude.toFixed(6)),
            });
            console.log("Service booked successfully:", response.data);
            setModalOpen(false);
            setDescription("");
            alert("Service booked successfully!");
        } catch (error) {
            console.error("Error booking service:", error);
        }
    }


    const filteredProviders = providers.filter((provider) => {

        const matchProvider =
            !selectedCategory ||
            provider.category === selectedCategory;

        const matchSearch =
            provider.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchRating =
            !selectedRating ||
            parseFloat(provider.rating) >= parseFloat(selectedRating);

        const matchDistance =
            !selectedDistance ||
            provider.distance <= parseFloat(selectedDistance);

        return (
            matchProvider &&
            matchSearch &&
            matchRating &&
            matchDistance
        );
    });



    return (

        <div className="min-h-screen bg-white font-sans antialiased">
    {/* Navigation Element Layer */}
    <CustomerNavbar />

    {/* Main Application Interface */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Page Header */}
        <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Available Providers
            </h1>
            <p className="text-lg text-gray-600">
                Browse and book services from verified providers in your area
            </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-10 hover:border-gray-400 hover:shadow-md transition-all duration-300">
            <div className="space-y-6">
                
                {/* Primary Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Category Filter */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                            Category
                        </label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-white border border-gray-300 text-gray-900 text-sm font-medium px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer transition-all hover:border-gray-400"
                        >
                            <option value="">All Categories</option>
                            {categoryList.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Distance Filter */}
                    <div>
                        <label htmlFor="distance" className="block text-sm font-semibold text-gray-900 mb-2">
                            Distance
                        </label>
                        <div className="relative">
                            <select
                                id="distance"
                                value={selectedDistance}
                                onChange={(e) => setSelectedDistance(e.target.value)}
                                className="w-full appearance-none bg-white border border-gray-300 text-gray-900 text-sm font-medium px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer transition-all hover:border-gray-400 pr-10"
                            >
                                <option value="">All Distances</option>
                                <option value="1">Within 1 km</option>
                                <option value="5">Within 5 km</option>
                                <option value="10">Within 10 km</option>
                                <option value="20">Within 20 km</option>
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Minimum Rating
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedRating("")}
                                className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${selectedRating === "" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setSelectedRating("3")}
                                className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${selectedRating === "3" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                3+⭐
                            </button>
                            <button
                                onClick={() => setSelectedRating("4")}
                                className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${selectedRating === "4" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                4+⭐
                            </button>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div>
                        <label htmlFor="search" className="block text-sm font-semibold text-gray-900 mb-2">
                            Search
                        </label>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                id="search"
                                type="text"
                                placeholder="Search providers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all hover:border-gray-400 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                </div>

                {/* Active Filters Display */}
                {(selectedCategory || selectedDistance || selectedRating || searchTerm) && (
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Active Filters:</span>
                            {selectedCategory && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                    {selectedCategory}
                                    <button onClick={() => setSelectedCategory('')} className="hover:text-blue-600">✕</button>
                                </span>
                            )}
                            {selectedDistance && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                    Within {selectedDistance} km
                                    <button onClick={() => setSelectedDistance('')} className="hover:text-blue-600">✕</button>
                                </span>
                            )}
                            {selectedRating && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                    {selectedRating}+ Rating
                                    <button onClick={() => setSelectedRating('')} className="hover:text-blue-600">✕</button>
                                </span>
                            )}
                            {searchTerm && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                    "{searchTerm}"
                                    <button onClick={() => setSearchTerm('')} className="hover:text-blue-600">✕</button>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Providers Grid */}
        <div>
            {loading ? (
                <div className="py-32 flex flex-col justify-center items-center gap-4">
                    <div className="w-10 h-10 border-3 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500">Loading providers...</p>
                </div>
            ) : filteredProviders.length === 0 ? (
                <div className="py-24 text-center bg-white border border-dashed border-gray-300 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900 mb-1">No providers found</p>
                    <p className="text-sm text-gray-600">Try adjusting your filters to find providers</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProviders.map((provider) => (
                        <div
                            key={provider.id}
                            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between gap-6 transition-all duration-300 hover:border-gray-400 hover:shadow-lg"
                        >
                            {/* Card Header */}
                            <div>
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                        {provider.category || "General"}
                                    </span>
                                    <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg">
                                        <Star size={14} className="text-amber-400 fill-amber-400" />
                                        <span className="text-sm font-bold text-amber-700">{Number(provider.rating || 0).toFixed(1)}</span>
                                    </div>
                                </div>

                                {/* Provider Name */}
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    {provider.username || "Unnamed Provider"}
                                </h3>

                                {/* Provider Details */}
                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <Phone size={14} className="text-gray-400 shrink-0" />
                                        <span className="font-medium">{provider.phone || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <MapPin size={14} className="text-gray-400 shrink-0" />
                                        <span className="font-medium">{provider.distance} km</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        {provider.is_verified ? (
                                            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                                                <ShieldCheck size={14} /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-red-500 font-semibold">
                                                <ShieldAlert size={14} /> Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => {
                                    setSelectedProvider(provider.id);
                                    setModalOpen(true);
                                }}
                                className="w-full bg-black text-white hover:bg-gray-900 text-sm font-semibold py-3 px-4 rounded-lg transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                            >
                                Book Service
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </main>

    {/* Booking Modal */}
    {modalOpen && selectedProvider && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md shadow-xl transform transition-all">

                {/* Close Button */}
                <button
                    onClick={() => setModalOpen(false)}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={22} />
                </button>

                {/* Modal Header */}
                <div className="mb-8">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                        Service Booking
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Confirm Your Request
                    </h2>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 mb-8" />

                {/* Form Content */}
                <div className="space-y-6">
                    
                    {/* Description Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Service Details
                        </label>
                        <textarea
                            placeholder="Describe what you need..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 text-sm resize-none h-28 placeholder:text-gray-400 transition-all"
                        />
                    </div>

                    {/* Location Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                        <MapPin size={16} className="text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 leading-relaxed">
                            Your location will be securely shared with the provider for service dispatch.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                handleBookService(selectedProvider);
                            }}
                            className="flex-1 px-4 py-3 bg-black text-white hover:bg-gray-900 font-semibold rounded-lg transition-all text-sm active:scale-95"
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )}
</div>


    );


}

export default CustomerProviderList;