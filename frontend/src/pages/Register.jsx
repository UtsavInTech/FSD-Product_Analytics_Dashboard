import { useState } from "react";
import api from "../services/api";

export default function Register({ goToLogin }) {

  const [form, setForm] = useState({
    username: "",
    password: "",
    age: "",
    gender: "",
  });

  const handleRegister = async () => {

    if (!form.username || !form.password) {
      alert("Username & password required");
      return;
    }

    try {
      await api.post("/register", {
        username: form.username,
        password: form.password,
        age: Number(form.age),
        gender: form.gender,
      });

      alert("Registration successful ✅");

      goToLogin();

    } catch (err) {
      console.error(
        err.response?.data || err.message
      );

      alert("Registration failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-lg rounded-xl p-8 w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Register New User 🚀
        </h2>

        <input
          placeholder="Username"
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <input
          placeholder="Age"
          type="number"
          className="border p-2 w-full mb-4 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              age: e.target.value,
            })
          }
        />

        <select
          className="border p-2 w-full mb-6 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              gender: e.target.value,
            })
          }
        >
          <option value="">
            Select Gender
          </option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <button
          onClick={handleRegister}
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Register
        </button>

        {/* LOGIN NAVIGATION */}
        <p
          onClick={goToLogin}
          className="text-sm text-blue-600 mt-4 text-center cursor-pointer hover:underline"
        >
          Already have account? Login →
        </p>

      </div>

    </div>
  );
}