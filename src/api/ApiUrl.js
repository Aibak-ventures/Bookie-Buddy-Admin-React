// src/constants/urls.js

const API_URLS = {
  LOGIN: '/api/v1/auth/admin/login/',
  USERS: '/api/v1/auth/admin/users/',
  SHOPS: '/api/v1/shop/admin/shops/',
  SINGLE_SHOP: (shopId) => `/api/v1/shop/admin/shops/${shopId}/`,
  LINKED_USERS: (shopId) => `/api/v1/shop/admin/link-user/?shop_id=${shopId}`,
  SHOP_WITH_USER: '/api/v1/shop/admin/shop-with-user/',
};

export default API_URLS;
