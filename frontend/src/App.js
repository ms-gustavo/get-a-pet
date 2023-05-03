import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

// Components
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";

// Pages
import Home from "./components/pages/Auth/Home";
import Register from "./components/pages/Auth/Register";
import Login from "./components/pages/Auth/Login";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
