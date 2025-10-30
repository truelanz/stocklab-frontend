import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Report() {
return (
    <div className="report-page" style = {styles.reportPage}>
      <h2 className="report-title">Página em construição ...</h2>

    </div>
  );
}

const styles = {
  reportPage: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    alignItems: "center",
    fontSize: "24px",
    color: "#555",
  }
};

export default Report;