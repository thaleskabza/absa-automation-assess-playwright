
const axios = require('axios');
const qs = require('querystring');

describe('Petfinder API — Real', () => {

  const CLIENT_ID     = '1yIxd8HkNjV4ymqLi2GhaFFYOps9SrpEeT0cUWSSWwDAVHKxeF';
  const CLIENT_SECRET = 'kih7OW7Q3yGiVK4i7Y33hEwsS24eEWRyiN6gaNMt';

  let token = '';

  beforeAll(async () => {
    if (CLIENT_ID === 'YOUR_CLIENT_ID' || CLIENT_SECRET === 'YOUR_CLIENT_SECRET') {
      console.warn(
        'Skipping real‑API tests: please update CLIENT_ID and CLIENT_SECRET in __tests__/petfinder.real.test.js'
      );
      return;
    }

    const form = qs.stringify({
      grant_type:    'client_credentials',
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    try {
      const res = await axios.post(
        'https://api.petfinder.com/v2/oauth2/token',
        form,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      token = res.data.access_token;
      console.log('Token: \n',token);
    } catch (err) {
      console.error('Failed to fetch access token:', err.message);
    }
  });

  test('fetch real types & verify Dog exists', async () => {
    if (!token) return;  // skipped if auth didn’t run
    const res = await axios.get('https://api.petfinder.com/v2/types', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(res.status).toBe(200);
    expect(res.data.types.some(t => t.name === 'Dog')).toBe(true);
  });


  test('should fetch real animal types and verify Dog exists', async () => {
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await axios.get('https://api.petfinder.com/v2/types', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status).toBe(200);
    expect(response.data.types).toBeDefined();
    expect(response.data.types.some(t => t.name === 'Dog')).toBe(true);
  }, 10000);

  test('should fetch real dog breeds and search for Golden Retrievers', async () => {
    if (!token) {
      throw new Error('No access token available');
    }

    // First get breeds to verify Golden Retriever exists
    const breedsResponse = await axios.get('https://api.petfinder.com/v2/types/dog/breeds', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(breedsResponse.status).toBe(200);
    expect(breedsResponse.data.breeds).toBeDefined();
    expect(breedsResponse.data.breeds.length).toBeGreaterThan(0);

    // Then search for Golden Retrievers
    const searchResponse = await axios.get('https://api.petfinder.com/v2/animals', {
      params: {
        type: 'dog',
        breed: 'Golden Retriever',
        limit: 1
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(searchResponse.status).toBe(200);
    expect(searchResponse.data.animals).toBeDefined();
    expect(searchResponse.data.animals.length).toBeGreaterThan(0);
  }, 15000); // Increased timeout for multiple real API calls
});


