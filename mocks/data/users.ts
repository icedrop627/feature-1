export interface MockUser {
  id: string;
  email: string;
  password: string;
  created_at: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'test@example.com',
    password: 'password123',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    email: 'admin@example.com',
    password: 'admin123',
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'user-3',
    email: 'user@example.com',
    password: 'user123',
    created_at: '2024-01-03T00:00:00Z',
  },
];

export const getMockUserByEmail = (email: string): MockUser | undefined => {
  return mockUsers.find((user) => user.email === email);
};

export const getMockUserById = (id: string): MockUser | undefined => {
  return mockUsers.find((user) => user.id === id);
};
