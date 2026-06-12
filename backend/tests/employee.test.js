const employeeService = require('../src/services/employeeService');
const employeeRepository = require('../src/repositories/employeeRepository');

jest.mock('../src/config/db', () => ({}));
jest.mock('../src/repositories/employeeRepository');
jest.mock('../src/repositories/userRepository');

describe('Employee Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all employees with pagination data', async () => {
    employeeRepository.findAll.mockResolvedValue([{ id: 1, name: 'Employee 1' }]);
    employeeRepository.countAll.mockResolvedValue(1);

    const result = await employeeService.getAllEmployees(1, 10, '');
    
    expect(result.employees.length).toBe(1);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('should get employee by id', async () => {
    employeeRepository.findById.mockResolvedValue({ id: 1, name: 'Employee 1' });
    
    const result = await employeeService.getEmployeeById(1);
    
    expect(result.id).toBe(1);
    expect(result.name).toBe('Employee 1');
  });
});
