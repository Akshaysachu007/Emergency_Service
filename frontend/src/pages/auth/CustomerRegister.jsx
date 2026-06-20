import { useState } from "react";
import { useNavigate } from "react-router-dom";
import publicApi from "../../api/publicApi";


function CustomerRegistration() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

     const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(formData.password != formData.confirmPassword){
            alert("Passwords do not match");
            return;
        }

        try {
             await publicApi.post("/customer-register/", {
                username : formData.username ,
                email : formData.email ,
                phone : formData.phone ,
                password : formData.password ,
            })

            alert("Registration Successfull");
            navigate("/");
            
        }catch(error){
            console.log("Registration failed:", error);
            alert("Registration failed. Please try again.");
            return;
        }
    };   
    
    
    return (
        <div className="main-container flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="heading-container w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-4 text-center">Nimble</h1>
                <h2 className="text-2xl font-bold mb-6 text-center">Customer Registration</h2>
            </div>

            <div className="form-container w-full max-w-md bg-white rounded-lg shadow-md p-6 mt-6">
                <form onSubmit={handleSubmit} className="space-y-4"> 
                    <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    />

                    <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    />

                    <input
                    type="text"
                    placeholder="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    />

                    <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    />

                    <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    />
                </form>
            </div>   

            <div className="button-container w-full max-w-md mt-6">
                <button className=" register-button w-full bg-blue-500 text-white p-2 rounded" onClick={handleSubmit}>
                    Register
                </button>  
                <span className="text-sm text-gray-600 mt-2 block text-center">
                    Already have an account? <a href="/login" className="text-blue-500">Login here</a>
                </span> 
            </div>     



        </div>
    )

}

export default CustomerRegistration;