import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from './NoteList';
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
                const response = await fetch(`http://localhost:8000/verify-token/${token}`);
                if (!response.ok) {
                    throw new Error('Token doğrulanamadı');
                }
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
