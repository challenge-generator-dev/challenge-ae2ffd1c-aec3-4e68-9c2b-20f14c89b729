import { OrderEntity } from '@/types/order';

interface OrderListProps {
  orders: OrderEntity[];
  onEdit: (order: OrderEntity) => void;
  onDelete: (orderId: string) => void;
  onViewDetails: (order: OrderEntity) => void;
}

export function OrderList({ orders, onEdit, onDelete, onViewDetails }: OrderListProps) {
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: '#ffa500',
      processing: '#1e90ff',
      completed: '#32cd32',
      cancelled: '#dc143c'
    };
    return colors[status] || '#808080';
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      processing: 'Procesando',
      completed: 'Completado',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTotalItems = (products: Array<{ productId: string; quantity: number }>): number => {
    return products.reduce((total, product) => total + product.quantity, 0);
  };

  if (orders.length === 0) {
    return (
      <div className="order-list order-list--empty">
        <div className="empty-state">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <h3>No hay órdenes</h3>
          <p>Crea tu primera orden para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-list">
      <table className="order-list__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Correo</th>
            <th>Productos</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="order-item">
              <td className="order-item__id">
                <button
                  className="link-button"
                  onClick={() => onViewDetails(order)}
                  title="Ver detalles"
                >
                  {order.id.substring(0, 8)}...
                </button>
              </td>
              <td className="order-item__customer">{order.customerName}</td>
              <td className="order-item__email">{order.customerEmail}</td>
              <td className="order-item__products">
                <span className="products-count">
                  {getTotalItems(order.products)} items
                </span>
              </td>
              <td className="order-item__status">
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusLabel(order.status)}
                </span>
              </td>
              <td className="order-item__date">
                {formatDate(order.createdAt)}
              </td>
              <td className="order-item__actions">
                <button
                  className="btn btn-icon"
                  onClick={() => onEdit(order)}
                  title="Editar orden"
                  aria-label="Editar orden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  className="btn btn-icon btn-danger"
                  onClick={() => onDelete(order.id)}
                  title="Eliminar orden"
                  aria-label="Eliminar orden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}