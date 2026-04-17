export default function Navbar({ setToken }) {
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="bg-white shadow px-10 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">
        Vigility Analytics 🚀
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}