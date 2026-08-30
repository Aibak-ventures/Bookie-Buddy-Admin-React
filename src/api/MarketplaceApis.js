import API_URLS from './ApiUrl';
import { apiClient } from './AxiosConfig';
import axios from 'axios';


// category api functions
export const fetchCategories = async (page = 1, search = '', isActive = '') => {
  let url = `${API_URLS.MARKETPLACE_CATEGORIES}?page=${page}`;
  
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (isActive !== '') {
    url += `&is_active=${isActive}`;
  }

  const response = await apiClient.get(url);
  
  return response.data;

};

export const createCategory = async (payload) => {
  const response = await apiClient.post(API_URLS.MARKETPLACE_CATEGORIES, payload);
  return response.data;
};

export const updateCategory = async (id, payload) => {
  const response = await apiClient.patch(API_URLS.MARKETPLACE_CATEGORY(id), payload);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await apiClient.delete(API_URLS.MARKETPLACE_CATEGORY(id));
  return response.data;
};




// Fabrics API Functions
export const fetchFabrics = async (page = 1, search = '', isActive = '') => {
  let url = `${API_URLS.MARKETPLACE_FABRICS}?page=${page}`;
  
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (isActive !== '') {
    url += `&is_active=${isActive}`;
  }

  const response = await apiClient.get(url);
  return response.data;
};

export const createFabric = async (payload) => {
  const response = await apiClient.post(API_URLS.MARKETPLACE_FABRICS, payload);
  return response.data;
};

export const updateFabric = async (id, payload) => {
  const response = await apiClient.patch(API_URLS.MARKETPLACE_FABRIC(id), payload);
  
  return response.data;
};

export const deleteFabric = async (id) => {
  const response = await apiClient.delete(API_URLS.MARKETPLACE_FABRIC(id));
  return response.data;
};





// Sub category seciton
export const fetchSubCategories = async (page = 1, search = '', isActive = '') => {
  let url = `${API_URLS.MARKETPLACE_SUBCATEGORIES}?page=${page}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (isActive !== '') url += `&is_active=${isActive}`;

  const response = await apiClient.get(url);
  return response.data;
};

export const createSubCategory = async (payload) => {
  const response = await apiClient.post(API_URLS.MARKETPLACE_SUBCATEGORIES, payload);
  return response.data;
};

export const updateSubCategory = async (id, payload) => {
  const response = await apiClient.patch(API_URLS.MARKETPLACE_SUBCATEGORY(id), payload);
  return response.data;
};

export const deleteSubCategory = async (id) => {
  const response = await apiClient.delete(API_URLS.MARKETPLACE_SUBCATEGORY(id));
  return response.data;
};







// Products API Functions
// Products API Functions
export const fetchProducts = async (page = 1, search = '', isActive = '') => {
  let url = `${API_URLS.MARKETPLACE_PRODUCTS}?page=${page}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (isActive !== '') {
    url += `&is_active=${isActive}`;
  }

  const response = await apiClient.get(url);
  return response.data;
};

export const createProduct = async (payload) => {
  const response = await apiClient.post(API_URLS.MARKETPLACE_PRODUCTS, payload);
  return response.data;
};

export const updateProduct = async (id, payload) => {
  const response = await apiClient.patch(API_URLS.MARKETPLACE_PRODUCT(id), payload);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(API_URLS.MARKETPLACE_PRODUCT(id));
  return response.data;
};

// Accept payload directly as the 2nd argument
export const getPresignedUrls = async (productId, payload) => {
  console.log("payload", payload);
  
  const response = await apiClient.post(
    API_URLS.MARKETPLACE_PRODUCT_PRESIGNED_URLS(productId),
    payload
  );
  console.log("my response", response);
  
  return response.data;
};

export const uploadToS3 = async (presignedUrl, file) => {
  return await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type || (file.name.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg')
    }
  });
};

export const saveMediaToDB = async (productId, payload) => {
  const response = await apiClient.post(
    API_URLS.MARKETPLACE_PRODUCT_MEDIA(productId),
    payload
  );
  return response.data;
};



export const deleteProductMedia = async (productId, mediaType, key) => {
  const response = await apiClient.delete(
    API_URLS.MARKETPLACE_PRODUCT_MEDIA(productId),
    {
      data: {
        media_type: mediaType,
        key: key,
      },
    }
  );
  return response.data;
};