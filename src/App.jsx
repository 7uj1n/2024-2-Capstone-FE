import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/UI/Header';
import Sidebar from './components/UI/Sidebar';

import LoginPage from './components/Page/LoginPage';
import RoadPage from './components/Page/RoadPage';
import SignUpPage from './components/Page/SignUpPage';
import MainPage from './components/Page/MainPage';
import PathPage from './components/Page/PathPage';
import ResultPage from './components/Page/ResultPage';
import MyPage from './components/Page/MyPage';
import MyCommentsPage from './components/Page/MyCommentsPage';

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'; //라우터
import ForgotPassword from './components/Page/ForgotPassword';
import { useEffect } from 'react';
import useStore from './store/UserStore';

function AppContent() {
  const location = useLocation();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setToken = useStore((state) => state.setToken);
  const setExpiresIn = useStore((state) => state.setExpiresIn);
  const setUsername = useStore((state) => state.setUsername);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');
    const username = localStorage.getItem('username');
    if (token && expiresIn) {
      const expirationTime = parseInt(expiresIn, 10);
      if (new Date().getTime() < expirationTime) {
        setToken(token);
        setExpiresIn(expiresIn);
        setUsername(username);
        setIsAuthenticated(true);
      }
    }
  }, [setIsAuthenticated, setToken, setExpiresIn, setUsername]);

  const PrivateRoute = ({ element }) => {
    if (isAuthenticated) {
      return element;
    } else {
      alert('로그인이 필요합니다.');
      return <Navigate to="/login" />;
    }
  };

  const showSidebar = isAuthenticated && (location.pathname === '/path' || location.pathname === '/road' || location.pathname === '/result');

  return (
    <>
      <Header />
      {showSidebar && <Sidebar />}
      <Routes>
        <Route path="/" element={<MainPage />} /> {/* 기본 페이지 설정 */}
        <Route path="/path" element={<PrivateRoute element={<PathPage />} />} /> {/*최적 경로 찾기*/}
        <Route path="/road" element={<PrivateRoute element={<RoadPage />} />} /> {/*도로 혼잡도*/}
        <Route path="/login" element={<LoginPage />} /> {/* 로그인 페이지 */}
        <Route path='/signup' element={<SignUpPage />} /> {/*회원가입 페이지*/}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/*비밀번호 찾기 페이지*/}
        <Route path="/result" element={<PrivateRoute element={<ResultPage />} />} /> {/*경로 결과 페이지*/}
        <Route path="/mypage" element={<PrivateRoute element={<MyPage />} />} /> {/*마이 페이지 !로그인 필수*/}
        <Route path="/my-comments" element={<PrivateRoute element={<MyCommentsPage />} />} /> {/*작성한 댓글 페이지 !로그인 필수*/}
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