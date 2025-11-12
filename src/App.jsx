// src/App.jsx
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import Health from "./pages/Health";
import Deposits from "./pages/Deposits";
import Withdrawals from "./pages/Withdrawals";
import Members from "./pages/Members";
import History from "./pages/History";
import Banks from "./pages/Banks";

const Nav = () => (
  <div className="w-full bg-[#0b1220] border-b border-white/5">
    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <div className="text-lg text-yellow-400 font-semibold">Admin <span className="text-gray-300">Panel</span> <span className="text-xs text-gray-500">v0.1</span></div>
      <div className="flex gap-6 text-sm">
        {["/health","/deposits","/withdrawals","/members","/history","/banks"].map((p,i)=>(
          <NavLink key={p} to={p} className={({isActive}) => isActive ? "text-white" : "text-gray-300 hover:text-white"}>
            {["Health","Deposits","Withdrawals","Members","History","Banks"][i]}
          </NavLink>
        ))}
      </div>
    </div>
  </div>
);

const Layout = ({ children }) => (
  <div className="min-h-screen bg-[#0a0f1a] text-gray-100">
    <Nav/>
    <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
    <footer className="text-center text-sm text-gray-500 py-8">© 2025 — Admin Panel</footer>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Health/></Layout>} />
        <Route path="/health" element={<Layout><Health/></Layout>} />
        <Route path="/deposits" element={<Layout><Deposits/></Layout>} />
        <Route path="/withdrawals" element={<Layout><Withdrawals/></Layout>} />
        <Route path="/members" element={<Layout><Members/></Layout>} />
        <Route path="/history" element={<Layout><History/></Layout>} />
        <Route path="/banks" element={<Layout><Banks/></Layout>} />
        <Route path="*" element={<Layout><Health/></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
