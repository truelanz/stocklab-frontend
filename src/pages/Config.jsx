import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Config() {
return (
    <div className="config-page" style = {styles.configPage}>
      <h2 className="config-title">Página em construição ...</h2>

    </div>
  );
}

const styles = {
  configPage: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    alignItems: "center",
    fontSize: "24px",
    color: "#555",
  }
};

export default Config;