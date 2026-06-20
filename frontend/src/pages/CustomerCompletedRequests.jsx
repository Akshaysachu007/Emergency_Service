import { useState, useEffect } from 'react';
import api from './../api/axios';


function CustomerCompletedRequests() {
    const [completedRequests, setCompletedRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [selectedRequestId, setSelectedRequestId] = useState(null);


    useEffect(() => {

        const fetchCompletedRequests = async () => {
            setLoading(true);
            try {
                const response = await api.get("/customer/completed-requests/");
                setCompletedRequests(response.data);
                console.log("Fetched completed requests:", response.data);
            } catch (error) {
                console.log("Failed to fetch completed requests:", error);
                alert("Failed to fetch completed requests. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchCompletedRequests();



    }, []);



   


    const handleSubmitReview = async (requestId) => {

        console.log({
            service_request_id: requestId,
            comments: comment,
            rating: rating,
        });
        try {
            await api.post('create/review/', {
                service_request_id: requestId,
                comments: comment,
                rating: rating
            });
            alert("Review submitted successfully!");
            setModalOpen(false);
             
        } catch (error) {
            console.log("Failed to submit review:", error);
            console.log(error.response?.data)
            alert("Failed to submit review. Please try again.");
        }
    }


    return (
        <div className="main-container min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6 ">
            <h1 className="text-2xl font-bold mb-4">Completed Requests</h1>
            {loading ? (
                <p>Loading Requests...</p>
            ) : (
                <div>
                    {completedRequests.length === 0 ? (
                        <p>No Completed Requests</p>
                    ) : (
                        completedRequests.map((request) => (
                            <div key={request.id} value={request.description} className="completed-request-card flex fill-emerald-50 rounded-lg shadow-md p-4 mb-4 flex-col bg-black text-white w-md justify-center">
                                <h3>{request.description}</h3>
                                <h2>Provider: {request.provider}</h2>
                                <p>Created at: {request.created_at}</p>
                                <p>Provider Email: {request.provider_email}</p>
                                <p>Provider Phone: {request.provider_phone}</p>
                                {request.review ? (<div className="review-section mt-2">
                                    <h4 className="text-md font-semibold">Review:</h4>
                                    <p className="text-gray-300">{request.review.comments}</p>
                                    <p className="text-gray-300">Rating: {request.review.rating}</p>

                                </div>
                                ) : (<p>No review available.</p>)}
                                <button className="bg-blue-500 hover:bg-blue-950 rounded-2xl text-white mt-2"
                                    onClick={() => {setModalOpen(true); setSelectedRequestId(request.id);}}
                                >
                                    Submit Review
                                </button>
                                {modalOpen && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-xs z-50">
                                    <div className="bg-black text-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-4 text-center">
                                                Submit Review
                                            </h2>
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSubmitReview(selectedRequestId);
                                            }}>
                                                <select value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded mb-4 bg-black text-white"
                                                >
                                                    <option value={1}>1⭐</option>
                                                    <option value={2}>2⭐</option>
                                                    <option value={3}>3⭐</option>
                                                    <option value={4}>4⭐</option>
                                                    <option value={5}>5⭐</option>

                                                </select>
                                                <label className="block mb-2" htmlFor="comments">Comments:</label>
                                                <textarea
                                                    id="comments"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded mb-4 bg-black text-white"
                                                />

                                                <div className="flex justify-end mt-4 gap-4">
                                                    <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2" type="submit">
                                                        Submit
                                                    </button>
                                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => setModalOpen(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>


                                            </form>
                                        </div>


                                    </div>
                                    </div>



                                )}
                            </div>
                        ))
                    )}


                </div>


            )}


        </div>
    );


}


export default CustomerCompletedRequests;