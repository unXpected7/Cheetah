import IAuth from "../Interface";

export const setAuthLogin = (payload: Partial<IAuth>) => ({
  type: "setAuth",
  payload,
});

export const resetAuthLogout = () => ({
  type: "resetAuth",
  payload: null,
});