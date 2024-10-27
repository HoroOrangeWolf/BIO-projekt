import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const authCheckComplete = useSelector((state: any) => state.auth.authCheckComplete);

  if (!authCheckComplete) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
