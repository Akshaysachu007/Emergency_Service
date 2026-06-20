import {useEffect, useState} from "react";
import api from '../../api/axios';




function CompletedRequests() {


    const [completedRequests , setCompletedRequests] = useState([]);
    const [loading , setLoading] = useState(false);


    useEffect (() => {
        const fetchCompletedRequests = async () => {
            setLoading(true);
            try {
                const response = await api.get("/provider/completed-requests/");
                setCompletedRequests(response.data);
            } catch (error) {
                console.error("Error fetching completed requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompletedRequests();
    }, []);


    return (
       <div className = "main-container min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6 ">
        <h1 className="text-2xl font-bold mb-4">Completed Requests</h1>
           {loading ? (
              <p>Loading completed requests...</p>

           ):(
            completedRequests.length === 0 ? (
                <p>No completed requests found.</p>
            ):(
                <ul>
                    {completedRequests.map((request) => (
                        <div key={request.id}  value={request.description} className="completed-request-card flex fill-emerald-50 rounded-lg shadow-md p-4 mb-4 flex-col bg-black text-white w-md">
                            <h3 className="text-lg font-semibold mb-2">
                                Customer: {request.customer}
                            </h3>
                            <p className="text-gray-300">
                               Description: {request.description}
                            </p>
                            <p>
                                Created at: {request.created_at}
                            </p>
                            {request.review ? (
                                <div className="review-section mt-2">
                                    <h4 className="text-md font-semibold">Review:</h4>
                                    <p className="text-gray-300">{request.review.comment}</p>
                                    <p className="text-gray-300">Rating: {request.review.rating}</p>
                                </div>
                            ):(
                                <p className="text-gray-300">No review available.</p>
                            )
                            }
                        </div>
                    ))}
                </ul>
            ))
           }           








       </div>



    );






}

export default CompletedRequests;