import { useState, useEffect, useCallback, useMemo } from 'react';

const INITIAL_INVENTORY = [
  {
    id: 'prod-001',
    sku: 'SKU-ELEC-401',
    name: 'AcousticPro ANC Headphones',
    category: 'Electronics',
    price: 249.99,
    quantity: 42,
    description: 'Studio-grade wireless over-ear noise-cancelling headphones with 40h battery life.',
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'prod-002',
    sku: 'SKU-DESK-812',
    name: 'Artisan Walnut Monitor Stand',
    category: 'Furniture',
    price: 119.50,
    quantity: 6,
    description: 'Solid American walnut dual-monitor riser with integrated cord channels.',
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'prod-003',
    sku: 'SKU-APPR-109',
    name: 'Merino Wool Minimalist Overshirt',
    category: 'Apparel',
    price: 145.00,
    quantity: 18,
    description: 'Thermal regulating 100% fine Australian merino wool with matte horn buttons.',
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'prod-004',
    sku: 'SKU-LITE-303',
    name: 'Lumina Bar Ambient Smart Light',
    category: 'Electronics',
    price: 89.00,
    quantity: 0,
    description: 'Ultra-thin monitor-mounted lightbar with ambient backlight and wireless dial.',
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'prod-005',
    sku: 'SKU-LFS-551',
    name: 'Double-Wall Titanium Travel Flask',
    category: 'Lifestyle',
    price: 68.00,
    quantity: 4,
    description: 'Vacuum-insulated ultralight titanium flask keeps coffee hot for 14 hours.',
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
  {
    id: 'prod-006',
    sku: 'SKU-DESK-904',
    name: 'Top-Grain Leather Desk Pad',
    category: 'Furniture',
    price: 54.00,
    quantity: 25,
    description: 'Handcrafted vegetable-tanned leather desk blotter with water-resistant coating.',
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'prod-007',
    sku: 'SKU-ACC-220',
    name: 'Precision Aluminum Cable Weights',
    category: 'Electronics',
    price: 32.50,
    quantity: 0,
    description: 'CNC-machined anodized aluminum cable anchor with non-slip silicone base.',
    updatedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 'prod-008',
    sku: 'SKU-LFS-672',
    name: 'Ceramic Pour-Over Brew Station',
    category: 'Lifestyle',
    price: 76.00,
    quantity: 14,
    description: 'Matte stoneware dripper set with borosilicate glass server and walnut collar.',
    updatedAt: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
];

export const useInventory = (onAuditAction) => {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('stockroom_inventory');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse stored inventory:', e);
    }
    return INITIAL_INVENTORY;
  });

  // Requirement: useEffect for synchronizing inventory with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('stockroom_inventory', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to sync inventory to localStorage:', e);
    }
  }, [products]);

  // Requirement: useEffect for dynamically updating document title based on stock
  useEffect(() => {
    const totalCount = products.length;
    const lowStockCount = products.filter((p) => p.quantity > 0 && p.quantity < 10).length;
    const outOfStockCount = products.filter((p) => p.quantity === 0).length;

    let alertSuffix = '';
    if (outOfStockCount > 0 || lowStockCount > 0) {
      alertSuffix = ` · (${outOfStockCount} Out, ${lowStockCount} Low)`;
    }

    document.title = `STOCKROOM — ${totalCount} Products${alertSuffix}`;
  }, [products]);

  // Requirement: useCallback for stable action handlers
  const addProduct = useCallback(
    (productData) => {
      const newProduct = {
        id: 'prod-' + Date.now(),
        sku: productData.sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
        name: productData.name.trim(),
        category: productData.category || 'General',
        price: parseFloat(productData.price) || 0,
        quantity: parseInt(productData.quantity, 10) || 0,
        description: productData.description || '',
        updatedAt: new Date().toISOString(),
      };

      setProducts((prev) => [newProduct, ...prev]);

      if (onAuditAction) {
        onAuditAction({
          type: 'CREATE',
          item: newProduct.name,
          sku: newProduct.sku,
          details: `Added new product with initial stock: ${newProduct.quantity}`,
          timestamp: new Date().toISOString(),
        });
      }
      return newProduct;
    },
    [onAuditAction]
  );

  const updateStock = useCallback(
    (id, newQuantity) => {
      const targetQty = Math.max(0, parseInt(newQuantity, 10) || 0);

      setProducts((prev) => {
        let changedItem = null;
        const updated = prev.map((item) => {
          if (item.id === id) {
            changedItem = { ...item, quantity: targetQty, updatedAt: new Date().toISOString() };
            return changedItem;
          }
          return item;
        });

        if (changedItem && onAuditAction) {
          onAuditAction({
            type: 'STOCK_UPDATE',
            item: changedItem.name,
            sku: changedItem.sku,
            details: `Adjusted stock level to ${targetQty} units`,
            timestamp: new Date().toISOString(),
          });
        }

        return updated;
      });
    },
    [onAuditAction]
  );

  const deleteProduct = useCallback(
    (id) => {
      setProducts((prev) => {
        const itemToDelete = prev.find((p) => p.id === id);
        if (itemToDelete && onAuditAction) {
          onAuditAction({
            type: 'DELETE',
            item: itemToDelete.name,
            sku: itemToDelete.sku,
            details: `Removed product from active catalog`,
            timestamp: new Date().toISOString(),
          });
        }
        return prev.filter((p) => p.id !== id);
      });
    },
    [onAuditAction]
  );

  // Requirement: useMemo for inventory metrics calculations
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const totalUnits = products.reduce((acc, p) => acc + (p.quantity || 0), 0);
    const lowStockItems = products.filter((p) => p.quantity > 0 && p.quantity < 10);
    const outOfStockItems = products.filter((p) => p.quantity === 0);
    const totalValue = products.reduce((acc, p) => acc + (p.price || 0) * (p.quantity || 0), 0);

    return {
      totalProducts,
      totalUnits,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      inStockCount: totalProducts - lowStockItems.length - outOfStockItems.length,
      totalValue,
    };
  }, [products]);

  return {
    products,
    metrics,
    addProduct,
    updateStock,
    deleteProduct,
  };
};

export default useInventory;
