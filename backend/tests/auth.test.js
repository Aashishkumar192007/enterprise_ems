const authService = require('../src/services/authService');
const userRepository = require('../src/repositories/userRepository');
const bcrypt = require('bcrypt');

jest.mock('../src/config/db', () => ({}));
jest.mock('../src/repositories/userRepository');
jest.mock('bcrypt');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    userRepository.create.mockResolvedValue({ id: 1, email: 'test@example.com', name: 'Test User', role: 'User' });

    const result = await authService.register({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.email).toBe('test@example.com');
    expect(userRepository.create).toHaveBeenCalled();
  });

  it('should throw error if email already exists', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

    await expect(authService.register({
      name: 'Test',
      email: 'test@example.com',
      password: 'password123',
    })).rejects.toThrow('Email already registered');
  });
});
