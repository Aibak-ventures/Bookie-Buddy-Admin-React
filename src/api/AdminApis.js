import API_URLS from './ApiUrl';
import apiClient from './AxiosConfig';

////////////////////////////////////////////////////////////    AUTH RELATED FUNCTIONALITIES  /////////////////////////////////////
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




///////////////////////////////////////////////////////////////   USER RELATED APIS  /////////////////////////////////////////////

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

// create user alone
// Create a new user and associate with shop
export const createUserForShop = async (userData, shopId) => {
  try {
    const payload = {
      ...userData,
      shop: shopId, // ensure the backend expects this field
    };
    const response = await apiClient.post(API_URLS.ADD_USER_WITH_ROLE, payload);
    
    return response.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};


// get user details 

export const fetchUserDetails = async (userId) => {
  try {
    const response = await apiClient.get(`${API_URLS.USERS}${userId}/`);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// fetch shops related to the user
export const fetchUserShops = async (userId) => {
  try {
    const response = await apiClient.get(`${API_URLS.SHOPS_OF_USER}?user_id=${userId}`);
     
    return response.data.shops; // assuming your response is { shops: [...] }
    
  } catch (error) {

    console.error('Failed to fetch associated shops:', error);
    throw error;
  }
};



//Block/Unblock User
export const blockUnblockUser = async (userId, isActive) => {
  console.log("this is my input",userId,isActive);

  try {
    const response = await apiClient.patch(`${API_URLS.USERS}${userId}/`, {
      is_active: isActive,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to toggle user status:', error);
    throw error;
  }
};




///////////////////////////////////////////////////////////////   SHOP RELATED APIS  /////////////////////////////////////////////


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

//Block/Unblock Shop
export const blockUnblockShop = async (shopId, isActive) => {
  
  try {
    const response = await apiClient.patch(API_URLS.SINGLE_SHOP(shopId), {
      is_active: isActive,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to toggle shop status:', error);
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
    // data.append('subscription_plan', formData.subscriptionPlan);
    // data.append('max_products', formData.maxProducts);

    if (logoFile) {
      data.append('image', logoFile);
    }
    
    
    const response = await apiClient.post(API_URLS.SHOP_WITH_USER, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    return response;
  } catch (error) {
    console.error('Error registering shop:', error);
    throw error;
  }
};















///////////////////////////////////////////////////////////////////////// SERVICE RELATED APIS ///////////////////////////////////////

// Fetch general services with pagination
export const fetchGeneralServices = async () => {
  try {
    const response = await apiClient.get(API_URLS.GENERAL_SERVICES);
    return response.data; // includes count, next, previous, results
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
};



// Fetch services related to a specific shop
export const fetchShopServices = async (shopId) => {
  try {
    const response = await apiClient.get(`${API_URLS.SERVICE_UNDER_SHOP}?shop_id=${shopId}`);
    return response.data; // Expecting an array of services
  } catch (error) {
    console.error(`Failed to fetch services for shop ${shopId}:`, error);
    throw error;
  }
};


// assign service to shop
export const assignServicesToShop = async ({ shop_id, service_ids }) => {
  try {
    const response = await apiClient.post(
      API_URLS.ASSIGN_SERVICES_TO_SHOP,
      { shop_id, service_ids }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to assign services to shop:", error);
    throw error;
  }
};