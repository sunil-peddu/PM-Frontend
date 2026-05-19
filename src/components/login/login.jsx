import bgImage from "../../assets/Vector.png";
import object1 from "../../assets/Object.png";
import object2 from "../../assets/Object-2.png";
import { MoveRight, Eye, EyeOff } from "lucide-react";
import { URL } from "../../url";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../AuthProvider/AuthProvider";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${URL}/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        },
      );

      const responseData = response.data;

      // API response data
      const data = responseData.data;

      // Save token + user
      login(data, data.token);

      toast.success(responseData.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <main
        className="relative min-h-screen bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Top Left Object */}
        <figure className="absolute top-0 left-0">
          <img src={object1} alt="login page image" />
        </figure>
        <div className="absolute top-62 left-14 text-white ">
          <p className="font-bold text-5xl pb-2 max-w-md leading-tight">
            Project Management
          </p>
          <p className="text-lg">
            Collaborate, track, and deliver projects faster.
          </p>
        </div>
        {/* Bottom Right Object */}
        <figure className="absolute bottom-0 right-0">
          <img src={object2} alt="login page image" />
        </figure>
        <div className="absolute right-15 top-24  w-110 h-120 p-10 rounded-xl border border-white/40 bg-white/20 backdrop-blur-xs ">
          <p className="text-center text-white font-bold text-4xl">Login</p>
          <form onSubmit={handleLogin} className="text-base">
            {/* Email */}
            <div className="pt-10">
              <label className="block text-white text-base pb-1">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white rounded-lg p-3 outline-none"
              />
            </div>

            {/* Password */}
            <div className="pt-6">
              <label className="block text-white text-base pb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white rounded-lg p-3 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="pt-10">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#DC3845] hover:bg-[#c72f3c] transition-all duration-300 flex items-center justify-center gap-4 text-white p-3 rounded-lg cursor-pointer"
              >
                {loading ? "Loading..." : "Lets Go"} <MoveRight />
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default Login;
