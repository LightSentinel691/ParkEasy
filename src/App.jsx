import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthenticationHome from "./Components/Authentication/AuthenticationHome";
import LoginPage from "./Components/Authentication/LoginPage";
import Homepage from "./Components/Homepage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Authentication" element={<AuthenticationHome />}>
            <Route index element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
