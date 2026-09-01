const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem('token');

const getHeaders = () => ({
    'Content-Type' : 'application/json',
    'Authorization': `Bearer ${getToken()}`,
});

export const getComplaints = async () => {
    try{
        const response = await fetch(`${API_URL}/api/complaints`, {
            method: 'GET',
            headers: getHeaders(),
        });
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message || 'Something went wrong with getting complaints');

        }
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

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