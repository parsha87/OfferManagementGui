import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RouterApp from '../routes'; // Default import, not named import
import { useContext, useEffect } from 'react';
import { LoaderContext } from './context/LoaderContext';
import Loader from './pages/Loader';
import { setLoaderHandler } from './context/AxiosContext';

function LoaderManager() {
  const { loading, setLoading } = useContext(LoaderContext);

  useEffect(() => {
    console.log("Setting loader handler");
    setLoaderHandler(setLoading);
  }, [setLoading]);
  console.log("Loader state:", loading);
  return <>{loading && <Loader />}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoaderManager />
        <RouterApp />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
