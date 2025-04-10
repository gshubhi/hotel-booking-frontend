import axios from 'axios';

const API_URL = 'http://localhost:9875/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  registerCustomer: (data) => api.post('/auth/register/customer', data),
  registerOwner: (data) => api.post('/auth/register/owner', data),
};

export const hotels = {
  search: (term) => api.get(`/hotels/search?searchTerm=${term}`),
  getById: (id) => api.get(`/hotels/hotel/${id}`),
  getByCity: (city) => api.get(`/hotels/city/${city}`),
  create: (ownerId, data) => api.post(`/hotels?ownerId=${ownerId}`, data),
  update: (id, data) => api.put(`/hotels/${id}`, data),
  delete: (id) => api.delete(`/hotels/${id}`),
  getByOwner: (ownerId) => api.get(`/hotels/owner/${ownerId}`),
  getCities: () => api.get(`/hotels/getCity`),
  getAvailableRoomsByCityAndDate: (checkinDate, checkoutDate, city) => api.get(`/inventory/available-hotels/${checkinDate}/${checkoutDate}/${city}`)
};

export const roomTypes = {
  getByHotel: (hotelId) => api.get(`/roomTypes/hotel/${hotelId}`),
  create: (data) => api.post('/roomTypes', data),
  update: (id, data) => api.put(`/roomTypes/${id}`, data),
  delete: (id) => api.delete(`/roomTypes/${id}`),
};

export const bookings = {
  create: (customerId, data) => api.post(`/bookings/customer/${customerId}`, data),
  getCustomerBookings: (customerId) => api.get(`/bookings/customer/${customerId}`),
  getHotelBookings: (hotelId) => api.get(`/bookings/hotel/${hotelId}`),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

export const inventory = {
  getInventoryByOwner: (ownerId) => api.get(`/inventory/${ownerId}`),
  intializeInventory:(roomTypeId) => api.post(`/inventory/intialize/${roomTypeId}`)
};

export const userProfile = {
  getCustomerProfile: (userId) => api.get(`/user/customer/${userId}`),
  getOwnerProfile: (userId) => api.get(`/user/owner/${userId}`),
  updateCustomerProfile: (userId, data) => api.put(`/user/update/customer/${userId}`, data),
  updateOwnerProfile: (userId, data) => api.put(`/user/update/owner/${userId}`, data),
  deleteCustomerProfile: (userId) => api.delete(`/user/customer/${userId}`),
  deleteOwnerProfile: (userId) => api.delete(`/user/owner/${userId}`),
  feedbackSubmit:(userId, data) => api.post( `/user/customer/feedback/${userId}`, data),
  getFeedback: () => api.get(`/user/customer/getFeedback`)
}

export const images = {
  uploadImage: (hotelId, data) => api.post(`/image/hotel/${hotelId}`, data,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getImage: (hotelId) => api.get(`/image/hotel/getImage/${hotelId}`)
};

export default api; 
