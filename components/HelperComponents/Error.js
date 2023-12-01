import React from "react";
import {WomanOutlined} from '@ant-design/icons'
import styled from '/public/styles/all.module.css';
function ErrorComponent({ errorMessage }) {
  return (
    <div className={styled.errorTop}>
      <WomanOutlined
        style={{
          fontSize: "20px",
          color: "#fe6f8a",
        }}
      />
      <p className={styled.errorName}>{errorMessage}</p>
    </div>
  );
}

export default ErrorComponent;
