import type { ApiResponse } from './types';

export async function searchProfiles(username: string): Promise<ApiResponse> {
  const response = await fetch(`/api/profiles?username=${encodeURIComponent(username)}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }

  return response.json();
} 