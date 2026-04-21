import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./services/ProtectedRoute";
import PublicRoute from "./services/PublicRoute";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ItemDetails from "./pages/ItemDetails.jsx";
import CreateItem from "./pages/CreateItem.jsx";
import MyItems from "./pages/MyItems.jsx";
import Developer from "./pages/Developer.jsx";
import DeveloperProfile from "./pages/DeveloperProfile.jsx";
import "./index.css";
import "./App.css";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/developer" element={<Developer />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/report" element={<CreateItem />} />
          <Route path="/report/:id/edit" element={<CreateItem />} />
          <Route path="/profile" element={<MyItems />} />
          <Route path="/developer-profile" element={<DeveloperProfile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
