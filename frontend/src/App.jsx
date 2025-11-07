import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatPage from "./pages/ChatPage";
import Profile from "./components/Profile";

function App() {
  const [joined, setJoined] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthProvider>
      <div className="flex flex-col items-center h-screen bg-gray-100 p-6 w-full">
        {!joined ? (
          showRegister ? (
            <div>
              <Register onRegistered={() => setShowRegister(false)} />
              <p
                className="text-sm text-gray-500 mt-2 cursor-pointer"
                onClick={() => setShowRegister(false)}
              >
                Already have an account? Login
              </p>
            </div>
          ) : (
            <div>
              <Login onJoin={() => setJoined(true)} />
              <p
                className="text-sm text-gray-500 mt-2 cursor-pointer"
                onClick={() => setShowRegister(true)}
              >
                Don't have an account? Register
              </p>
            </div>
          )
        ) : (
          // When user is logged inn
          <div className="flex flex-row w-full h-full gap-4">
            <div className="flex-1">
              <ChatPage />
            </div>
            <div className="w-1/4">
              <Profile onLogout={() => setJoined(false)} />
            </div>
          </div>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
