import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrders } from './hooks/useOrders';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';
import { OrderEntity, CreateOrderDto, UpdateOrderDto } from '@/types/order';
import { ErrorNotification } from '@/shared/components/ErrorNotification';

export function OrdersPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderEntity | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    refetch
  } = useOrders();

  const handleCreate = useCallback(async (data: CreateOrderDto) => {
    try {
      await createOrder(data);
      setShowForm(false);
      refetch();
    } catch (err) {
      console.error('Error al crear orden:', err);
    }
  }, [createOrder, refetch]);

  const handleUpdate = useCallback(async (data: UpdateOrderDto) => {
    if (!selectedOrder) return;
    try {
      await updateOrder({ id: selectedOrder.id, data });
      setIsEditing(false);
      setSelectedOrder(null);
      refetch();
    } catch (err) {
      console.error('Error al actualizar orden:', err);
    }
  }, [selectedOrder, updateOrder, refetch]);

  const handleDelete = useCallback(async (orderId: string) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta orden?');
    if (!confirmed) return;
    try {
      await deleteOrder(orderId);
      refetch();
    } catch (err) {
      console.error('Error al eliminar orden:', err);
    }
  }, [deleteOrder, refetch]);

  const handleEdit = useCallback((order: OrderEntity) => {
    setSelectedOrder(order);
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setIsEditing(false);
    setSelectedOrder(null);
  }, []);

  const handleViewDetails = useCallback((order: OrderEntity) => {
    navigate(`/orders/${order.id}`);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="orders-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <header className="orders-page__header">
        <h1>Gestión de Órdenes</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Nueva Orden
        </button>
      </header>

      {error && (
        <ErrorNotification
          message={error.message || 'Error al cargar las órdenes'}
          onRetry={refetch}
        />
      )}

      {(showForm || isEditing) && (
        <div className="orders-page__form-overlay">
          <OrderForm
            order={selectedOrder}
            onSubmit={isEditing ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEditing={isEditing}
          />
        </div>
      )}

      <main className="orders-page__content">
        <OrderList
          orders={orders}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      </main>
    </div>
  );
}