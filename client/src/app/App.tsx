import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorNotification } from '@shared/components/ErrorNotification';
import routes from './routes';

/**
 * Componente raíz de la aplicación que gestiona las rutas y el manejo global de errores.
 * Implementa un ErrorBoundary para capturar errores no manejados en componentes hijos.
 */
const App = () => {
  const location = useLocation();
  const [errorKey, setErrorKey] = useState<number>(0);

  const handleReset = () => {
    setErrorKey(prevKey => prevKey + 1);
  };

  return (
    <div className="app-container">
      <ErrorBoundary
        key={errorKey}
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <ErrorNotification
            error={error}
            onRetry={() => {
              resetErrorBoundary();
              handleReset();
            }}
          />
        )}
        onReset={handleReset}
      >
        <Routes location={location} key={location.pathname}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          ))}
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;