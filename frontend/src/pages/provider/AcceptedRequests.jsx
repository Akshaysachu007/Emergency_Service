import { useState , useEffect } from 'react'
import api from '../../api/axios';



function AcceptedRequests() {
      
    const [acceptedRequests , setAcceptedRequests] = useState([]);
    const [loading , setLoading] = useState(false);

    useEffect (() => {
       
        const fetchAcceptedRequests = async () => {
            setLoading(true);
            try {
                const response = await api.get("/provider/accepted-requests/");
                setAcceptedRequests(response.data);
            } catch (error) {
                console.log("Failed to fetch accepted requests:", error);
                alert("Failed to fetch accepted requests. Please try again.");
            }finally{
                setLoading(false);
            }
             

        }

        fetchAcceptedRequests();

    },[]);


    const handleCompleteRequest = async (requestId) => {
        try{
        await api.post(`requests/${requestId}/complete/`)
        setAcceptedRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId))
        alert("Request marked as completed!");
        }catch(error){
            console.log("Failed to complete request:", error);
            alert("Failed to complete request. Please try again.");
        }
    };



    return (

       <div className = "main-container min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6 ">

           <div>
                <h1 className="text-3xl font-bold mb-4 text-center">Accepted Requests</h1>
           </div>
           <div>
              {loading ? (
                <p>Loading accepted requests...</p>
              ) : acceptedRequests.length === 0 ? (
                <p>No accepted requests found.</p>
              ):(
                acceptedRequests.map((request) => (
                    <div key={request.id} className="accepted-request-card flex fill-emerald-50 rounded-lg shadow-md p-4 mb-4 flex-col bg-black text-white w-md">
                        <h3 className="text-lg font-semibold">{request.customer}</h3>
                        <p className="text-gray-600">{request.description}</p>
                        <p className="text-gray-600">Status: {request.status}</p>
                        <p className="text-gray-600">customer_email: {request.customer_email}</p>
                        <p className="text-gray-600">customer_phone: {request.customer_phone}</p>
                        <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={() => handleCompleteRequest(request.id)}
                        >
                            Complete Request
                        </button>
                    </div>    
                ))

              ) }
           </div>
       </div>

    );
}

export default AcceptedRequests;
