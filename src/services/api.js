// services/api.js
const API_URL = 'http://localhost:6011/REST/ppl';

export const fetchPeople = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch people');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// services/api.js
export const addPerson = async (person) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(person),
      });
      if (!response.ok) {
        throw new Error('Failed to add person');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };
  // services/api.js
export const updatePerson = async (id, updatedPerson) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPerson),
      });
      if (!response.ok) {
        throw new Error('Failed to update person');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };
  
  // services/api.js
export const deletePerson = async (id) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete person');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };
  
  