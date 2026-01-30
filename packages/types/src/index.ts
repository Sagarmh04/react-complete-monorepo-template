/**
 * Shared type contracts for StudioVault.
 * Runtime-agnostic: types only.
 */

export type ID = string;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
