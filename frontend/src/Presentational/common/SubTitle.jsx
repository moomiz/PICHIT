import styled from "styled-components";

const SubTitle = (props) => {
    return (
      <>
        <SubTitleText className="SubTitle">{props.title}</SubTitleText>
      </>
    )
}

export default SubTitle;

const SubTitleText =styled.div`
    font-size: 18px;

`