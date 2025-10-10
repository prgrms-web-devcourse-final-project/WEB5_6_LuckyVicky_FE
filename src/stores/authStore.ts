"use client";

import { create } from 'zustand';
import { fetchSession } from '@/services/auth';

export type Role = 'USER' | 'ARTIST' | 'ADMIN';

const ROLE_MAP: Record<string, Role> = {
  USER: 'USER',
  ARTIST: 'ARTIST',
  ADMIN: 'ADMIN',
  ROLE_USER: 'USER',
  ROLE_ARTIST: 'ARTIST',
  ROLE_ADMIN: 'ADMIN',
};

function normalizeRole(value: unknown): Role | null {
  if (typeof value !== 'string') return null;
  const key = value.replace(/^ROLE_/i, '').toUpperCase();
  return ROLE_MAP[key] ?? null;
}

function normalizeRoles(values: unknown): Role[] {
  if (!Array.isArray(values)) return [];
  const next = values
    .map((value) => normalizeRole(value))
    .filter((value): value is Role => Boolean(value));
  return Array.from(new Set(next));
}

type AuthState = {
  role: Role | null;
  availableRoles: Role[];
  accessToken?: string;
  refreshToken?: string;
  isHydrated: boolean;
  setAuth: (payload: {
    role: Role | string | null | undefined;
    availableRoles?: Array<Role | string> | null;
    accessToken?: string;
    refreshToken?: string;
  }) => void;
  hydrate: () => Promise<void>;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  availableRoles: [],
  accessToken: undefined,
  refreshToken: undefined,
  isHydrated: false,
  setAuth: ({ role, availableRoles, accessToken, refreshToken }) =>
    set(() => ({
      role: normalizeRole(role),
      availableRoles: normalizeRoles(availableRoles ?? []),
      accessToken,
      refreshToken,
      isHydrated: true,
    })),
  hydrate: async () => {
    try {
      const session = await fetchSession();
      if (session) {
        const rawRoles =
          session.availableRoles ?? session.roles ?? session.authorities ?? null;
        const rolesArray = Array.isArray(rawRoles)
          ? rawRoles
          : rawRoles != null
            ? [rawRoles]
            : [];

        const primaryRole =
          session.selectedRole ?? session.role ?? rolesArray[0] ?? null;

        set(() => ({
          role: normalizeRole(primaryRole),
          availableRoles: normalizeRoles(
            rolesArray.length > 0
              ? rolesArray
              : primaryRole
                ? [primaryRole]
                : [],
          ),
          accessToken:
            typeof session.accessToken === 'string'
              ? session.accessToken
              : undefined,
          refreshToken:
            typeof session.refreshToken === 'string'
              ? session.refreshToken
              : undefined,
          isHydrated: true,
        }));
      } else {
        set(() => ({
          role: null,
          availableRoles: [],
          accessToken: undefined,
          refreshToken: undefined,
          isHydrated: true,
        }));
      }
    } catch (error) {
      console.error('Failed to hydrate auth store', error);
      set(() => ({
        role: null,
        availableRoles: [],
        accessToken: undefined,
        refreshToken: undefined,
        isHydrated: true,
      }));
    }
  },
  reset: () =>
    set(() => ({
      role: null,
      availableRoles: [],
      accessToken: undefined,
      refreshToken: undefined,
      isHydrated: true,
    })),
}));
