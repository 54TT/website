
import React from "react";
import styled from "styled-components";
import {WomanOutlined} from '@ant-design/icons'
function ErrorComponent({ errorMessage }) {
  return (
    <ErrorContainer>
      <WomanOutlined
        style={{
          fontSize: "1.31rem",
          color: "#fe6f8a",
        }}
      />
      <ErrorText>{errorMessage}</ErrorText>
    </ErrorContainer>
  );
}

export default ErrorComponent;

export const ErrorText = styled.p`
  color: #fe6f8a;
  font-size: 0.93rem;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  margin-left: 0.3rem;
`;

export const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  width: 100%;
  margin-bottom: -1.15rem;
`;
