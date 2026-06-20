
import api from '../../api/axios';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';




function Login() {

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async () => {


        try {


            const response = await api.post('/token/', {
                username,
                password
            });


            const access = response.data.access;
            const refresh = response.data.refresh;

            login(access, refresh);

            const profileResponse = await api.get('/profile/', {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });

            const role = profileResponse.data.role;

            if (role === 'provider') {
                navigate('/provider/dashboard');
            } else if (role === 'customer') {
                navigate('/customer/dashboard');
            } else {
                console.error("Unknown user role:", role);
            }

            localStorage.setItem('role', role);


        } catch (error) {
            console.error("Login failed:", error);


        }
    }

    return (
         <div className="min-h-screen from-black via-gray-900 to-black flex flex-col items-center justify-center px-4 sm:px-6 font-sans antialiased selection:bg-white selection:text-black">
            
            {/* Form Container */}
            <div className="w-full max-w-md">
                
                {/* Decorative Top Element */}
                <div className="flex justify-center mb-10">
                    <div className="w-12 h-1 bg-white rounded-full"></div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white border border-gray-200 p-8 sm:p-10 rounded-2xl shadow-2xl">
                    
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-black mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-gray-600">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Form Elements */}
                    <div className="space-y-5">
                        
                        {/* Username Input */}
                        <div>
                            <label 
                                htmlFor="username" 
                                className="block text-sm font-semibold text-gray-900 mb-2"
                            >
                                Username or Email
                            </label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm font-medium transition-all placeholder:text-gray-500"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label 
                                    htmlFor="password" 
                                    className="block text-sm font-semibold text-gray-900"
                                >
                                    Password
                                </label>
                                <a href="/forgot-password" className="text-xs text-gray-600 hover:text-black transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm font-medium transition-all placeholder:text-gray-500"
                            />
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 accent-black rounded cursor-pointer"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                                Keep me signed in
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            className="w-full bg-black text-white hover:bg-gray-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 active:scale-95 text-sm mt-6 shadow-md hover:shadow-lg"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-white text-gray-600">New here?</span>
                        </div>
                    </div>

                    {/* Registration Options */}
                    <div className="grid grid-cols-2 gap-3">
                        <a 
                            href="/customer/register"
                            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-sm font-medium text-gray-900"
                        >
                            <span>👤</span>
                            <span>Customer</span>
                        </a>
                        <a 
                            href="/provider/register"
                            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-sm font-medium text-gray-900"
                        >
                            <span>💼</span>
                            <span>Provider</span>
                        </a>
                    </div>

                </div>

                {/* Trust Indicators - Subtle Bottom Section */}
                <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <span>🔒</span>
                        <span>Bank-level security</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <span>⚡</span>
                        <span>Enterprise grade</span>
                    </div>
                </div>

            </div>

        </div>
    );

}





export default Login;