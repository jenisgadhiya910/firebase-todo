import React from "react";
import { BrowserRouter } from "react-router-dom";
import { UserAuthContextProvider } from "./Context/UserAuthContext";
import Routes from "./Routes";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <UserAuthContextProvider>
          <Routes />
        </UserAuthContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
