const API_URL = import.meta.env.VITE_API_URL;

const apiFetch = async (url, options = {}) => {

  const token = localStorage.getItem('token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }) 
  };
  
  const response = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const getComplaints = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.mine) params.append('mine', 'true');
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const queryString = params.toString();
  const url = `${API_URL}/api/complaints${queryString ? `?${queryString}` : ''}`;
  return apiFetch(url);
};

export const getComplaintById = async (id) => {
  return apiFetch(`${API_URL}/api/complaints/${id}`);
};

export const createComplaint = async (complaintData) => {
  if (complaintData.attachment instanceof File) {
    const formData = new FormData();
    formData.append('title', complaintData.title);
    formData.append('description', complaintData.description);
    formData.append('category', complaintData.category);
    formData.append('location', complaintData.location || '');
    formData.append('priority', complaintData.priority);
    formData.append('attachment', complaintData.attachment);
    
    const response = await fetch(`${API_URL}/api/complaints`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create complaint');
    return data;
  } else {
    return apiFetch(`${API_URL}/api/complaints`, {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });
  }
};

export const updateComplaint = async (id, updateData) => {
  return apiFetch(`${API_URL}/api/complaints/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

export const deleteComplaint = async (id) => {
  return apiFetch(`${API_URL}/api/complaints/${id}`, {
    method: 'DELETE',
  });
};

export const upvoteComplaint = async (id) => {
  return apiFetch(`${API_URL}/api/complaints/${id}/upvote`, {
    method: 'POST',
  });
};

export const getComments = async (complaintId) => {
  return apiFetch(`${API_URL}/api/comments/${complaintId}`);
};

export const createComment = async (commentData) => {
  return apiFetch(`${API_URL}/api/comments`, {
    method: 'POST',
    body: JSON.stringify(commentData),
  });
};

export const getUsers = async (role) => {
  const url = role ? `${API_URL}/api/users?role=${role}` : `${API_URL}/api/users`;
  return apiFetch(url);
};

export const updateUser = async (userId, userData) => {
  return apiFetch(`${API_URL}/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const getMyProfile = async () => {
  return apiFetch(`${API_URL}/api/users/me`);
};

export const updateMyProfile = async (profileData) => {
  const data = await apiFetch(`${API_URL}/api/users/me`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  localStorage.setItem('user', JSON.stringify({ ...currentUser, name: data.name }));
  
  return data;
};

export const logout = async () => {
  try {
    await apiFetch(`${API_URL}/api/auth/logout`, { method: 'POST' });
  } catch (err) {
    console.error('Logout API failed, clearing local state anyway', err);
  } finally {
    const theme = localStorage.getItem('resolver-theme');
    localStorage.clear();
    if (theme) localStorage.setItem('resolver-theme', theme);
  }
};

export const forgotPassword = async (email) => {
  return apiFetch(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (token, newPassword) => {
  return apiFetch(`${API_URL}/api/auth/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
};

export const getNotifications = async () => {
  return apiFetch(`${API_URL}/api/notifications`);
};

export const markNotificationAsRead = async (id) => {
  return apiFetch(`${API_URL}/api/notifications/${id}/read`, {
    method: 'PUT',
  });
};

export const markAllNotificationsAsRead = async () => {
  return apiFetch(`${API_URL}/api/notifications/mark-all-read`, {
    method: 'PUT',
  });
};

export const updateNotificationPreference = async (emailNotifications) => {
  return apiFetch(`${API_URL}/api/users/me/notifications`, {
    method: 'PUT',
    body: JSON.stringify({ emailNotifications }),
  });
};