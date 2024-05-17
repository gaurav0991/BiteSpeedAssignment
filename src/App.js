import React from "react";
import "./App.css"
import Flow from "./Components/BiteSpeedFlow.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import "./styles.css";

export default function App() {
  return (
    <div>
              <ToastContainer />

      <Flow />
    </div>
  );
}
