import { useState, useEffect, FormEvent } from 'react';
import { OrderEntity, CreateOrderDto, UpdateOrderDto } from '@/types/order';

interface OrderFormProps {
  order?: OrderEntity | null;
  onSubmit: (data: CreateOrderDto | UpdateOrderDto) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function OrderForm({ order, onSubmit, onCancel, isEditing = false }: OrderFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'cancelled'>('pending');
  const [products, setProducts] = useState<Array<{ productId: string; quantity: number }>>([]);
  const [newProductId, setNewProductId] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName);
      setCustomerEmail(order.customerEmail);
      setStatus(order.status);
      setProducts(order.products);
    }
  }, [order]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customerName.trim()) {
      errors.customerName = 'El nombre del cliente es obligatorio';
    } else if (customerName.length < 2) {
      errors.customerName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!customerEmail.trim()) {
      errors.customerEmail = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errors.customerEmail = 'Ingrese un correo electrónico válido';
    }

    if (products.length === 0) {
      errors.products = 'Debe agregar al menos un producto';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = isEditing
        ? { status, products }
        : { customerName, customerEmail, status, products };
      
      await onSubmit(orderData as CreateOrderDto | UpdateOrderDto);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProduct = () => {
    if (!newProductId.trim()) {
      return;
    }

    const existingIndex = products.findIndex(p => p.productId === newProductId);
    if (existingIndex >= 0) {
      const updatedProducts = [...products];
      updatedProducts[existingIndex].quantity += newQuantity;
      setProducts(updatedProducts);
    } else {
      setProducts([...products, { productId: newProductId, quantity: newQuantity }]);
    }

    setNewProductId('');
    setNewQuantity(1);
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter(p => p.productId !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setProducts(
      products.map(p =>
        p.productId === productId ? { ...p, quantity } : p
      )
    );
  };

  return (
    <div className="order-form">
      <h2>{isEditing ? 'Editar Orden' : 'Nueva Orden'}</h2>
      
      <form onSubmit={handleSubmit} className="order-form__content">
        <div className="form-group">
          <label htmlFor="customerName">Nombre del Cliente</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            disabled={isSubmitting}
            className={validationErrors.customerName ? 'input-error' : ''}
          />
          {validationErrors.customerName && (
            <span className="error-message">{validationErrors.customerName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="customerEmail">Correo Electrónico</label>
          <input
            id="customerEmail"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            disabled={isSubmitting}
            className={validationErrors.customerEmail ? 'input-error' : ''}
          />
          {validationErrors.customerEmail && (
            <span className="error-message">{validationErrors.customerEmail}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            disabled={isSubmitting}
          >
            <option value="pending">Pendiente</option>
            <option value="processing">Procesando</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <div className="form-group">
          <label>Productos</label>
          <div className="products-add">
            <input
              type="text"
              placeholder="ID del producto"
              value={newProductId}
              onChange={(e) => setNewProductId(e.target.value)}
              disabled={isSubmitting}
            />
            <input
              type="number"
              min="1"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value) || 1)}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleAddProduct}
              disabled={isSubmitting || !newProductId.trim()}
              className="btn btn-secondary"
            >
              Agregar
            </button>
          </div>
          {validationErrors.products && (
            <span className="error-message">{validationErrors.products}</span>
          )}
        </div>

        {products.length > 0 && (
          <div className="products-list">
            <h3>Productos seleccionados</h3>
            <ul>
              {products.map((product) => (
                <li key={product.productId} className="product-item">
                  <span>Producto: {product.productId}</span>
                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.productId, product.quantity - 1)}
                      disabled={product.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.productId, product.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product.productId)}
                    className="btn-remove"
                    disabled={isSubmitting}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}