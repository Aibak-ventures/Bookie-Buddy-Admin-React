// src/constants/urls.js

const API_URLS = {
  LOGIN: '/api/v1/auth/admin/login/',
  USERS: '/api/v1/auth/admin/users/',
  SHOPS: '/api/v1/shop/admin/shops/',
  SINGLE_SHOP: (shopId) => `/api/v1/shop/admin/shops/${shopId}/`,
  LINKED_USERS: (shopId) => `/api/v1/shop/admin/link-user/?shop_id=${shopId}`,
  SHOP_WITH_USER: '/api/v1/shop/admin/shop-with-user/',
  REFRESH_TOKEN_URL : '/api/token/refresh/',
  GENERAL_SERVICES : '/api/v1/service/admin/general-services/',
  SERVICE_UNDER_SHOP:'/api/v1/service/admin/general-services/shop-services/',
  ASSIGN_SERVICES_TO_SHOP:"/api/v1/service/admin/general-services/assign-to-shop/",
  ADD_USER_WITH_ROLE:'/api/v1/shop/admin/shop-with-user/create-with-role/',
  SHOPS_OF_USER:'/api/v1/shop/admin/user-shops/',
  CHANGE_SHOP_SERVICE_STATUS:"/api/v1/service/admin/general-services/shop/change-service-status/",
  LINK_USER_TO_SHOP:'/api/v1/shop/admin/link-user/',
  DETATCH_USER_LINK:'/api/v1/shop/admin/link-user/'
  
 

};

export default API_URLS;


