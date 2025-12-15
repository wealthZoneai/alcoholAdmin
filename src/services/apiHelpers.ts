import endpoints from "./endpoints";
import server from "./index";

export interface ILoginUserBody {
  email?: string;
  password?: string;
}

export interface RegisterUserBody {
  username?: string;
  email?: string;
  password?: string;
}


// login 
export function loginUser({ email, password }: ILoginUserBody) {
  const body = { email, password };
  return server.post(endpoints.login, body, { requiresAuth: false });
}

// register
export function RegisterUser({ username, email, password }: RegisterUserBody) {
  const body = { username, email, password };
  return server.post(endpoints.register, body, { requiresAuth: false });
}

export function UserOtp({ email, otp }: any) {
  const body = { email, otp };
  return server.post(endpoints.verifyEmailOtp, body, { requiresAuth: false });
}

// ============================================
//  ORDERS SYSTEM
// ============================================

export function getCurrentOrder(userId: string) {
  return server.get(`${endpoints.getCurrentOrder}${userId}`, { requiresAuth: true });
}

export function getAllOrders(userId: string) {
  return server.get(`${endpoints.getAllOrders}${userId}`, { requiresAuth: true });
}

export function getOrdersByStatus(status: string) {
  return server.get(`${endpoints.getOrdersByStatus}${status}`, { requiresAuth: true });
}

export function updateOrderStatus(orderId: string, status: string) {
  return server.put(`${endpoints.updateOrderStatus}?orderId=${orderId}&status=${status}`, { requiresAuth: true });
}

export function getUserProfile(userId: string) {
  return server.get(`${endpoints.getProfile}${userId}`, { requiresAuth: true });
}

export function createUserProfile(userId: string, data: any) {
  const formData = new FormData();
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("phoneNumber", data.phoneNumber);
  formData.append("email", data.email);
  formData.append("location", data.location);
  if (data.file) {
    formData.append("file", data.file);
  }

  return server.post(`${endpoints.createProfile}${userId}`, formData, { requiresAuth: true });
}

export function updateUserProfile(userId: string, data: any) {
  const formData = new FormData();
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("phoneNumber", data.phoneNumber);
  formData.append("email", data.email);
  formData.append("location", data.location);
  if (data.file) {
    formData.append("file", data.file);
  }

  return server.put(`${endpoints.updateProfile}${userId}`, formData, { requiresAuth: true });
}

// ============================================
//  CATEGORY SYSTEM
// ============================================

// Get all main categories (Groceries, Alcohol, Drinks, etc.)
export function getMainCategories() {
  return server.get(endpoints.getMainCategories, { requiresAuth: true });
}

// Create a new main category
export function createMainCategory(data: any) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description || "");
  formData.append("status", data.status ? "true" : "false");

  if (data.file) {
    formData.append("file", data.file);
  }

  return server.post(endpoints.createMainCategory, formData, {
    requiresAuth: true,
  });
}

// Update an existing main category
export function updateMainCategory(id: string, data: any) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description || "");
  formData.append("status", data.status ? "true" : "false");

  if (data.file) {
    formData.append("file", data.file);
  }

  return server.put(`${endpoints.updateMainCategory}${id}`, formData, {
    requiresAuth: true,
  });
}

// Delete a main category
export function deleteMainCategory(id: string) {
  return server.delete(`${endpoints.deleteMainCategory}${id}`, { requiresAuth: true });
}
// ============================================
//  SUB CATEGORY SYSTEM
// ============================================

// Get a specific category by ID
export function getCategoryById(id: string) {
  return server.get(`${endpoints.getCategoryById}${id}`, { requiresAuth: true });
}

// Get subcategories for a specific main category
export function getCategorySubcategories(categoryId: string) {
  return server.get(`${endpoints.getCategorySubcategories}${categoryId}`, { requiresAuth: true });
}
// Create a subcategory under a main category
export function createSubcategory(categoryId: string, data: any) {
  const formData = new FormData();
  formData.append("name", data?.displayName || data?.name);
  formData.append("description", data?.description || "");
  formData.append("status", data.status ? "true" : "false");

  if (data?.imageFile) {
    formData.append("file", data?.imageFile);
  }

  return server.post(`${endpoints.createSubcategory}${categoryId}`, formData, {
    requiresAuth: true,
  });
}
// Update a subcategory
export function updateSubcategory(id: string, data: any) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description || "");
  formData.append("status", data.status ? "true" : "false");

  if (data.imageFile) {
    formData.append("file", data.imageFile);
  }

  return server.put(`${endpoints.updateSubcategory}${id}`, formData, {
    requiresAuth: true,
  });
}
// Delete a subcategory
export function deleteSubcategory(id: string) {
  return server.delete(`${endpoints.deleteSubcategory}${id}`, { requiresAuth: true });
}
// ============================================
//  SUB CATEGORIES ITEMS SYSTEM
// ============================================
// Get items for a specific subcategory
export function getSubcategoryItems(subcategoryId: string, page: number = 0, size: number = 2) {
  return server.get(`${endpoints.getSubcategoryItems}${subcategoryId}&page=${page}&size=${size}`, { requiresAuth: true });
}

// Create a new item under a subcategory
export function createItem(subCategoryId: string, data: any) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description || "");
  formData.append("price", data.price.toString());
  formData.append("stock", data.stock.toString());
  formData.append("discount", data.discount?.toString() || "0");
  formData.append("quantity", data.quantity?.toString() || "");
  formData.append("minValue", data.minValue?.toString() || "");
  formData.append("maxValue", data.maxValue?.toString() || "");
  // formData.append("stepValue", data.stepValue?.toString() || "");
  formData.append("unitType", data.unitType);

  if (data.file || data.imageFile) {
    formData.append("file", data.file || data.imageFile);
  }

  return server.post(`${endpoints.createItem}${subCategoryId}`, formData, {
    requiresAuth: true,
  });
}

// Update an existing item
export function updateItem(itemId: string, data: any) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description || "");
  formData.append("price", data.price.toString());
  formData.append("discount", data.discount?.toString() || "0");
  formData.append("stock", data.stock.toString());
  formData.append("quantity", data.quantity?.toString() || "");
  formData.append("minValue", data.minValue?.toString() || "");
  formData.append("maxValue", data.maxValue?.toString() || "");
  // formData.append("stepValue", data.stepValue?.toString() || "");
  formData.append("unitType", data.unitType);

  if (data.file || data.imageFile) {
    formData.append("file", data.file || data.imageFile);
  }

  return server.put(`${endpoints.updateItem}${itemId}`, formData, {
    requiresAuth: true,
  });
}

// Upload bulk items
export const uploadBulkItems = async (subcategoryId: string, excelFile: File, zipFile: File) => {
  const formData = new FormData();

  formData.append("excelFile", excelFile);
  formData.append("zipFile", zipFile);
  formData.append("subCategoryId", subcategoryId);

  return server.post(endpoints.uploadBulkItems, formData, {
    requiresAuth: true,
  });
}
// Delete an item
export function deleteItem(itemId: string) {
  return server.delete(`${endpoints.deleteItem}${itemId}`, { requiresAuth: true });
}

export function searchItems(query: string) {
  return server.get(`${endpoints.searchItems}${query}`, { requiresAuth: true });
}

// ============================================
//  ADD TO CART SYSTEM
export function fetchCaregotiesFilters(filter: string, id?: string) {
  return server.get(`${endpoints.categoriesFilter}${filter}&id=${id}`, { requiresAuth: true });
}
// addToCart
export function AddToCart(userId: string, itemId: string, quantity: any) {
  return server.post(
    `${endpoints.addToCart}?userId=${userId}&itemId=${itemId}&quantity=${quantity}`,
    {},
    {
      requiresAuth: true,
    }
  );
}
// get Add to cart
export function getAddToCart(userId: any) {
  return server.get(`${endpoints.getAddToCart}${userId}`, { requiresAuth: true });
}
// remove from cart
export function deleteFromCart(userId: any, itemId: any) {
  return server.delete(`${endpoints.deleteFromCart}?userId=${userId}&itemId=${itemId}`, { requiresAuth: true });
}

// update cart quantity
export function updateCartQuantity(userId: any, itemId: number, quantity: number) {
  return server.put(
    `${endpoints.updateQuantity}${userId}&itemId=${itemId}&quantity=${quantity}`,
    {},
    { requiresAuth: true }
  );
}

// ============================================
//  FAVORITES/WISHLIST SYSTEM
// ============================================

// Get all favorite items for the current user
export function getFavoriteItems(userId: string) {
  return server.get(`${endpoints.getFavoriteItems}?userId=${userId}`, { requiresAuth: true });
}

// Set/unset an item as favorite
export function setFavoriteItem(itemId: string | number, isFavorite: boolean, userId: string) {
  return server.put(
    `${endpoints.setFavoriteItem}?itemId=${itemId}&isFavorite=${isFavorite}&userId=${userId}`,
    {},
    { requiresAuth: true }
  );
}


// Reviews
export function submitReview(itemId: number, reviewData: ReviewData) {
  return server.post(`${endpoints.submitReview}${itemId}`, reviewData, { requiresAuth: true });
}


// Retings Status

export const getRatingsStatus = (userId: string, orderId:string) => {
  return server.get(`${endpoints.getRatingsStatus}${userId}&orderId=${orderId}`, { requiresAuth: true });
}

// Home Screen Helpers
// Banner
export function getHomeBanner() {
  return server.get(endpoints.getHomeBanner);
}

export function updateHomeBanner(data: any) {
  return server.put(endpoints.updateHomeBanner, data, { requiresAuth: true });
}

// Categories
export function getHomeCategories() {
  return server.get(endpoints.getHomeCategories);
}

export function updateHomeCategories(data: any) {
  return server.put(endpoints.updateHomeCategories, data, { requiresAuth: true });
}

// Brands
export function getHomeBrands() {
  return server.get(endpoints.getHomeBrands);
}

export function updateHomeBrands(data: any) {
  return server.put(endpoints.updateHomeBrands, data, { requiresAuth: true });
}

// Combos
export function getHomeCombos() {
  return server.get(endpoints.getHomeCombos);
}

export function createHomeCombo(data: any) {
  return server.post(endpoints.createHomeCombo, data, { requiresAuth: true });
}

export function updateHomeCombo(id: string, data: any) {
  return server.put(`${endpoints.updateHomeCombo}/${id}`, data, { requiresAuth: true });
}

export function deleteHomeCombo(id: string) {
  return server.delete(`${endpoints.deleteHomeCombo}/${id}`, { requiresAuth: true });
}

// Top Rated
export function getHomeTopRated() {
  return server.get(endpoints.getHomeTopRated);
}

export function createHomeTopRated(data: any) {
  return server.post(endpoints.createHomeTopRated, data, { requiresAuth: true });
}

export function updateHomeTopRated(id: string, data: any) {
  return server.put(`${endpoints.updateHomeTopRated}/${id}`, data, { requiresAuth: true });
}

export function deleteHomeTopRated(id: string) {
  return server.delete(`${endpoints.deleteHomeTopRated}/${id}`, { requiresAuth: true });
}

// Reviews
export function getHomeReviews() {
  return server.get(endpoints.getHomeReviews);
}

export function createHomeReview(data: any) {
  return server.post(endpoints.createHomeReview, data, { requiresAuth: true });
}

export function updateHomeReview(id: string, data: any) {
  return server.put(`${endpoints.updateHomeReview}/${id}`, data, { requiresAuth: true });
}

export function deleteHomeReview(id: string) {
  return server.delete(`${endpoints.deleteHomeReview}/${id}`, { requiresAuth: true });
}

// Overview
export function getHomeOverview() {
  return server.get(endpoints.getHomeOverview);
}

export function updateHomeOverview(data: any) {
  return server.put(endpoints.updateHomeOverview, data, { requiresAuth: true });
}



// ============================================
//  CHECKOUT & PAYMENT SYSTEM
// ============================================

// Create Stripe checkout session
export function createCheckoutSession(userId: any, successUrl: string, cancelUrl: string) {
  const body = { userId, successUrl, cancelUrl };
  return server.post(endpoints.createCheckoutSession, body, { requiresAuth: true });
}

// Get session status
export function getSessionStatus(sessionId: string) {
  return server.get(`${endpoints.getSessionStatus}?sessionId=${sessionId}`, { requiresAuth: true });
}

// Confirm order after successful payment
export function confirmOrder(userId: any, sessionId: string) {
  const body = { userId, sessionId };
  return server.post(endpoints.confirmOrder, body, { requiresAuth: true });
}