//import { Dashboard } from "@mui/icons-material";
import SignIn from "./LoginFolder/Login.jsx";
import Dashboard from "./Dashboard1.jsx";
import { Route, Routes } from "react-router-dom";
import './assets/styles/global.css'; // Adjust the path to where you placed the global stylesheet
//import TableTest from "./TableOnly/text.jsx";

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
       {/*<Route path="/tabletest" element={<TableTest />} />*/} 
      </Routes>
    </div>
  );
}

export default App;
