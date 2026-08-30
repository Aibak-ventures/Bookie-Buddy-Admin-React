import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Loader2, X, Search, RotateCcw } from 'lucide-react';
import DataTable from '../../ui components/DataTable'; // Adjust path if needed
import PaginatedCategoryDropdown from '../../ui components/PaginatedCategoryDropdown';
import {
  fetchSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../../../api/MarketplaceApis';

const SubCategoriesTab = () => {
  const [subCategories, setSubCategories] = useState([]);
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
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [formData, setFormData] = useState({
    category: '',       // Parent Category ID (Required)
    category_name: '',  // Parent Category Name for initial label display
    name: '',           // Sub-category Name (Required)
    description: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch Sub Categories from Server
  const loadSubCategories = useCallback(async (page = 1, search = searchTerm, isActive = activeFilter) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetchSubCategories(page, search, isActive);
      if (res.status === 'success' && res.data) {
        setSubCategories(res.data.data || []);
        setPagination({
          currentPage: res.data.current_page,
          next: res.data.next,
          previous: res.data.previous,
          totalEntries: res.data.count,
        });
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to fetch sub-categories');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, activeFilter]);

  useEffect(() => {
    loadSubCategories(1, searchTerm, activeFilter);
  }, [searchTerm, activeFilter, loadSubCategories]);

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.category) {
      errors.category = 'Parent Category is required';
    }
    if (!formData.name.trim()) {
      errors.name = 'Sub-category name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Modal Handlers
  const handleOpenModal = (subCat = null) => {
    setFormErrors({});
    if (subCat) {
      setSelectedSubCategory(subCat);
      setFormData({
        category: subCat.category || '',
        category_name: subCat.category_name || subCat.category_detail?.name || '', // Updated to map category_name
        name: subCat.name || '',
        description: subCat.description || '',
        is_active: subCat.is_active ?? true,
      });
    } else {
      setSelectedSubCategory(null);
      setFormData({
        category: '',
        category_name: '',
        name: '',
        description: '',
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubCategory(null);
    setFormErrors({});
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        category: formData.category,
        name: formData.name.trim(),
        description: formData.description.trim(),
        is_active: formData.is_active,
      };

      if (selectedSubCategory) {
        await updateSubCategory(selectedSubCategory.id, payload);
      } else {
        await createSubCategory(payload);
      }
      handleCloseModal();
      loadSubCategories(pagination.currentPage, searchTerm, activeFilter);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong while saving');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sub-category?')) {
      try {
        await deleteSubCategory(id);
        loadSubCategories(pagination.currentPage, searchTerm, activeFilter);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete sub-category');
      }
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveFilter('');
  };

  // Table Columns
  const columns = [
    {
      header: 'Sub Category',
      accessor: 'name',
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-900 capitalize">{row.name}</p>
          {row.description && (
            <p className="text-xs text-gray-500 truncate max-w-xs">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Parent Category',
      accessor: 'category',
      cell: (row) => (
        <span className="font-medium text-gray-700">
          {row.category_name || row.category_detail?.name || `ID: ${row.category}`}
        </span>
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Sub Categories</h2>
          <p className="text-xs text-gray-500">
            Total entries: {pagination.totalEntries}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition self-start md:self-auto"
        >
          <Plus size={18} /> Add Sub Category
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search sub-categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

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

        {(searchTerm || activeFilter) && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition"
          >
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>

      {/* Error Message */}
      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {apiError}
        </div>
      )}

      {/* Table Section */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={subCategories}
          totalEntries={pagination.totalEntries}
          onNextPage={() => loadSubCategories(pagination.currentPage + 1, searchTerm, activeFilter)}
          onPreviousPage={() => loadSubCategories(pagination.currentPage - 1, searchTerm, activeFilter)}
          disableNext={!pagination.next}
          disablePrevious={!pagination.previous}
        />
      )}

      {/* Modal Dialog */}
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
              {selectedSubCategory ? 'Edit Sub Category' : 'Add New Sub Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Paginated Category Dropdown Component */}
              <PaginatedCategoryDropdown
                value={formData.category}
                initialLabel={formData.category_name}
                error={formErrors.category}
                onChange={(id, selectedObj) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: id,
                    category_name: selectedObj.name,
                  }));
                  if (formErrors.category) {
                    setFormErrors((prev) => ({ ...prev, category: '' }));
                  }
                }}
              />

              {/* Sub-category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category Name <span className="text-red-500">*</span>
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
                  placeholder="e.g. Shirts, Refrigerated Transport"
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>

              {/* Description */}
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
                  placeholder="Sub category details..."
                />
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="subcat_is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="subcat_is_active" className="text-sm text-gray-700">
                  Active Sub Category
                </label>
              </div>

              {/* Form Actions */}
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
                  {selectedSubCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoriesTab;