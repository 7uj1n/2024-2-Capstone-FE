import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import KakaoMap from './components/Kakaomap';
import Header from './components/UI/Header';
import Sidebar from './components/UI/Sidebar';
import LoginPage from './components/Page/LoginPage';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; //라우터

import RoadPage from './components/Page/RoadPage';
import SignUpPage from './components/Page/SignUpPage';

function AppContent() {
  const location = useLocation();
  const showSidebar = location.pathname === '/path' || location.pathname === '/road';

  return (
    <>
      <Header />
      {showSidebar && <Sidebar />}
      <Routes>
        <Route path="/path" element={<KakaoMap />} /> {/*최적 경로 찾기*/}
        <Route path="/road" element={<RoadPage />} /> {/*도로 혼잡도*/}
        <Route path="/" element={<LoginPage />} /> {/* 기본 페이지 설정 */}
        <Route path='/signup' element={<SignUpPage />} /> {/*회원가입 페이지*/}
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;