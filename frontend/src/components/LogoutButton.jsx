import { useNavigate } from 'react-router-dom';
import api from '../api';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } finally {
            navigate('/');
        }
    };

    return (
        <button
            className="m-4 px-3.5 py-2 rounded-md border border-border text-text-h cursor-pointer transition-opacity hover:opacity-85"
            onClick={handleLogout}
        >
            Çıkış yap
        </button>
    );
}

export default LogoutButton;
