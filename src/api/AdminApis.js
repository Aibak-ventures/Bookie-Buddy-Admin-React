import API_URLS from './ApiUrl';
import apiClient from './AxiosConfig';

// Login Function
export const loginUser = async ({ phone, password }) => {
  try {
    const response = await apiClient.post(API_URLS.LOGIN, {
      phone,
      password
    });

    const { access, refresh, user } = response.data;
    sessionStorage.setItem('access', access);
    sessionStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error) {
    throw error;
  }
};

// Logout
export const logoutUser = () => {
  sessionStorage.removeItem('access');
  sessionStorage.removeItem('user');
};

// Fetch all shops
export const fetchShops = async (url = API_URLS.SHOPS) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch shops:', error);
    throw error;
  }
};

// Fetch a single shop
export const fetchSingleShop = async (shopId) => {
  try {
    const response = await apiClient.get(API_URLS.SINGLE_SHOP(shopId));
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch shop with ID ${shopId}:`, error);
    throw error;
  }
};

// Fetch users
export const fetchUsers = async (url = API_URLS.USERS) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

// Fetch linked users
export const fetchLinkedUsers = async (shopId) => {
  try {
    const response = await apiClient.get(API_URLS.LINKED_USERS(shopId));
    return response.data.users;
  } catch (error) {
    console.error('Failed to fetch linked users:', error);
    throw error;
  }
};

// Register shop with user
export const registerShopWithUser = async (formData, logoFile) => {
  try {
    const data = new FormData();

    data.append('phone', formData.ownerPhone);
    data.append('full_name', `${formData.firstName} ${formData.lastName}`);
    data.append('email', formData.ownerEmail);
    data.append('role', 'OWNER');
    data.append('password', formData.password);
    data.append('secondary_password', formData.secretPassword);
    data.append('name', formData.businessName);
    data.append('place', formData.place);
    data.append('shop_phone', formData.phone);
    data.append('shop_address', formData.street);
    data.append('shop_email', formData.email);
    data.append('shop_gst_number', formData.gstNo);
    data.append('shop_city', formData.city);
    data.append('shop_state', formData.state);
    data.append('shop_pincode', formData.postCode);
    data.append('subscription_plan', formData.subscriptionPlan);
    data.append('max_products', formData.maxProducts);

    if (logoFile) {
      data.append('image', logoFile);
    }

    data.append('terms_and_conditions', JSON.stringify([
      'Clothes must be collected within 7 days',
      'No refund after wash'
    ]));

    formData.services.forEach(service => {
      data.append('services', service);
    });

    const response = await apiClient.post(API_URLS.SHOP_WITH_USER, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error registering shop:', error);
    throw error;
  }
};
