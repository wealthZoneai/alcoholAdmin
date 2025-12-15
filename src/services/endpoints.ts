const endpoints = {
    login: 'api/Alcohols/auth/login',
    register: 'api/Alcohols/auth/register/user',
    sendEmailOtp: 'api/auth/send-email-otp',
    verifyEmailOtp: "api/Alcohols/auth/verify/user",

    // Dynamic Categories (Main categories like Groceries, Alcohol, Drinks)
    getCurrentOrder: 'api/profile/currentorder/',
    getAllOrders: 'api/profile/orderhistory/',
    getProfile: 'api/profile/getProfile?userId=',
    createProfile: 'api/profile/createProfile?userId=',
    updateProfile: 'api/profile/updateProfile?userId=',

    getOrdersByStatus: 'api/profile/orders/by-status?status=',
    updateOrderStatus: 'api/profile/setStatus',

    getMainCategories: 'api/categories/getAllCategories',
    createMainCategory: 'api/categories/createCategory',
    updateMainCategory: 'api/categories/updateCategory?id=',
    deleteMainCategory: 'api/categories/deleteCategory?id=',
    getCategoryById: 'api/categories/getSubCategoryById?categoryId=',

    // Subcategories (e.g., Fruits, Vegetables under Groceries)
    getCategorySubcategories: 'api/categories/getSubCategoryById?categoryId=',
    createSubcategory: 'api/subcategories/createSubCategory?categoryId=',
    updateSubcategory: 'api/subcategories/updateSubcategory?subcategoryId=',
    deleteSubcategory: 'api/subcategories/deleteCategory?id=',

    // Items under subcategories
    getSubcategoryItems: 'api/items/getItemsBySubCategoryId?subCategoryId=',
    createItem: 'api/items/createItem?subCategoryId=',
    updateItem: 'api/items/updateItem?ItemId=',
    deleteItem: 'api/items/deleteItem?id=',
    searchItems: 'api/items/searchItems?name=',
    uploadBulkItems: 'api/items/upload-excel-zip',
    categoriesFilter: 'api/categories/filter?filterType=',

    // addToCart
    addToCart: 'Cart/addToCart',
    getAddToCart: 'Cart/getCartByUserId?userId=',
    deleteFromCart: 'Cart/removeItemFromCart',
    updateQuantity: 'Cart/updateQuantity?userId=',

    // Favorites/Wishlist
    getFavoriteItems: 'api/items/isFavorites',
    setFavoriteItem: 'api/items/setFavorite',

    // Reviews
    submitReview: 'api/reviews/addReview?itemId=',

    // Ratings Status
    getRatingsStatus: 'api/profile/userstatus?userId=',

    // Home Screen Sections
    getHomeBanner: 'api/home/banner',
    updateHomeBanner: 'api/home/banner',

    getHomeCategories: 'api/home/categories',
    updateHomeCategories: 'api/home/categories',

    getHomeBrands: 'api/home/brands',
    updateHomeBrands: 'api/home/brands',

    getHomeCombos: 'api/home/combos',
    createHomeCombo: 'api/home/combos',
    updateHomeCombo: 'api/home/combos',
    deleteHomeCombo: 'api/home/combos',

    getHomeTopRated: 'api/home/top-rated',
    createHomeTopRated: 'api/home/top-rated',
    updateHomeTopRated: 'api/home/top-rated',
    deleteHomeTopRated: 'api/home/top-rated',

    getHomeGroceries: 'api/home/groceries',
    createHomeGrocery: 'api/home/groceries',
    updateHomeGrocery: 'api/home/groceries',
    deleteHomeGrocery: 'api/home/groceries',

    getHomeReviews: 'api/home/reviews',
    createHomeReview: 'api/home/reviews',
    updateHomeReview: 'api/home/reviews',
    deleteHomeReview: 'api/home/reviews',

    getHomeOverview: 'api/home/overview',
    updateHomeOverview: 'api/home/overview',

    // Checkout & Payment
    createCheckoutSession: 'api/checkout/create-checkout-session',
    confirmOrder: 'api/checkout/confirm-order',
    getSessionStatus: 'api/checkout/session-status',
}

export default endpoints