const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type FollowerEntry = {
  username: string;
  display_name: string;
  profile_picture_url: string;
  gender_probability: number;
};

export type AnalyzeResult = {
  men: FollowerEntry[];
  women: FollowerEntry[];
  unknown: FollowerEntry[];
};

export type AnalysisHistoryItem = {
  id: string;
  target_username: string;
  created_at: string;
};

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('stalkr_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return data as T;
}

export async function register(email: string, password: string) {
  return request<{ token: string; user: { id: string; email: string; credits: number } }>(
    '/api/auth/register',
    { method: 'POST', body: JSON.stringify({ email, password }) }
  );
}

export async function login(email: string, password: string) {
  return request<{ token: string; user: { id: string; email: string; credits: number } }>(
    '/api/auth/login',
    { method: 'POST', body: JSON.stringify({ email, password }) }
  );
}

export async function getCredits() {
  return request<{
    credits: number;
    unlimited: boolean;
    subscription_expires_at: string | null;
  }>('/api/credits');
}

export async function useCredit() {
  return request<{ credits: number; unlimited: boolean }>('/api/credits/use', {
    method: 'POST',
  });
}

export async function analyze(username: string) {
  return request<AnalyzeResult>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
}

export async function getAnalysisHistory() {
  return request<{ analyses: AnalysisHistoryItem[] }>('/api/analyze/history');
}

export async function createCheckout(priceType: '1' | '5' | 'unlimited') {
  return request<{ url: string }>('/api/credits/checkout', {
    method: 'POST',
    body: JSON.stringify({ priceType }),
  });
}

export function saveToken(token: string) {
  localStorage.setItem('stalkr_token', token);
}

export function clearToken() {
  localStorage.removeItem('stalkr_token');
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
