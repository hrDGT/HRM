import { cookies } from 'next/headers';

export async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  const role = cookieStore.get('user_role');

  if (process.env.NODE_ENV === 'development') {
    return { isAuthenticated: true, isAdmin: true, userId: 1 };
  }

  if (!token?.value) {
    return { isAuthenticated: false, isAdmin: false, userId: null };
  }

  const userId = cookieStore.get('user_id')?.value || null;
  return {
    isAuthenticated: true,
    isAdmin: role?.value === 'admin',
    userId: userId ? parseInt(userId) : null,
  };
}