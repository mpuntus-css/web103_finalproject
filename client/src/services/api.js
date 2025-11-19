const API_BASE_URL = import.meta.env.VITE_API_URL || "https://web103-finalproject-gzz2.onrender.com/api";

// Watch endpoints
export const watchAPI = {
  getAll: async (limit = 20, offset = 0) => {
    const response = await fetch(`${API_BASE_URL}/watches?limit=${limit}&offset=${offset}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch watches');
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/watches/${id}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch watch');
    return response.json();
  }
};

// Auth endpoints
export const authAPI = {
  checkLoginStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/login/success`, {
      credentials: 'include'
    });
    if (!response.ok) return { success: false, user: null };
    return response.json();
  },
  
  login: () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  },
  signupWithEmail: async (email, password, name) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name })
    });
    if (!response.ok) return { success: false, user: null };
    return response.json();
  },
  loginWithEmail: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) return { success: false, user: null };
    return response.json();
   }, 
  
   logout: async () => {
    return fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
  }
  
};

// User endpoints
export const userAPI = {
  getProfile: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  }
};

// Wishlist endpoints
export const wishlistAPI = {
  getAll: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/wishlists/user/${userId}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return response.json();
  },
  
  add: async (userId, watchId) => {
    const response = await fetch(`${API_BASE_URL}/wishlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ user_id: userId, watch_id: watchId })
    });
    if (!response.ok) throw new Error('Failed to add to wishlist');
    return response.json();
  },
  
  remove: async (id) => {
    const response = await fetch(`${API_BASE_URL}/wishlists/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to remove from wishlist');
    return response.json();
  }
};


// Review endpoints
export const reviewAPI = {
  getByWatch: async (watchId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/watch/${String(watchId).trim()}`, {
      credentials: 'include'
    });    
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  
  
  create: async (reviewData) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) throw new Error('Failed to create review');
    return response.json();
  }
};

// Brand endpoints
export const brandAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch brands');
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch brand');
    return response.json();
  }
};
