import { Navigate, Outlet } from "react-router-dom";
function ProtectedRoutes () {
  let auth = !!localStorage.getItem('isAuthenticated') ;
  return auth ? <Outlet /> : <Navigate to="/login"  replace={true}  />;
};
export default ProtectedRoutes;
