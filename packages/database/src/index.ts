import "server-only";

/*
 * StudioVault Database Contracts
 * No runtime drivers here — only schema + types.
 */

export type UserID = string;

export interface User {
  id: UserID;
  email: string;
  createdAt: string;
}

/**
 * Shared table names (portable constants)
 */
export const Tables = {
  users: "users"
} as const;
