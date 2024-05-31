import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();

        const isValidEmail = () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        if (!isValidEmail()) {
            setError("Invalid Email!");
            return;
        }

        try {
                setError('');
                navigate('/textcategorization');
            
        } catch (error) {
            console.error(error);
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="main-container">
            <div className="custom-container">
                <div className="sm:w-1/2 sm:block hidden">
                </div>
                <div className="content">
                    <h1 style={{ color: 'white' }} className="font-bold ml-60 text-5xl">
                        WELCOME
                    </h1>
                    <p style={{ color: 'white' }} className="text-md mt-4 ml-40 mb-5">
                        We are glad to see you back with us
                    </p>
                    <form className="form" onSubmit={handleLogin}>
                        <input
                            className="input-box"
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="p-4 mr-10 rounded-xl border ml-4"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="login-button"
                            aria-label="Login"
                            role="button"
                            type="submit"
                        >
                            LOGIN
                        </button>
                    </form>
                    {error && <p className="text-red-500 mt-2 ml-4">{error}</p>}
                    <div className="mr-12 mt-10 grid grid-cols-3 items-center text-gray-500">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
