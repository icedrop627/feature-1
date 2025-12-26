import { Profile } from '@/lib/types';

export const mockProfiles: Profile[] = [
  {
    id: 'user-1',
    name: '테스트 사용자',
    avatar_url: 'https://example.com/avatars/user1.jpg',
    bio: '여행을 좋아하는 디지털 노마드입니다.',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    name: '관리자',
    avatar_url: 'https://example.com/avatars/admin.jpg',
    bio: 'K-Nomad 플랫폼 관리자',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'user-3',
    name: '일반 사용자',
    avatar_url: null,
    bio: '한국의 아름다운 도시를 탐험 중입니다.',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
];

export const getMockProfileById = (id: string): Profile | undefined => {
  return mockProfiles.find((profile) => profile.id === id);
};

export const mockCityReactions = [
  {
    id: 'reaction-1',
    city_id: '1',
    user_id: 'user-1',
    reaction_type: 'like' as const,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'reaction-2',
    city_id: '2',
    user_id: 'user-1',
    reaction_type: 'dislike' as const,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'reaction-3',
    city_id: '3',
    user_id: 'user-2',
    reaction_type: 'like' as const,
    created_at: '2024-01-02T00:00:00Z',
  },
];
