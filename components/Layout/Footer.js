import React from "react";
const Footer = () => {
  return (
    <div className="pt-9 pb-9" style={{ backgroundColor: "#142029" }}>
      <p className="text-gray-400">©{new Date().getFullYear()} - LaslesVPN</p>
    </div>
  );
};

export default Footer;
