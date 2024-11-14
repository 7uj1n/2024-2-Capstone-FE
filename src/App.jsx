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

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; //라우터
import ForgotPassword from './components/Page/ForgotPassword';

function AppContent() {
  const location = useLocation();
  const showSidebar = location.pathname === '/path' || location.pathname === '/road' || location.pathname === '/result';

  return (
    <>
      <Header />
      {showSidebar && <Sidebar />}
      <Routes>
        <Route path="/" element={<MainPage />} /> {/* 기본 페이지 설정 */}
        <Route path="/path" element={<PathPage />} /> {/*최적 경로 찾기*/}
        <Route path="/road" element={<RoadPage />} /> {/*도로 혼잡도*/}
        <Route path="/login" element={<LoginPage />} /> {/* 기본 페이지 설정 */}
        <Route path='/signup' element={<SignUpPage />} /> {/*회원가입 페이지*/}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/*작성한 댓글 페이지 !로그인 필수*/}
        <Route path="/result" element={<ResultPage />} /> {/*경로 결과 페이지*/}
        <Route path="/mypage" element={<MyPage />} /> {/*마이 페이지 !로그인 필수*/}
        <Route path="/my-comments" element={<MyCommentsPage />} /> {/*작성한 댓글 페이지 !로그인 필수*/}
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