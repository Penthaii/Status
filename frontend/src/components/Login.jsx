import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



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
            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formDetails
            });

            setIsLoading(false);

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                navigate('/protected');
            }
            else {
                const errorData = await response.json();
                setError(errorData.detail)
            }
        }
        catch (error) {
            setIsLoading(false);
            setError("hata")
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
