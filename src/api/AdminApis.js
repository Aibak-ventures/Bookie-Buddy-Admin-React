import MainServices from '../components/sections/MainServices';
import API_URLS from './ApiUrl';
import {multipartClient,apiClient} from './AxiosConfig';

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
    console.log("thsi is my response",response);
        
    return response;
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


// add user only
export const createUser = async (userData) => {
  try {
    console.log("this is my data", userData);

    const response = await apiClient.post(API_URLS.USERS, userData);
    console.log("my response", response);

    return response.data;
  } catch (error) {
    // Show specific validation error if available
    const apiErrors = error?.response?.data?.errors;
    if (apiErrors) {
      const firstKey = Object.keys(apiErrors)[0];
      const firstMessage = apiErrors[firstKey];
      alert(`${firstMessage}`);
    } else {
      // Generic fallback error
      alert("Failed to create user. Please try again.");
    }

    throw error; // still throw if you want caller to handle it too
  }
};


// update user
export const updateUserDetails = async (userId, userData) => {
  try {
    const response = await apiClient.patch(`${API_URLS.USERS}${userId}/`, userData);
    return response.data;
  } catch (error) {
    console.error('Failed to update user details:', error);
    throw error;
  }
};


// link user with the shop
export const linkUserToShop = async (shopId, userId, role) => {
  const payload = {
    shop: shopId,
    user: userId,
    role,
  };
  console.log("mhy paload",payload);
  const response = await apiClient.post(API_URLS.LINK_USER_TO_SHOP, payload);
  console.log("ppppp",response);
  
  return response.data;
};


// detatch user
export const detachUserFromShop = async (id) => {
  try {
    const response = await apiClient.delete(
      `${API_URLS.DETATCH_USER_LINK}${id}/`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to detach user:", error);
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
  console.log("this is my user",formData);
  
  try {
    const data = new FormData();

    data.append('phone', formData.phone);                      // ownerPhone -> phone
    data.append('full_name', formData.full_name);              // firstName + lastName -> full_name
    data.append('email', formData.email);                      // ownerEmail -> email
    data.append('role', 'OWNER');
    data.append('password', formData.password);
    data.append('secondary_password', formData.secondary_password);  // secretPassword -> secondary_password

    data.append('name', formData.name);                         // businessName -> name
    data.append('place', formData.place);
    data.append('shop_phone', formData.shop_phone);             // phone -> shop_phone
    data.append('shop_address', formData.shop_address);         // street -> shop_address
    data.append('shop_email', formData.shop_email);             // email -> shop_email
    data.append('shop_gst_number', formData.shop_gst_number);   // gstNo -> shop_gst_number
    data.append('shop_city', formData.shop_city);               // city -> shop_city
    data.append('shop_state', formData.shop_state);             // state -> shop_state
    data.append('shop_pincode', formData.shop_pincode);         // postCode -> shop_pincode

    if (logoFile) {
      data.append('image', logoFile);
    }
    console.log("ssssssss",data);
    

    const response = await multipartClient.post(API_URLS.SHOP_WITH_USER, data);


    return response;
  } catch (error) {
    console.error('Error registering shop:', error);
    throw error;
  }
};



// update shop details

export const updateShopDetails = async (shopId, data) => {
  console.log("this is my data",shopId,data);
  
   return await multipartClient.patch(API_URLS.SINGLE_SHOP(shopId), data);
};
  


// Toggle service status (activate/deactivate) for a shop
export const toggleShopServiceStatus = async ({ shop_service_id, is_active }) => {
  try {
    const payload = {
      shop_service_id,
      is_active,
    };

    const response = await apiClient.post(
      API_URLS.CHANGE_SHOP_SERVICE_STATUS,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to change shop service status:", error);
    throw error;
  }
};









///////////////////////////////////////////////////////////////////////// SERVICE RELATED APIS ///////////////////////////////////////

// Fetch general services with pagination
// api/AdminApis.js




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
  const payload = {"shop_id":parseInt(shop_id),"service_ids":service_ids}
  console.log("this is my payload",payload);
  
  try {
    const response = await apiClient.post(
      API_URLS.ASSIGN_SERVICES_TO_SHOP,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Failed to assign services to shop:", error);
    throw error;
  }
};




/////////////////////////////////////////////////////////// main service section ////////////////////////////////////
export const fetchMainServices = async (url) => {
  const res = await apiClient.get(url);
  console.log("all main services",res);
  
  return res.data;
};

export const toggleMainServiceStatus = async (id, isActive) => {
 console.log("my data",id,isActive);
 
  const response =  await multipartClient.patch(`/api/v1/service/admin/main-services/${id}/`, {
    is_active: isActive
  });
  console.log("my response",response);
  
};



export const addMainService = async (serviceData) => {
  const formData = new FormData();
  formData.append("name", serviceData.name);
  formData.append("description", serviceData.description);
  if (serviceData.icon) {
    formData.append("icon", serviceData.icon);
  }

  const res = await multipartClient.post("/api/v1/service/admin/main-services/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};




export const updateMainService = async (id, serviceData) => {
  try {
    const formData = new FormData();
    formData.append("name", serviceData.name);
    formData.append("description", serviceData.description);
    console.log("my form data",formData);
    

    // If the icon is a file, append it
    if (serviceData.icon && serviceData.icon instanceof File) {
      formData.append("icon", serviceData.icon);
    }

    const response = await multipartClient.patch(
      `/api/v1/service/admin/main-services/${id}/`,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update main service:", error);
    throw error;
  }
};



export const deleteMainService = async (id) => {
  try {
    const response = await apiClient.delete(
      `/api/v1/service/admin/main-services/${id}/`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete main service:", error);
    throw error;
  }
};





/////////////////////////////////////////////////////////// general service section ////////////////////////////////////

export const fetchGeneralServices = async (url) => {
  const res = await apiClient.get(url);
  console.log("all general services", res);
  return res.data;
};

export const toggleGeneralServiceStatus = async (id, isActive) => {
  console.log("my data", id, isActive);

  const response = await multipartClient.patch(
    `/api/v1/service/admin/general-services/${id}/`,
    {
      is_active: isActive,
    }
  );
  console.log("my response", response);
};

export const addGeneralService = async (serviceData) => {
  const formData = new FormData();
  formData.append("name", serviceData.name);
  formData.append("description", serviceData.description);
  formData.append("main_category", serviceData.main_category);

  if (serviceData.icon) {
    formData.append("icon", serviceData.icon);
  }

  const res = await multipartClient.post(
    "/api/v1/service/admin/general-services/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const updateGeneralService = async (id, serviceData) => {
  try {
    const formData = new FormData();
    formData.append("name", serviceData.name);
    formData.append("description", serviceData.description);
    formData.append("main_category", serviceData.main_category);

    console.log("my form data", formData);

    if (serviceData.icon && serviceData.icon instanceof File) {
      formData.append("icon", serviceData.icon);
    }

    const response = await multipartClient.patch(
      `/api/v1/service/admin/general-services/${id}/`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update general service:", error);
    throw error;
  }
};

export const deleteGeneralService = async (id) => {
  try {
    const response = await apiClient.delete(
      `/api/v1/service/admin/general-services/${id}/`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete general service:", error);
    throw error;
  }
};
