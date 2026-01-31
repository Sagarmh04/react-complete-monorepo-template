import "server-only";

/*
 * StudioVault Storage Contracts
 * No R2/S3 bindings here — portable definitions only.
 */

export type StorageKey = string;

export interface SignedUrlResponse {
  key: StorageKey;
  url: string;
  expiresAt: string;
}
