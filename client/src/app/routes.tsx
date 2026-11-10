import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { OrdersPage } from '@features/orders/OrdersPage';
import { OrderForm } from '@features/orders/components/OrderForm';
import { OrderItem } from '@features/orders/components/OrderItem';
import { ErrorNotification } from '@shared/components/ErrorNotification';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/orders" replace />,
    index: true,
  },
  {
    path: '/orders',
    element: <OrdersPage />,
    children: [
      {
        index: true,
        element: (
          <div className="orders-list-container">
            <OrdersPage />
          </div>
        ),
      },
      {
        path: 'new',
        element: (
          <div className="order-form-container">
            <OrderForm />
          </div>
        ),
      },
      {
        path: ':id',
        element: (
          <div className="order-detail-container">
            <OrderItem />
          </div>
        ),
      },
      {
        path: ':id/edit',
        element: (
          <div className="order-edit-container">
            <OrderForm isEdit={true} />
          </div>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="not-found-container">
        <ErrorNotification 
          message="Página no encontrada" 
          type="error" 
        />
        <a href="/orders">Volver a Órdenes</a>
      </div>
    ),
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorBoundary: true,
  },
});

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;