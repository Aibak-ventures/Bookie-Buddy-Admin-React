// src/constants/urls.js
const API_URLS = {
  LOGIN: '/api/v1/auth/admin/login/',
  USERS: '/api/v1/auth/admin/users/',
  SHOPS: '/api/v1/shop/admin/shops/',
  SINGLE_SHOP: (shopId) => `/api/v1/shop/admin/shops/${shopId}/`,
  LINKED_USERS: (shopId) => `/api/v1/shop/admin/link-user/?shop_id=${shopId}`,
  SHOP_WITH_USER: '/api/v1/shop/admin/shop-with-user/',
  REFRESH_TOKEN_URL : '/api/token/refresh/',
  SHOP_REPORT : '/api/v1/shop/admin/shops/report/',

  // USER
  ADD_USER_WITH_ROLE:'/api/v1/shop/admin/shop-with-user/create-with-role/',
  SHOPS_OF_USER:'/api/v1/shop/admin/user-shops/',
  LINK_USER_TO_SHOP:'/api/v1/shop/admin/link-user/',
  DETACH_USER_LINK :'/api/v1/shop/admin/link-user/',

  // SERVICES
  GENERAL_SERVICES : '/api/v1/service/admin/general-services/',
  GENERAL_SERVICE: (id) => `/api/v1/service/admin/general-services/${id}/`,
  SERVICE_UNDER_SHOP:'/api/v1/service/admin/general-services/shop-services/',
  ASSIGN_SERVICES_TO_SHOP:"/api/v1/service/admin/general-services/assign-to-shop/",
  CHANGE_SHOP_SERVICE_STATUS:"/api/v1/service/admin/general-services/shop/change-service-status/",

  // MAIN SERVICES
  MAIN_SERVICES: '/api/v1/service/admin/main-services/',
  MAIN_SERVICE: (id) => `/api/v1/service/admin/main-services/${id}/`,


  // features
  FEATURES_URL : "/api/v3/subscriptions/admin/features/",
  ADD_FEATURE_TO_SHOP :(subscription_id)=>`/api/v3/subscriptions/admin/shop-subscriptions/add-features/${subscription_id}/`,
  UPDATE_SHOP_FEATURE:(shop_subscription_id,feature_id)=> `/api/v3/subscriptions/admin/shop-subscriptions/${shop_subscription_id}/update-feature/${feature_id}/`,
  DELETE_SHOP_FEATURE: (subscriptionId,featureId)=>`/api/v3/subscriptions/admin/shop-subscriptions/${subscriptionId}/features/${featureId}/`,

  // SUBSCRIPTIONS
  SUBSCRIPTIONS: "/api/v3/subscriptions/admin/subscription-plans/",
  SUBSCRIPTION: (id) => `/api/v3/subscriptions/admin/subscription-plans/${id}/`,


  // RESET PASSWORD
  RESET_PASSWORD: '/api/v1/auth/admin/users/reset-password/',

  // PUSH NOTIFICATIONS
  PUSH_NOTIFICATION:'/api/v3/notifications/admin/notifications/send/',

  // SHOP SUBSCRIPTION 
  ASSIGN_SUBSCRIPTION : '/api/v3/subscriptions/admin/shop-subscriptions/subscribe/',

  // GET SUBSCRIPTION DETAILS OF THE SHOP
  GET_SUBSCRIPTION_DETAILS_OF_SHOP : (id) => `/api/v3/subscriptions/admin/shop-subscription-details/${id}/`,
  CANCEL_SUBSCRIPTION_OF_SHOP : (subscriptionId) => `/api/v3/subscriptions/admin/shop-subscriptions/cancel/${subscriptionId}/`,
  UPDATE_SHOP_SUB: (shopSubscriptionId) =>`/api/v3/subscriptions/admin/shop-subscriptions/update/${shopSubscriptionId}/`,


  // IDLE DAYS REPORT
  IDLE_DAYS_REPORT: '/api/v1/shop/admin/shops/idle-days-report/',

  
};

export default API_URLS;
