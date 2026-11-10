import React from 'react';
import { OrderEntity } from '@/types/order';
import './OrderItem.css';

interface OrderItemProps {
  order: OrderEntity;
  onEdit: (order: OrderEntity) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const OrderItem: React.FC<OrderItemProps> = ({
  order,
  onEdit,
  onDelete,
  isDeleting = false
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      pending: 'status-pending',
      processing: 'status-processing',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return statusColors[status.toLowerCase()] || 'status-default';
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      processing: 'Procesando',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return labels[status.toLowerCase()] || status;
  };

  const handleDeleteClick = () => {
    if (window.confirm(`¿Estás seguro de eliminar la orden ${order.id}?`)) {
      onDelete(order.id);
    }
  };

  return (
    <div className="order-item" data-testid={`order-item-${order.id}`}>
      <div className="order-item__header">
        <h3 className="order-item__id">Orden #{order.id.slice(0, 8).toUpperCase()}</h3>
        <span className={`order-item__status ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>
      
      <div className="order-item__details">
        <div className="order-item__date">
          <span className="order-item__label">Fecha de creación:</span>
          <span className="order-item__value">{formatDate(order.createdAt)}</span>
        </div>
        
        <div className="order-item__products">
          <span className="order-item__label">Productos ({order.products?.length || 0}):</span>
          <ul className="order-item__product-list">
            {order.products?.map((product, index) => (
              <li key={index} className="order-item__product">
                {product.name} - ${product.price.toFixed(2)} x {product.quantity}
              </li>
            ))}
          </ul>
        </div>
        
        {order.total !== undefined && (
          <div className="order-item__total">
            <span className="order-item__label">Total:</span>
            <span className="order-item__value order-item__total-value">
              ${order.total.toFixed(2)}
            </span>
          </div>
        )}
      </div>
      
      <div className="order-item__actions">
        <button
          className="order-item__button order-item__button--edit"
          onClick={() => onEdit(order)}
          disabled={isDeleting}
          aria-label={`Editar orden ${order.id}`}
        >
          Editar
        </button>
        <button
          className="order-item__button order-item__button--delete"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          aria-label={`Eliminar orden ${order.id}`}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  );
};