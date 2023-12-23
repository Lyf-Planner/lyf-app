import Firebase from "firebase/app";

export const LOGIN_READY = "LOGIN_READY";
export const MFA_READY = "MFA_READY";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";
export const LOADING = "LOADING";

export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";

export const FACEBOOK_LOGIN = "FACEBOOK_LOGIN";
export const GOOGLE_LOGIN = "GOOGLE_LOGIN";
export const EMAIL_LOGIN = "EMAIL_LOGIN";

export const MFA_REQUIRED = "MFA_REQUIRED";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";

export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_ERROR = "LOGOUT_ERROR";

export const SUCCESS = "SUCCESS";
export const ERROR = "ERROR";

export const TOKEN_UPDATE = "TOKEN_UPDATE";

const INITIAL_STATE = {
  action: LOGIN_READY,
  loading: false,
  token: "",
};

export function userStateReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        action: action.type,
        message: action.message,
      };
    }
    case MFA_REQUIRED: {
      return {
        ...state,
        action: action.type,
        message: action.message,
        resolver: action.resolver,
        error: null,
      };
    }
    case LOGIN_ERROR: {
      return {
        ...state,
        action: action.type,
        message: action.message,
      };
    }
    case FORGOT_PASSWORD: {
      return {
        ...state,
        action: action.type,
        message: action.message,
      };
    }
    case LOGOUT_USER: {
      return {
        ...state,
        action: action.type,
        message: action.message,
      };
    }
    case TOKEN_UPDATE: {
      if (action.token?.length > 0) {
        return {
          ...state,
          action: LOGIN_SUCCESS,
          token: action.token,
        };
      } else {
        return {
          ...state,
          action: LOGIN_READY,
          token: "",
        };
      }
    }
  }
  return state;
}
