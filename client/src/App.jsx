// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import Cmp from "./Cmp";
// import Header from "./components/Header";
// import Home from "./pages/Home";
// import Createpost from "./pages/Createpost";
import Chatbot from "./Chatbot";

function App() {
 

  return (
    <div>
      {/* <BrowserRouter> */}
        {/* <Header /> */}
        {/* <Routes>
          <Route path="/" element={<Home  />} />
          <Route path="/createpost" element={ <Createpost  />} />
        </Routes> */}
        {/* <Cmp /> */}
        <Chatbot />
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
