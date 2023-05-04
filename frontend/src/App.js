import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Components
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import Container from "./components/layouts/Container";
import Message from "./components/layouts/Message";

// Pages
import Home from "./components/pages/Auth/Home";
import Register from "./components/pages/Auth/Register";
import Login from "./components/pages/Auth/Login";
import Profile from "./components/pages/User/Profile";
// Contexts
import { UserProvider } from "./context/UserContext";
import MyPets from "./components/pages/Pets/Mypets";

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/pets/mypets" element={<MyPets />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
