import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {

    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [disble, setDisable] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginForm((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setDisable(true);

        try {
            // Replace with your API endpoint
            const response = await axios.post("http://localhost:3001/api/login", loginForm);
            const { token } = response.data;
            // Save token or user data in localStorage or state management
            localStorage.setItem("authToken", token);
            setIsAuthenticated(true);
        } catch (error) {
            setError(error.response?.data?.message || "Incorrect username or password");
        }
    };

    return (
        <div class="flex items-center justify-center mt-36">
            <div class="login w-80">
                <form onSubmit={handleSubmit}>
                    <center>
                        <h2>Log in</h2>
                        <div>
                            <input
                                type="text"
                                name="username"
                                value={loginForm.username}
                                placeholder="Username"
                                onChange={handleChange}
                                required
                                disabled={disble}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={loginForm.password}
                                placeholder="Password"
                                onChange={handleChange}
                                required
                                disabled={disble}
                            />
                        </div>
                        <div class='error'>
                            {error}
                        </div>
                        <div>
                            <button type="submit" disabled={disble}>Submit</button>
                        </div>
                    </center>
                </form>
            </div>
        </div>
    );
}

export default Login;