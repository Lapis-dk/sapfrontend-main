import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import './LoginForm.css';


const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if(password=="123"){
            navigate('/textcategorization');
        }

    }

    return (
        <>
            <div className='overall-login'>
                <div className='wrapper'>
                    <form>
                        <h1>Categoriazation</h1>
                        <div className="input-box">
                            <input
                                type='text'
                                placeholder='Name'
                                required
                                value={email}
                                onKeyDown={handleKeyPress}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type='password'
                                placeholder='Password'
                                required
                                value={password}
                                onKeyDown={handleKeyPress}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type='button' onClick={handleLogin}>Login</button>

                    </form>
                </div>
            </div>
        </>
    );
}

export default LoginForm;
