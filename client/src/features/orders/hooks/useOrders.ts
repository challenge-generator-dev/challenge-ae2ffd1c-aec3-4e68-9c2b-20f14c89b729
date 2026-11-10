import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderEntity, CreateOrderDto, UpdateOrderDto } from '@/types/order';
import { orderService } from '@/services/order.service';
import { handleApiError } from '@/utils/errorHandler';

interface UseOrdersOptions {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const useOrders = (options?: UseOrdersOptions) => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<OrderEntity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAllOrders(),
    staleTime: 30000,
    retry: 2,
    refetchOnWindowFocus: false
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderDto) => orderService.createOrder(data),
    onSuccess: (newOrder) => {
      queryClient.setQueryData<OrderEntity[]>(['orders'], (old) => {
        if (!old) return [newOrder];
        return [...old, newOrder];
      });
      options?.onSuccess?.('Orden creada exitosamente');
      setIsFormOpen(false);
    },
    onError: (error) => {
      const message = handleApiError(error);
      options?.onError?.(message);
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderDto }) => 
      orderService.updateOrder(id, data),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData<OrderEntity[]>(['orders'], (old) => {
        if (!old) return old;
        return old.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        );
      });
      options?.onSuccess?.('Orden actualizada exitosamente');
      setSelectedOrder(null);
      setIsFormOpen(false);
    },
    onError: (error) => {
      const message = handleApiError(error);
      options?.onError?.(message);
    }
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<OrderEntity[]>(['orders'], (old) => {
        if (!old) return old;
        return old.filter(order => order.id !== deletedId);
      });
      options?.onSuccess?.('Orden eliminada exitosamente');
    },
    onError: (error) => {
      const message = handleApiError(error);
      options?.onError?.(message);
    }
  });

  const handleCreateOrder = useCallback((data: CreateOrderDto) => {
    createOrderMutation.mutate(data);
  }, [createOrderMutation]);

  const handleUpdateOrder = useCallback((id: string, data: UpdateOrderDto) => {
    updateOrderMutation.mutate({ id, data });
  }, [updateOrderMutation]);

  const handleDeleteOrder = useCallback((id: string) => {
    deleteOrderMutation.mutate(id);
  }, [deleteOrderMutation]);

  const handleEditOrder = useCallback((order: OrderEntity) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  }, []);

  const handleNewOrder = useCallback(() => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setSelectedOrder(null);
    setIsFormOpen(false);
  }, []);

  const orders = useMemo(() => ordersQuery.data || [], [ordersQuery.data]);
  
  const isLoading = ordersQuery.isLoading || 
    createOrderMutation.isPending || 
    updateOrderMutation.isPending;
  
  const isDeleting = deleteOrderMutation.isPending;
  
  const error = ordersQuery.error || 
    createOrderMutation.error || 
    updateOrderMutation.error || 
    deleteOrderMutation.error;

  return {
    orders,
    isLoading,
    isDeleting,
    error,
    selectedOrder,
    isFormOpen,
    isCreating: createOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    handleCreateOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    handleEditOrder,
    handleNewOrder,
    handleCloseForm,
    refetch: ordersQuery.refetch
  };
};