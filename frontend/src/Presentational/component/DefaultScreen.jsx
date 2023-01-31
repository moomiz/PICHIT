import React, { useState } from "react";
import styled from "styled-components";
import {
  BsFillMicFill,
  BsFillMicMuteFill,
} from "react-icons/bs";
import {
    IoVideocam,
    IoVideocamOff
} from "react-icons/io5"

// OpenVidu 관련 Import
import OpenViduVideoComponent from "../component/Chat/OpenVidu/OvVideo";
import {
  selectInterviwee
} from '../../action/modules/chatModule';
import { useDispatch } from "react-redux";

const DefaultScreen = ({streamManager, name, session}) => {
  let dispatch = useDispatch();

  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  return (
    <ScreenContainer className="ScreenChild"onClick={() =>{
      selectInterviwee(streamManager.stream.connection.connectionId, session);
    }}>
      {name!==null && name !== undefined ? name : null}
      {streamManager !== null ? 
        <OpenViduVideoComponent streamManager={streamManager} /> :
        null
      }
      <Submenu>
        <Icon
          onClick={() => {
            setIsCamOn(!isCamOn);
          }}
        >
          {isCamOn ? <IoVideocam /> : <IoVideocamOff />}
        </Icon>
        <Icon
          onClick={() => {
            setIsMicOn(!isMicOn);
          }}
        >
          {isMicOn ? <BsFillMicFill /> : <BsFillMicMuteFill />}
        </Icon>
      </Submenu>
    </ScreenContainer>
  );
};

export default DefaultScreen;

const Icon = styled.div``;

const Submenu = styled.div`
  position: relative;
  width: 12vw;
  height: 5vh;
  top: 20vh;
  left: 45%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  font-size: 1em;
  gap: 0.5em;
`;

const ScreenContainer = styled.div`
  background-color: black;
  color: white;
  border-radius: 1em;
  overflow: hidden;
  min-width: 25vw;
  min-height: 30vh;
  text-align: center;
`;