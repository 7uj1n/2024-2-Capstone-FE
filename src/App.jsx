import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/UI/Header';
import Sidebar from './components/UI/Sidebar';

import LoginPage from './components/Page/LoginPage';
import RoadPage from './components/Page/RoadPage';
import SignUpPage from './components/Page/SignUpPage';
import MainPage from './components/Page/MainPage';
import PathPage from './components/Page/PathPage';
import PathResultPage from './components/Page/PathResultPage';
import MyPage from './components/Page/MyPage';
import MyCommentsPage from './components/Page/MyCommentsPage';
import ForgotPassword from './components/Page/ForgotPassword';
import RoadResultPage from './components/Page/RoadResultPage';
import AirportCongestionPage from './components/Page/AirportCongestionPage';

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'; //라우터
import { useEffect, useState } from 'react';
import useStore from './store/UserStore';

function AppContent() {
  const location = useLocation();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setToken = useStore((state) => state.setToken);
  const setExpiresIn = useStore((state) => state.setExpiresIn);
  const setUsername = useStore((state) => state.setUsername);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');
    const username = localStorage.getItem('username');
    if (token && expiresIn && username) {
      const expirationTime = parseInt(expiresIn, 10);
      if (new Date().getTime() < expirationTime) {
        setToken(token);
        setExpiresIn(expiresIn);
        setUsername(username);
        setIsAuthenticated(true);
      }
    }
    setIsAuthChecked(true);
  }, [setIsAuthenticated, setToken, setExpiresIn, setUsername]);

  const PrivateRoute = ({ element }) => {
    if (isAuthenticated) {
      return element;
    } else {
      alert('로그인이 필요합니다.');
      return <Navigate to="/login" />;
    }
  };

  if (!isAuthChecked) {
    return null; // 인증 여부를 확인하기 전에는 아무것도 렌더링하지 않음
  }

  const showSidebar = isAuthenticated && (location.pathname === '/path' || location.pathname === '/road-result' || location.pathname === '/road' || location.pathname === '/path-result' || location.pathname === '/airport-congestion');

  return (
    <>
      <Header />
      {showSidebar && <Sidebar />}
      <Routes>
        <Route path="/" element={<MainPage />} /> {/* 기본 페이지 설정 */}
        <Route path="/path" element={<PrivateRoute element={<PathPage />} />} /> {/*최적 경로 찾기*/}
        <Route path="/road" element={<PrivateRoute element={<RoadPage />} />} /> {/*도로 혼잡도*/}
        <Route path="/road-result" element={<PrivateRoute element={<RoadResultPage />} />} /> {/*도로 혼잡도 결과*/}
        <Route path="/login" element={<LoginPage />} /> {/* 로그인 페이지 */}
        <Route path='/signup' element={<SignUpPage />} /> {/*회원가입 페이지*/}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/*비밀번호 찾기 페이지*/}
        <Route path="/path-result" element={<PrivateRoute element={<PathResultPage />} />} /> {/*경로 결과 페이지*/}
        <Route path="/mypage" element={<PrivateRoute element={<MyPage />} />} /> {/*마이 페이지 !로그인 필수*/}
        <Route path="/my-comments" element={<PrivateRoute element={<MyCommentsPage />} />} /> {/*작성한 댓글 페이지 !로그인 필수*/}
        <Route path="/airport-congestion" element={<PrivateRoute element={<AirportCongestionPage />} />} /> {/*공항 혼잡도 예측 페이지 !로그인 필수*/}
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