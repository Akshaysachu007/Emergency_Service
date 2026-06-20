
import {useEffect, useState} from "react";
import api from "../../api/axios";
import publicApi from "../../api/publicApi";

import CustomerNavbar from "../../components/CustomerNavbar";
import PlumberImg from "../../assets/plumbing.jpg";
import AmbulanceImg from "../../assets/ambulance.jpg";
import MechanicImg from "../../assets/mechanic.jpg";
import TaxiImg from "../../assets/taxi.jpg";


function CustomerServices() {

    const [category , setCategory] = useState([]);
    const [selectedCategory , setSelectedCategory] = useState(null);
    const [description , setDescription] = useState("");
    const [modal , setModal] = useState(false);
    const [location , setLocation] = useState({
        longitude: null,
        latitude: null
    })


    const categoryImages = {
        "Plumbing": PlumberImg,
        "Ambulance": AmbulanceImg,
        "Mechanic": MechanicImg,
        "Taxi Service": TaxiImg
    };

    


     useEffect(() => {

        const fetchCategory = async () => {

            try {
                const categoryResponse = await publicApi.get("category-list/");
                setCategory(categoryResponse.data);

            } catch(error){
                console.log("Failed to fetch categories:", error);
                alert("Failed to fetch categories. Please try again.");
            }
        }

        fetchCategory();
    },[]);


    const handleSubmitRequest = async () => {
        if (!description.trim()) {
            alert("Please provide a description for your request.");
            return;
        }
        

        try {

            console.log("Submitting service request with data:", {
                description: description,
                 latitude: Number(location.latitude.toFixed(6)),
                 longitude: Number(location.longitude.toFixed(6))
            });
            await api.post(`/service-requests/create/${selectedCategory.id}/` ,{
                description: description,
                latitude: Number(location.latitude.toFixed(6)),
                longitude: Number(location.longitude.toFixed(6))
            });
            alert("Service request submitted successfully!");
            setModal(false);
            setDescription("");
        } catch(error) {
            console.error("Failed to submit service request:", error);
            alert("Failed to submit service request. Please try again.");
        }
    }



    const getLocation = () => {
        if(!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
        }

        try {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    "latitude": position.coords.latitude,
                    "longitude": position.coords.longitude
                });
                console.log("Location fetched successfully:", position.coords);
                console.log("Latitude:", position.coords.latitude, "Longitude:", position.coords.longitude);
            }, (error) => {
                console.error("Error fetching location:", error);
                alert("Failed to fetch location. Please ensure location services are enabled.");
            })

        }catch(error){
            console.error("Unexpected error while fetching location:", error);
            alert("An unexpected error occurred while fetching location. Please try again.");
        }
    }




    return (
    <>
    {/* Global Premium Navigation Component */}
    <CustomerNavbar />

    {/* Main Page Layout Wrapper */}
    <div className="main-container min-h-[calc(100vh-80px)] w-full bg-white flex flex-col items-center px-4 sm:px-6 py-8 font-sans antialiased">
        
        {/* Core Content Shell Container */}
        <div className="w-3/4 max-w-5xl bg-white rounded-2xl  p-6 sm:p-8 mt-4 transition-all duration-300 ">
            
            <header className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    Available Services
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    Select a discipline below to immediately launch an emergency support ticket.
                </p>
            </header>

            {/* Premium Interactive Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white w-full">
                {category.map((cat) => (
                    <div
                        key={cat.id}
                        className="group bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-black flex flex-col h-full justify-between"
                    >
                        {/* Upper Content Zone */}
                        <div className="w-full bg-white flex flex-col gap-4 mx-auto items-center justify-center text-center">
                            {/* 🌟 Optimized Image Aspect Ratio Box */}
                            <div className="w-full sm:w-40 h-40 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                                <img
                                    src={categoryImages[cat.name]}
                                    alt={cat.name}
                                    className="w-full h-full mx-auto object-cover object-center   transition-all duration-500 transform group-hover:scale-[1.07]"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80";
                                    }}
                                />
                            </div>

                            {/* Text Metadata Details Block */}
                            <div className="px-1">
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight transition-colors duration-300 group-hover:text-black">
                                    {cat.name}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium mt-1.5 leading-relaxed">
                                    Deploy a certified operator for {cat.name} service to your current location.
                                </p>
                            </div>
                        </div>

                        {/* Lower Action Interactive Button Row */}
                        <div className="px-1 pt-5 mx-auto w-full flex items-center justify-center">
                            <button
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setModal(true);
                                    getLocation();
                                }}
                                className="w-auto bg-black hover:bg-gray-900 text-white text-xs font-bold py-2.5 px-5 rounded-xl tracking-wide shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.03] hover:cursor-pointer"
                            >
                                Request Service
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 🌟 Premium Minimalist Modal Window */}
        {modal && selectedCategory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-full max-w-md transform transition-all animate-fade-in-up">
                    
                    {/* Header Layout Box */}
                    <div className="mb-5 bg-white">
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400 block mb-1">
                            Dispatch Confirmation
                        </span>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">
                            Request {selectedCategory.name} Service
                        </h2>
                    </div>

                    {/* Operational Details Inputs */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                            Situation Overview
                        </label>
                        <textarea
                            value={description}
                            placeholder="Provide critical access details or current emergency context here..."
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:border-black focus:bg-white text-sm font-medium transition-all placeholder:text-gray-400 resize-none"
                            rows="4"
                        />
                    </div>

                    {/* Action Panel Controllers */}
                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
                        <button
                            onClick={() => setModal(false)}
                            className="px-4 py-2.5 border border-gray-200 text-gray-700 hover:text-black hover:bg-gray-50 text-xs font-bold rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmitRequest}
                            className="px-5 py-2.5 bg-black hover:bg-gray-900 text-white text-xs font-bold rounded-lg shadow-sm transition-all duration-200 active:scale-[0.97]"
                        >
                            Confirm & Dispatch
                        </button>
                    </div>

                </div>
            </div>
        )}
    </div>
</>
);


}

export default CustomerServices;