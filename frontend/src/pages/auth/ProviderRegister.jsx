import {useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import publicApi from "../../api/publicApi";



function ProviderRegistration() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const[error , setError] = useState("");

    const[formData , setFormData] = useState({
        username : "" ,
        email : "" ,
        category : "" ,
        phone : "" ,
        password : "" ,
        confirmPassword : "" ,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    };

    useEffect (() => {
        const fetchCategories = async () => {
            try {
                const response = await publicApi.get("/category-list/" ,
                );
                setCategories(response.data);
            } catch (error) {
                console.log("Failed to fetch categories:", error);
                alert("Failed to fetch categories. Please try again.");
            }
        }
        fetchCategories();
    },[]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if(formData.password != formData.confirmPassword){
            setError("Passwords do not match");
            return;
        }

        if(formData.password.length < 6){
            setError("Password must be at least 6 characters long");
            return;
        }

        try {
            await publicApi.post("/provider-register/" , {
                username : formData.username ,
                email : formData.email ,
                category : formData.category ,
                phone : formData.phone ,
                password : formData.password,
            });

            alert("Registration Successfull");
            navigate("/");

        }catch(error){
            console.log(error.response?.data);
            setError("Registration failed. Please try again.");
        }

    };


    return (
        
        <div className="main-container flex flex-col items-center justify-center min-h-screen bg-gray-100">

            <div className="registration-container w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-4 text-center">Nimble</h1>
                <h2 className="text-2xl font-bold mb-6 text-center">Provider Registration</h2>
                
                
                {error && 
                <div className="error-message text-red-500 mb-4 text-center">
                    {error}
                </div>
                }

                <form onSubmit={handleSubmit} className="space-y-4  p-4 rounded">


                    <input
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />


                    <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full p-2 border border-gray-300 rounded"
                    />





                    <select name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}

                    </select>

                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />

                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />

                    
                    

                </form>    

                <button 
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                 Register
                </button>



            </div>    
          

        </div>
    );


}

export default ProviderRegistration;