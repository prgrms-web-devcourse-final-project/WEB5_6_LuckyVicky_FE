"use client";

import { create } from 'zustand';
import { fetchAuthStatus, fetchUserProfile } from '@/services/auth';

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
  needsAdditionalInfo: boolean;
  userProfile: {
    email?: string;
    nickname?: string;
    phone?: string;
  } | null;
  isHydrated: boolean;
  setAuth: (payload: {
    role?: Role | string | null;
    availableRoles?: Array<Role | string> | null;
    accessToken?: string;
    refreshToken?: string;
    needsAdditionalInfo?: boolean;
    userProfile?: {
      email?: string;
      nickname?: string;
      phone?: string;
    } | null;
  }) => void;
  hydrate: () => Promise<void>;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  availableRoles: [],
  accessToken: undefined,
  refreshToken: undefined,
  needsAdditionalInfo: false,
  userProfile: null,
  isHydrated: false,
  setAuth: ({ role, availableRoles, accessToken, refreshToken, needsAdditionalInfo, userProfile }) =>
    set((prev) => ({
      role: role !== undefined ? normalizeRole(role) : prev.role,
      availableRoles:
        availableRoles !== undefined
          ? normalizeRoles(availableRoles ?? [])
          : prev.availableRoles,
      accessToken: accessToken !== undefined ? accessToken : prev.accessToken,
      refreshToken: refreshToken !== undefined ? refreshToken : prev.refreshToken,
      needsAdditionalInfo:
        typeof needsAdditionalInfo === 'boolean'
          ? needsAdditionalInfo
          : prev.needsAdditionalInfo,
      userProfile:
        userProfile !== undefined
          ? userProfile === null
            ? null
            : {
                ...(prev.userProfile ?? {}),
                ...userProfile,
              }
          : prev.userProfile,
      isHydrated: true,
    })),
  hydrate: async () => {
    try {
      const status = await fetchAuthStatus();
      if (!status) {
        set(() => ({
          role: null,
          availableRoles: [],
          accessToken: undefined,
          refreshToken: undefined,
          needsAdditionalInfo: false,
          userProfile: null,
          isHydrated: true,
        }));
        return;
      }

      const rawRoles = status.availableRoles ?? [];
      const rolesArray = Array.isArray(rawRoles)
        ? rawRoles
        : rawRoles != null
          ? [rawRoles]
          : [];

      const primaryRole = status.selectedRole ?? status.role ?? rolesArray[0] ?? null;

      let profile: {
        email?: string;
        nickname?: string;
        phone?: string;
      } = {
        email:
          typeof status.email === 'string' && status.email.trim().length > 0
            ? status.email
            : undefined,
        nickname:
          typeof status.nickname === 'string' && status.nickname.trim().length > 0
            ? status.nickname
            : undefined,
        phone:
          typeof status.phone === 'string' && status.phone.trim().length > 0
            ? status.phone
            : undefined,
      };

      let needsAdditionalInfo = Boolean(status.needsAdditionalInfo);

      const shouldFetchProfile =
        needsAdditionalInfo || !profile.email || !profile.nickname || !profile.phone;

      if (shouldFetchProfile) {
        try {
          const userProfile = await fetchUserProfile();
          if (userProfile) {
            profile = {
              email:
                typeof userProfile.email === 'string' && userProfile.email.trim().length > 0
                  ? userProfile.email
                  : profile.email,
              nickname:
                typeof userProfile.nickname === 'string' && userProfile.nickname.trim().length > 0
                  ? userProfile.nickname
                  : typeof userProfile.name === 'string' && userProfile.name.trim().length > 0
                    ? userProfile.name
                    : profile.nickname,
              phone:
                typeof userProfile.phone === 'string' && userProfile.phone.trim().length > 0
                  ? userProfile.phone
                  : profile.phone,
            };
          }
        } catch (error) {
          console.error('fetchUserProfile error', error);
        }
      }

      if (!profile.phone) {
        needsAdditionalInfo = true;
      }

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
          typeof status.accessToken === 'string' && status.accessToken.trim().length > 0
            ? status.accessToken
            : undefined,
        refreshToken:
          typeof status.refreshToken === 'string' && status.refreshToken.trim().length > 0
            ? status.refreshToken
            : undefined,
        needsAdditionalInfo,
        userProfile: profile,
        isHydrated: true,
      }));
    } catch (error) {
      console.error('Failed to hydrate auth store', error);
      set(() => ({
        role: null,
        availableRoles: [],
        accessToken: undefined,
        refreshToken: undefined,
        needsAdditionalInfo: false,
        userProfile: null,
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
      needsAdditionalInfo: false,
      userProfile: null,
      isHydrated: true,
    })),
}));
