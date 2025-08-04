import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useProtectedNavigation = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navigateToProtectedRoute = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/login', { state: { from: { pathname: path } } });
    }
  };

  return { navigateToProtectedRoute, isAuthenticated };
};
