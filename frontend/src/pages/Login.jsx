import { useState } from "react";
import api from "../services/api";

export default function Login({ setToken, goToRegister }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    if (!username || !password) {
      alert("Username & password required");
      return;
    }

    try {

      const res = await api.post("/login", {
        username: username,
        password: password,
      });

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      setToken(res.data.access_token);

    } catch (err) {

      console.error(
        err.response?.data || err.message
      );

      alert("Invalid credentials ❌");

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-lg rounded-xl p-8 w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Analytics Login 📊
        </h2>

        <input
          placeholder="Username"
          className="border p-2 w-full mb-4 rounded"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-6 rounded"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p
          onClick={goToRegister}
          className="text-sm text-blue-600 mt-4 text-center cursor-pointer hover:underline"
        >
          New user? Create account →
        </p>

      </div>

    </div>
  );
}
