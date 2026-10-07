import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from './NoteList';
import LogoutButton from './LogoutButton';
import api from '../api';
function Protected() {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await api.get('/verify-token');
            } catch {
                navigate('/');
            }
        }

        verifyToken();
    }, [navigate]);

    return <div>
        <LogoutButton />
        <NoteList />
    </div>;
}

export default Protected;
