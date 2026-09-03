import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeManagement from "./pages/EmployeeManagement";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<EmployeeManagement />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
