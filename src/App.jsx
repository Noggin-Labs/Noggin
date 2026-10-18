import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import Games from "./components/pages/Games";

function PageNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-3xl font-extrabold text-foreground">Page not found</h1>
      <p className="text-muted-foreground">The page you requested does not exist.</p>
      <a className="rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground" href="/">
        Return home
      </a>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/student" element={<Navigate to="/games" replace />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
