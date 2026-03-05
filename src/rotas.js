import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext/AuthProvider";
import { GlobalProvider } from "./contexts/globalContext";
import useAuth from "./hooks/useAuth";

const Login = lazy(() => import("./pages/Login/index"));
const Cadastro = lazy(() =>
  import("./components/componentsLogin/Cadastrese/cadastrese")
);
const Home = lazy(() => import("./pages/Home"));
const Clientes = lazy(() => import("./pages/Clientes"));
const Cobrancas = lazy(() => import("./pages/Cobrancas"));
const DetalharCliente = lazy(() => import("./pages/DetalharCliente"));

function RotasProtegidas({ children, redirectTo }) {
  const auth = useAuth();
  return auth.token ? children : <Navigate to={redirectTo} />
}

function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <Router>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="*" element={
                <RotasProtegidas redirectTo={'/'}>
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/cobrancas" element={<Cobrancas />} />
                    <Route path="/clientes/detalhar" element={<DetalharCliente />} />
                  </Routes>
                </RotasProtegidas>
              } />
            </Routes>
          </Suspense>
        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
