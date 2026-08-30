import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../../ui components/DataTable';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../api/MarketplaceApis';
import { Plus, Edit2, Trash2, Loader2, X, Search, RotateCcw } from 'lucide-react';


const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    next: null,
    previous: null,
    totalEntries: 0,
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(''); // '' = all, 'true' = active, 'false' = inactive

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch Categories from Backend with Filters
  const loadCategories = useCallback(async (page = 1, search = searchTerm, isActive = activeFilter) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetchCategories(page, search, isActive);
      if (res.status === 'success' && res.data) {
        setCategories(res.data.data || []);
        setPagination({
          currentPage: res.data.current_page,
          next: res.data.next,
          previous: res.data.previous,
          totalEntries: res.data.count,
        });
      }
    } catch (err) {
        console.log("error",err);
        
      setApiError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, activeFilter]);

  useEffect(() => {
    loadCategories(1, searchTerm, activeFilter);
  }, [searchTerm, activeFilter, loadCategories]);

  // Client-Side JS Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open Modal
  const handleOpenModal = (category = null) => {
    setFormErrors({});
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
        is_active: category.is_active ?? true,
      });
    } else {
      setSelectedCategory(null);
      setFormData({ name: '', description: '', is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormErrors({});
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      handleCloseModal();
      loadCategories(pagination.currentPage, searchTerm, activeFilter);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        loadCategories(pagination.currentPage, searchTerm, activeFilter);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveFilter('');
  };

  // Table Columns Setup
  const columns = [
    {
      header: 'Category Name',
      accessor: 'name',
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          {row.description && (
            <p className="text-xs text-gray-500 truncate max-w-xs">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'is_active',
      cell: (row) => (
        <span
          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
            row.is_active
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Created At',
      accessor: 'created_at',
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
          <p className="text-xs text-gray-500">
            Total entries: {pagination.totalEntries}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition self-start md:self-auto"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by category name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="w-full py-2 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>

        {/* Reset Button */}
        {(searchTerm || activeFilter) && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition"
          >
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>

      {/* Error Alert */}
      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {apiError}
        </div>
      )}

      {/* Loading & Data Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={categories}
          totalEntries={pagination.totalEntries}
          onNextPage={() => loadCategories(pagination.currentPage + 1, searchTerm, activeFilter)}
          onPreviousPage={() => loadCategories(pagination.currentPage - 1, searchTerm, activeFilter)}
          disableNext={!pagination.next}
          disablePrevious={!pagination.previous}
        />
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {selectedCategory ? 'Edit Category' : 'Add New Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-purple-600'
                  }`}
                  placeholder="e.g. Suiting Materials"
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Brief description of category"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  Active Category
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {selectedCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesTab;