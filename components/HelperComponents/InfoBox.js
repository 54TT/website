import { XIcon } from "@heroicons/react/solid";
import React from "react";
import styled from '/public/styles/all.module.css'

function InfoBox({ Icon, message, content, setError, marginTop }) {
  return (
    <div
      className={`${styled.infoBoxTop} ${styled.mobliceInfoBoxTop} ${
        marginTop ? "mt-0" : "mt-7"
      }  p-3 rounded-xl shadow-md`} 
    >
      <div
        className={`flex space-x-1 ml-1.5 items-center ${
          setError ? "text-red-600" : ""
        } `}
      >
        <Icon className="h-5" />
        <p className={`${styled.mobliceInfoBox} font-semibold text-lg`}>{message}</p>
      </div>
      <p className={`text-sm ml-3 ${setError ? "text-red-400" : ""}`}>
        {content}
      </p>
      {setError && (
        <XIcon
          className={`h-4 sm:h-6 ${styled.infoBoxIcon}`}
          onClick={() => {
            setError(null);
          }}
        />
      )}
    </div>
  );
}

export default InfoBox;
