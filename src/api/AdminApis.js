import apiClient from "./AxiosConfig";


// Login Function
export const loginUser = async ({ phone, password }) => {
  try {
    const response = await apiClient.post('/api/v1/auth/admin/login/', {
      phone,
      password
    });

    const { access, refresh, user } = response.data;

    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error) {
    throw error;
  }
};



// to fetch shop details
export const fetchShops = async (url = '/api/v1/shop/admin/shops/') => {
  try {
    const response = await apiClient.get(url);
    console.log("this is my response", response.data);

    return response.data;
  } catch (error) {
    console.error('Failed to fetch shops:', error);
    throw error;
  }
};


// To fetch individual shop details
export const fetchSingleShop = async (shopId) => {
  try {
    const response = await apiClient.get(`/api/v1/shop/admin/shops/${shopId}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch shop with ID ${shopId}:`, error);
    throw error;
  }
};



// to fetch users
export const fetchUsers = async (url = '/api/v1/auth/admin/users/') => {
  try {
    const response = await apiClient.get(url);

    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};


// to fetch related users of the sho
export const fetchLinkedUsers = async (shopId) => {
  try {
    const response = await apiClient.get(`/api/v1/shop/admin/link-user/?shop_id=${shopId}`);
    console.log("my users",response);
    
    return response.data.users;
  } catch (error) {
    console.error('Failed to fetch linked users:', error);
    throw error;
  }
};





// Register a new shop with owner
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

    // Append selected services
    formData.services.forEach(service => {
      data.append('services', service);
    });


    const response = await apiClient.post('/api/v1/shop/admin/shop-with-user/', data, {
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
