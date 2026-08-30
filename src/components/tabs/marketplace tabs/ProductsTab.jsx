import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, Eye, Image as ImageIcon } from 'lucide-react';
import DataTable from '../../ui components/DataTable';
import ProductDetailsModal from '../../Modals/marketplace/ProductDetailsModal';
import ProductFormModal from '../../Modals/marketplace/ProductFormModal';
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../../api/MarketplaceApis';

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  // Modal Controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchProducts(page, search);
      setProducts(res.data.data);
      setTotalPages(res.data.total_pages);
      setTotalEntries(res.data.count);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleFormSubmit = async (payload) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setIsFormOpen(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (err) {
      console.error("Failed to save product", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const columns = [
    {
      header: 'Image',
      accessor: 'images',
      cell: (row) => {
        const imageUrl = row.images && row.images.length > 0 ? row.images[0].url : null;
        return (
          <div className="w-10 h-10 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={row.images[0]?.alt || row.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <ImageIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
        );
      }
    },
    { header: 'Product Name', accessor: 'name' },
    { header: 'Code', accessor: 'product_code' },
    { 
      header: 'Selling Price', 
      accessor: 'selling_price',
      cell: (row) => <span className="font-semibold text-gray-800">${row.selling_price}</span> 
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => { setSelectedProduct(row); setIsDetailsOpen(true); }} 
            className="p-1 text-gray-600 hover:text-purple-600" 
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => { setSelectedProduct(row); setIsFormOpen(true); }} 
            className="p-1 text-gray-600 hover:text-purple-600"
            title="Edit Product"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(row.id)} 
            className="p-1 text-gray-600 hover:text-red-600"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-purple-600"
          />
        </div>
        <button 
          onClick={() => { setSelectedProduct(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <DataTable 
        columns={columns}
        data={products}
        totalEntries={totalEntries}
        onNextPage={() => setPage(p => Math.min(p + 1, totalPages))}
        onPreviousPage={() => setPage(p => Math.max(p - 1, 1))}
        disableNext={page >= totalPages}
        disablePrevious={page <= 1}
      />

      {/* Form Modal (Create & Update) */}
      <ProductFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        initialData={selectedProduct}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        product={selectedProduct} 
      />
    </div>
  );
};

export default ProductsTab;