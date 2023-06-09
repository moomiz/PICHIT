import { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import Footer from "./Presentational/common/Footer";

import "./font.css";

import Navigation from "./Presentational/common/Navigation/Navigation";
import InterviewPage from "./Presentational/pages/Interview/InterviewPage";
import MainPage from "./Presentational/pages/MainPage";
import ReviewPage from "./Presentational/pages/ReviewPage";
import RoomPage from "./Presentational/pages/RoomPage";
import NotFoundPage from "./Presentational/pages/NotFound/NotFoundPage";
import { GlobalStyle } from "./action/GlobalStyle";
import { useDispatch, useSelector } from "react-redux";
import { KAKAO_AUTH_SERVER } from "./store/values";
import { slicer } from "./reducer/tokenSlicer";
import { setUserInfo } from "./reducer/userStore";
import axios from "axios";

import { PITCHIT_URL } from "./store/values";

function App() {
  const { pathname } = useLocation();
  const [popup, setPopup] = useState();
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const handleOpenPop = () => {
    //팝업 생성 함수
    const width = 400;
    const height = 700;

    //팝업 창 생성
    const popup = window.open(KAKAO_AUTH_SERVER, "KAKAO", `width=${width}, height=${height}, top=${100}, left=${600}`);

    setPopup(popup);
  };

  useEffect(() => {
    //이벤트가 발생하면
    const currentURL = window.location.href;
    // url 객체 생성, 토큰 값만 정제해서 postMessage로 send
    const searchParams = new URL(currentURL).search.slice(7);

    //부모 객체로 searchParams 전송
    if (searchParams)
      window.opener.postMessage(searchParams, window.location.origin);
  }, []);

  useEffect(() => {
    //팝업창이 생성되면
    const kakaoOAuthCodeListener = (e) => {
      if (e.origin !== window.location.origin) return;

      //postMessage로 보낸 searchParams값이 들어있음(토큰)
      const token = e.data;

      //Redux state 저장
      dispatch(slicer(token));

      //로컬스토리지에 token이란 이름으로 값 저장
      localStorage.setItem("token", token);

      //작업 완료 후 알아서 팝업창 꺼지게
      popup?.close();
      setPopup(null);
    };

    if (!popup) {
      return;
    } else {
      //postMessage로 값 받기
      window.addEventListener("message", kakaoOAuthCodeListener, false);
    }

    //message 이벤트 끝난 후 팝업 정리
    return () => {
      window.removeEventListener("message", kakaoOAuthCodeListener);
      popup?.close();
      setPopup(null);

      window.location.reload();
    };
  }, [popup]);

  useEffect(() => {
    if (token !== null) {
      axios({
        method: "GET",
        url: `${PITCHIT_URL}/userinfo`,
        headers: {
          Authorization: token,
        },
      })
        .then((res) => {
          dispatch(setUserInfo(res.data));
        })
        .catch((err) => console.log(err));
    }
  }, [token]);

  return (
    <AppContainer>
      <GlobalStyle />


      {/* 반응형 */}
      <BlockBox>
        해당 서비스는
        <br />
        PC에서만 제공하고 있습니다
      </BlockBox>

      {pathname.includes("interview") ? null : (
        <Navigation handleOpenPop={handleOpenPop} />
      )}

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/room/:id" element={<RoomPage />} />
        <Route path="/interview/*" element={<InterviewPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>

      {pathname.includes("interview") ? null : <Footer />}
    </AppContainer>
  );
}

export default App;

const BlockBox = styled.div`
  display: none;

  @media (max-width: 992px) {
    display: flex;
    position: fixed;
    z-index: 9999;
    width: 100%;
    height: 100%;
    padding: 3rem;
    justify-content: center;
    align-items: center;
    font-size: 300%;
    color: var(--white);
    background-color: var(--primary);
  }
`;

const AppContainer = styled.div`
  position: relative;
  height: 100%;
  padding: 0;
`;
