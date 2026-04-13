import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Post from "./pages/post";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={< Home/>} />
        < Route path="/post" element={<Post />}  />
      </Routes>  
    </>
  );
}

export default App;
