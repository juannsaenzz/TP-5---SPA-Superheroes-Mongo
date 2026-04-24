import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroList from './components/HeroList';
import HeroDetail from './components/HeroDetail';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* El menú para navegar entre casas */}
      <Routes>
        <Route path="/" element={<HeroList casa="" />} />
        <Route path="/marvel" element={<HeroList casa="Marvel" />} />
        <Route path="/dc" element={<HeroList casa="DC" />} />
        <Route path="/heroe/:id" element={<HeroDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;