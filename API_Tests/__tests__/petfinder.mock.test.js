const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

// Mock data
const mockAnimalsResponse = {
  animals: [
    {
      id: 76044953,
      type: "Dog",
      species: "Dog",
      breeds: {
        primary: "Rottweiler",
        secondary: null,
        mixed: false,
        unknown: false
      },
      age: "Adult",
      gender: "Male",
      size: "Large",
      status: "adoptable",
      name: "Duke"
    }
  ],
  pagination: {
    count_per_page: 20,
    total_count: 284088,
    current_page: 1,
    total_pages: 14205
  }
};

const mockTypesResponse = {
  types: [
    { name: "Dog" },
    { name: "Cat" },
    { name: "Rabbit" }
  ]
};

const mockBreedsResponse = {
  breeds: [
    { name: "Golden Retriever" },
    { name: "Labrador Retriever" },
    { name: "German Shepherd" }
  ]
};

describe('Petfinder API Tests', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('Mocked API Tests', () => {
    test('should fetch and validate animal types', async () => {
      mock.onGet('https://api.petfinder.com/v2/types').reply(200, mockTypesResponse);

      const response = await axios.get('https://api.petfinder.com/v2/types');

      expect(response.status).toBe(200);
      expect(response.data.types).toBeDefined();
      expect(response.data.types.some(t => t.name === 'Dog')).toBe(true);
    });

    test('should fetch and validate dog breeds', async () => {
      mock.onGet('https://api.petfinder.com/v2/types/dog/breeds').reply(200, mockBreedsResponse);

      const response = await axios.get('https://api.petfinder.com/v2/types/dog/breeds');

      expect(response.status).toBe(200);
      expect(response.data.breeds).toBeDefined();
      expect(response.data.breeds.length).toBeGreaterThan(0);
    });

    test('should search for animals and validate response', async () => {
      mock.onGet(/https:\/\/api\.petfinder\.com\/v2\/animals.*/).reply(200, mockAnimalsResponse);

      const response = await axios.get('https://api.petfinder.com/v2/animals', {
        params: {
          type: 'dog',
          breed: 'Golden Retriever'
        }
      });

      expect(response.status).toBe(200);
      expect(response.data.animals).toBeDefined();
      expect(response.data.animals.length).toBeGreaterThan(0);
      expect(response.data.pagination).toBeDefined();
    });
  });
});
