import { useState , useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";


function ProviderDashboard() {

    const [requests , setRequests] = useState([]);
    const [providerDetails , setProviderDetails] = useState({});
    const navigate = useNavigate();
    
    

   
    useEffect(() => {
        
        const fetchRequests = async () => {
            try {
                console.log("fetching provider services");
                const response = await api.get("/provider/services/");
                setRequests(response.data);
                console.log("Fetched requests:", response.data);

                console.log("fetching provider details");
                const providerResponse = await api.get("/provider/profile/");
                setProviderDetails(providerResponse.data);
                console.log("Fetched provider details:", providerResponse.data);

            }catch(error){
                console.log("Failed to fetch requests:", error);
                alert("Failed to fetch requests. Please try again.");
            }
        };

        fetchRequests();

    },[]);

    const handleRequestClick = async(requestId) => {
        try{
             await api.post(`requests/${requestId}/accept/`);
             alert("Request accepted successfully!");
             setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
        }catch(error){
            console.log(error);
        }
    }

    const handleProfileClick = async() => {
        navigate("/provider/profile");
    }


    const ViewCustomerLocation = (location) => {
        if(!location.latitude || !location.longitude) {
            alert("Customer location not available.");
            return;
        }

        try {
            const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
            window.open(url, "_blank");
        } catch (error) {
            console.error("Error opening map:", error);
            alert("Failed to open customer location.")
        }
    }



    return(
        <div className="main-container flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div>
                <h1 className="text-3xl font-bold mb-4 text-center">Provider Dashboard</h1>
                <p className="text-xl mb-2">Welcome, {providerDetails.username}</p>
            </div>

            <div className="profile-details-container w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mt-6 flex flex-col items-start gap-10">
                <button
                className="bg-blue-500 hover:bg-blue-950 rounded-2xl text-white"
                onClick={handleProfileClick}
                >Profile details</button>
                <button
                  className="bg-green-500 hover:bg-green-950 rounded-2xl text-white"
                   onClick={() => navigate("/accepted-requests")}
                >
                    Accepted Requests
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-950 rounded-2xl text-white"
                onClick={() => navigate("/completed-requests")}
                >
                    Completed Requests
                </button>
            </div>

            <div className="requests-container w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Service Requests</h2>
                {requests.length === 0 ? (
                    <p>No services available.</p> 
                ):(
                    requests.map((request) => (
                        <div key={request.id} className="request-item p-4 border-b border-gray-200 flex flex-col">
                            <h3 className="text-lg font-semibold">{request.customer}</h3>
                            <p className="text-gray-600">{request.description}</p>
                            <p className="text-gray-600">Status: {request.status}</p>
                            <p className="text-gray-600">customer_email: {request.customer_email}</p>
                            <p className="text-gray-600">customer_phone: {request.customer_phone}</p>
                            <button
                            className="mt-2 bg-blue-500 hover:bg-blue-950 text-white py-2 px-4 rounded flex self-start"
                            onClick={() => ViewCustomerLocation(request.customer_location)}
                            >
                                View Location
                            </button>
                            <button
                            className="mt-2 bg-blue-500 hover:bg-blue-950 text-white py-2 px-4 rounded flex self-start"
                            onClick = {
                                () => {
                                    handleRequestClick(request.id);
                                }
                            }
                            >
                            Accept Request

                            </button>

                        </div>
                        
                    ))
                )}
            </div>


        </div>
    );


}

export default ProviderDashboard;