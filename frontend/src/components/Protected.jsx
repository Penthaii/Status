import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from './NoteList';
import api from '../api';
function Protected() {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                navigate('/')
                return;
            }

            try {
                await api.get(`/verify-token/${token}`);
            } catch (error) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }

        verifyToken();
    }, [navigate]);

    return <div>
        <NoteList />
    </div>;
}

export default Protected;
