import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Protected from './components/Protected';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/protected" element={<Protected />} />
    </Routes>
  );
}
export default App;


