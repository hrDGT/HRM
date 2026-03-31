import Cookies from "js-cookie";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
} as const;

export const authStorage = {
  setToken: (token: string) => Cookies.set(STORAGE_KEYS.ACCESS_TOKEN, token, { expires: 7, path: "/" }),
  removeToken: () => Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN),
};