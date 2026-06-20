// import { useState , useEffect } from "react";
// import api from "../../api/axios";


// function derProfile() {
//     const [providerDetails , setProviderDetails] = useState({});

//     useEffect(() => {
//         const fetchProvideDetails = async () => {
//             try {
//                 console.log("fetching provider details");
//                 const response = await api.get("/provider/profile/");
//                 setProviderDetails(response.data);
//                 console.log(response.data);
//                 console.log(response.data.total_jobs_completed);
//                 console.log(response.data.rating);
//             }catch(error){
//                 console.log("Failed to fetch provider details:", error);
//                 alert("Failed to fetch provider details. Please try again.");
//             }
//         };
//         fetchProvideDetails();
//     },[]);



//    return(
//      <div className="main-container flex flex-col items-center justify-center min-h-screen bg-gray-100">
//           <div className="profile-details-container w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mt-6">
//                <h1 className="text-3xl font-bold mb-4 text-center">Provider Profile</h1>
//                <p className="text-xl mb-2">Name: {providerDetails.username}</p>
//                <p className="text-xl mb-2">Email: {providerDetails.email}</p>
//                <p className="text-xl mb-2">Phone: {providerDetails.phone}</p>
//                <p className="text-xl mb-2">Category: {providerDetails.category}</p>
//                <p className="text-xl mb-2">Rating: {providerDetails.rating}⭐</p>
//                <p className="text-xl mb-2">Total Jobs Completed: {providerDetails.total_jobs_completed}</p>
//           </div>
//      </div>
//    )







// }

// export default ProviderProfile;