const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
    'Content-Type' : 'application/json',
    'Authorization': `Bearer ${getToken()}`,
});

export const getComplaints = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.mine) params.append('mine', 'true');
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_URL}/api/complaints?${queryString}` 
      : `${API_URL}/api/complaints`;

    const response = await fetch(url, { headers: getHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch complaints');
    return data;
  } catch (error) {
    console.error('getComplaints error:', error);
    throw error;
  }
};

export const getComplaintById = async (id) => {
    try{
        const response = await fetch(`${API_URL}/api/complaints/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message || 'Something went wrong with getting complaint');

        }
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export const createComplaint = async (complaintData) => {
    try{
        const response = await fetch(`${API_URL}/api/complaints`, {
            method: 'POST',
            headers: getHeaders(),
            body : JSON.stringify(complaintData),
        });
        //do i need to .json  the respons ehere
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message || 'Something went wrong with creating the complaint');

        }
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateComplaint = async (id, updateData) => {
    try{
        const response = await fetch(`${API_URL}/api/complaints/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body : JSON.stringify(updateData),
        });
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message || 'Something went wrong with updating the complaint');

        }
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getComments = async (complaintId) => {
  try {
    const response = await fetch(`${API_URL}/api/comments/${complaintId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong with fetching the comments');
    }
    return data;
  } catch (error) {
    console.error('getComments error:', error);
    throw error;
  }
};

export const createComment = async (commentData) => {
  try {
    const response = await fetch(`${API_URL}/api/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(commentData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong with creating the comment');
    }
    return data;
  } catch (error) {
    console.error('createComment error:', error);
    throw error;
  }
};
export const getUsers = async (role) => {
  try {
    const url = role ? `${API_URL}/api/users?role=${role}` : `${API_URL}/api/users`;
    const response = await fetch(url, { headers: getHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
    return data;
  } catch (error) {
    console.error('getUsers error:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update user');
    return data;
  } catch (error) {
    console.error('updateUser error:', error);
    throw error;
  }
};

export const deleteComplaint = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/complaints/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete complaint');
    return data;
  } catch (error) {
    console.error('deleteComplaint error:', error);
    throw error;
  }
};

export const upvoteComplaint = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/complaints/${id}/upvote`, {
      method: 'POST',
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to upvote');
    return data;
  } catch (error) {
    console.error('upvoteComplaint error:', error);
    throw error;
  }
};

export const getMyProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/api/users/me`, { headers: getHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data;
  } catch (error) {
    console.error('getMyProfile error:', error);
    throw error;
  }
};

export const updateMyProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update profile');
    
    const currentUser = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('user', JSON.stringify({ ...currentUser, name: data.name }));
    
    return data;
  } catch (error) {
    console.error('updateMyProfile error:', error);
    throw error;
  }
};