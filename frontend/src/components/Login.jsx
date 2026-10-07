import { useState } from 'react';
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
            await api.post('/token', formDetails);
            navigate('/protected');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center">
            <form className="flex flex-col gap-3.5 w-[340px] max-w-[90%] px-7 py-8 border border-border rounded-xl bg-bg shadow-card" onSubmit={handleSubmit}>
                <h2 className="mb-2 text-2xl font-bold text-text-h">Giriş yap</h2>
                <input
                    className="px-3 py-2.5 border border-border rounded-md bg-bg text-text-h text-base outline-none transition placeholder:text-text/70 focus:border-accent focus:ring-3 focus:ring-accent-bg"
                    type="text"
                    placeholder="Kullanıcı adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="px-3 py-2.5 border border-border rounded-md bg-bg text-text-h text-base outline-none transition placeholder:text-text/70 focus:border-accent focus:ring-3 focus:ring-accent-bg"
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="mt-1.5 px-3.5 py-2.5 rounded-md bg-accent text-white text-base font-medium cursor-pointer transition-opacity hover:opacity-85 disabled:opacity-60 disabled:cursor-not-allowed" type="submit" disabled={isLoading}>
                    {isLoading ? "Giriş yapılıyor..." : "Giriş yap"}
                </button>
                {error && <p className="px-3.5 py-2.5 border border-[#e5484d] rounded-md bg-[#e5484d]/10 text-[#e5484d] text-sm text-center">{error}</p>}
            </form>
        </div>
    );
}

export default Login;