import type { Plugin } from "vue";
import { inject } from "vue";

type PublicKeys<T> = {
  [K in keyof T]: K extends string ? T[K] : never;
};

export type PublicMembers<T> = Pick<T, keyof PublicKeys<T>>;

export type UseVault<T> = {
  get: <K extends keyof T>(key: K) => T[K] | null;
  storeAndGet: <K extends keyof PublicMembers<T>>(
    key: K,
    value: PublicMembers<T>[K],
  ) => PublicMembers<T>[K];
};

export type Vault = {
  [id: string]: any;
};

export const vaultPlugin: Plugin = {
  install(app) {
    const vault: Vault = {};
    app.provide("vault", vault);
    app.config.globalProperties.$vault = vault;
  },
};

export function initVault<T>(vaultKey: string): UseVault<T> {
  const vault = inject("vault") as Vault;
  vault[vaultKey] ??= {};
  return {
    get<K extends keyof T>(key: K): T[K] | null {
      return vault[vaultKey]?.[key] ?? null;
    },
    storeAndGet<K extends keyof PublicMembers<T>>(
      key: K,
      value: PublicMembers<T>[K],
    ): PublicMembers<T>[K] {
      vault[vaultKey][key] = value;
      return value;
    },
  };
}
