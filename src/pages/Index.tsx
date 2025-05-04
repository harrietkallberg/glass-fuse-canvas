
import React from "react";
import { Navigate } from "react-router-dom";

// This component redirects to our Landing page
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
