import { create } from 'zustand';

type Role = 'USER' | 'ARTIST' | 'ADMIN';
type AuthState = {
  role: Role | null;
  availableRoles: Role[];
  accessToken?: string;
  refreshToken?: string;
  setAuth: (payload: {
    role: Role | null;
    availableRoles?: Role[];
    accessToken?: string;
    refreshToken?: string;
  }) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  availableRoles: [],
  accessToken: undefined,
  refreshToken: undefined,
  setAuth: ({ role, availableRoles = [], accessToken, refreshToken }) =>
    set(() => ({
      role,
      availableRoles,
      accessToken,
      refreshToken,
    })),
  reset: () =>
    set(() => ({
      role: null,
      availableRoles: [],
      accessToken: undefined,
      refreshToken: undefined,
    })),
}));
