import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import PaginatedSubCategoryDropdown from '../../ui components/PaginatedSubCategoryDropdown';
import PaginatedFabricMultiSelect from '../../ui components/PaginatedFabricMultiSelect';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    subcategory: '',
    sub_category_name: '', // Added to store display label
    fabrics: [],
    is_premium: false,
    color: '',
    model: '',
    description: '',
    purchase_cost: '',
    selling_price: '',
    size_options: ['S', 'M', 'L', 'XL'],
    minimum_order_quantity: 1,
    maximum_order_quantity: 100,
    is_public: false,
    show_selling_price: true,
    is_active: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // 1. Extract subcategory ID correctly
      const subcategoryId = typeof initialData.subcategory === 'object' 
        ? initialData.subcategory?.id 
        : initialData.subcategory || initialData.subcategory_id || '';

      // 2. Extract subcategory Name for initialLabel
      const subcategoryLabel = initialData.sub_category_name 
        || initialData.subcategory?.name 
        || initialData.subcategory?.sub_category_name 
        || '';

      setFormData({
        ...initialData,
        subcategory: subcategoryId, // Keep numerical ID for submission
        sub_category_name: subcategoryLabel, // Pass string name to initialLabel
        fabrics: initialData.fabrics ? initialData.fabrics.map(f => typeof f === 'object' ? f.id : f) : []
      });
    } else {
      setFormData({
        name: '',
        subcategory: '',
        sub_category_name: '',
        fabrics: [],
        is_premium: false,
        color: '',
        model: '',
        description: '',
        purchase_cost: '',
        selling_price: '',
        size_options: ['S', 'M', 'L', 'XL'],
        minimum_order_quantity: 1,
        maximum_order_quantity: 100,
        is_public: false,
        show_selling_price: true,
        is_active: true
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.subcategory) {
      newErrors.subcategory = 'Subcategory is required';
    }

    if (!formData.purchase_cost || isNaN(formData.purchase_cost) || Number(formData.purchase_cost) <= 0) {
      newErrors.purchase_cost = 'Valid purchase cost is required';
    }

    if (!formData.selling_price || isNaN(formData.selling_price) || Number(formData.selling_price) <= 0) {
      newErrors.selling_price = 'Valid selling price is required';
    }

    if (Number(formData.selling_price) < Number(formData.purchase_cost)) {
      newErrors.selling_price = 'Selling price should not be less than purchase cost';
    }

    if (Number(formData.minimum_order_quantity) < 1) {
      newErrors.minimum_order_quantity = 'Minimum order quantity must be at least 1';
    }

    if (Number(formData.maximum_order_quantity) < Number(formData.minimum_order_quantity)) {
      newErrors.maximum_order_quantity = 'Max quantity must be greater than or equal to min quantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const exists = prev.size_options.includes(size);
      const updated = exists 
        ? prev.size_options.filter(s => s !== size)
        : [...prev.size_options, size];
      return { ...prev, size_options: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-bold">{initialData ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg mt-1 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Subcategory Dynamic Dropdown */}
            <div>
              <PaginatedSubCategoryDropdown
                label="Subcategory *"
                initialLabel={formData.sub_category_name}
                value={formData.subcategory}
                error={errors.subcategory}
                onChange={(id, selectedObj) => {
                  setFormData(prev => ({
                    ...prev,
                    subcategory: id,
                    sub_category_name: selectedObj?.name || selectedObj?.sub_category_name || ''
                  }));
                }}
              />
            </div>

            {/* Purchase Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Cost ($) *</label>
              <input
                type="number"
                step="0.01"
                name="purchase_cost"
                value={formData.purchase_cost}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg mt-1 ${errors.purchase_cost ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.purchase_cost && <p className="text-red-500 text-xs mt-1">{errors.purchase_cost}</p>}
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price ($) *</label>
              <input
                type="number"
                step="0.01"
                name="selling_price"
                value={formData.selling_price}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg mt-1 ${errors.selling_price ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.selling_price && <p className="text-red-500 text-xs mt-1">{errors.selling_price}</p>}
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Model / Fit</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
              />
            </div>

            {/* Min Order Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Order Qty</label>
              <input
                type="number"
                name="minimum_order_quantity"
                value={formData.minimum_order_quantity}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg mt-1 ${errors.minimum_order_quantity ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.minimum_order_quantity && <p className="text-red-500 text-xs mt-1">{errors.minimum_order_quantity}</p>}
            </div>

            {/* Max Order Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Order Qty</label>
              <input
                type="number"
                name="maximum_order_quantity"
                value={formData.maximum_order_quantity}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg mt-1 ${errors.maximum_order_quantity ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.maximum_order_quantity && <p className="text-red-500 text-xs mt-1">{errors.maximum_order_quantity}</p>}
            </div>
          </div>

          {/* Fabrics Dynamic Multi-Select */}
          <div>
            <PaginatedFabricMultiSelect
              value={formData.fabrics}
              onChange={(selectedIds) => setFormData(prev => ({ ...prev, fabrics: selectedIds }))}
            />
          </div>

          {/* Size Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    formData.size_options.includes(size)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-1"
            />
          </div>

          {/* Checkbox Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-lg border">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" name="is_premium" checked={formData.is_premium} onChange={handleChange} />
              <span>Premium</span>
            </label>

            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" name="is_public" checked={formData.is_public} onChange={handleChange} />
              <span>Public</span>
            </label>

            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" name="show_selling_price" checked={formData.show_selling_price} onChange={handleChange} />
              <span>Show Price</span>
            </label>

            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
              <span>Active</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {initialData ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;