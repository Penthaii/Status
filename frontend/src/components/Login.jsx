import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';



function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)



    const navigate = useNavigate();



    const validateForm = () => {
        if (!username || !password) {
            setError("Tüm alanlar zorunludur");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm())
            return;
        setIsLoading(true);

        const formDetails = new URLSearchParams();
        formDetails.append("username", username);
        formDetails.append("password", password);

        try {
            const res = await api.post('/token', formDetails);
            localStorage.setItem('token', res.data.access_token);
            navigate('/protected');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Kullanıcı adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={isLoading} style={{ color: "black" }}>
                    {isLoading ? "Giriş yapılıyor..." : "Giriş yap"}
                </button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default Login;
