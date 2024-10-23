import {BrowserRouter, Routes, Route} from "react-router-dom"
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import EditUser from "./components/EditUser";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserList/>}/>
        <Route path="/user/add" element={<AddUser/>}/>
        <Route path="/user/edit/:id" element={<EditUser/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
