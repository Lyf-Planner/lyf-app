import Firebase from "firebase/app";
import {
  MFA_REQUIRED,
  LOGIN_SUCCESS,
  FORGOT_PASSWORD,
  LOGIN_ERROR,
  LOGIN_READY,
  FACEBOOK_LOGIN,
  EMAIL_LOGIN,
  GOOGLE_LOGIN,
} from "../reducers/userState";

/*
 *  Try and login, if the user has MFA enrolled,
 *  return the code MFA_REQUIRED. If an misc error
 *  occurs, return the code LOGIN_ERROR.
 */
export function loginUser({ provider, email, password }) {
  return async function loginUserThunk(dispatch, getState) {
    try {
      var providerResolver;
      switch (provider) {
        case EMAIL_LOGIN: {
          await Firebase.auth().signInWithEmailAndPassword(email, password);
          return dispatch({
            type: LOGIN_SUCCESS,
            message: "Success!",
          });
        }
        case FACEBOOK_LOGIN: {
          console.log("FACEBOOK");
          providerResolver = new Firebase.auth.FacebookAuthProvider();
          break;
        }
        case GOOGLE_LOGIN: {
          console.log("GOOGLE");
          providerResolver = new Firebase.auth.GoogleAuthProvider();
          break;
        }
      }

      await Firebase.auth().signInWithPopup(providerResolver);
      return dispatch({
        type: LOGIN_SUCCESS,
        message: "Success!",
      });
    } catch (err) {
      if (err.code === "auth/multi-factor-auth-required") {
        console.log(err.resolver, "resolver, MFA required");
        return dispatch({
          type: MFA_REQUIRED,
          message: "Please complete the second factor auth!",
          resolver: err.resolver,
        });
      }

      return dispatch({
        type: LOGIN_ERROR,
        message: err.message,
      });
    }
  };
}

export function loginWithToken(token) {
  return async function loginTokenThunk(dispatch, getState) {
    try {
      await Firebase.auth().signInWithCustomToken(token);
      return dispatch({
        type: LOGIN_SUCCESS,
        message: "Success!",
      });
    } catch (err) {
      return dispatch({
        type: LOGIN_ERROR,
        message: "Could not sign in with token!",
      });
    }
  };
}

export function forgotPassword(email) {
  return async function forgotPasswordThunk(dispatch, getState) {
    try {
      await Firebase.auth().sendPasswordResetEmail(email);
      window.alert(
        "'Forgot password' email sent: please check your inbox, including your spam folder."
      );
      return dispatch({
        type: FORGOT_PASSWORD,
        message:
          "Forgot password' email sent: please check your inbox, including your spam folder.",
      });
    } catch (err) {
      console.error(`An error occurred sending password reset `, err);
      return dispatch({
        type: FORGOT_PASSWORD,
        message:
          "Unable to send password reset email: please contact your administrator",
      });
    }
  };
}

/*
 *  Log user out then dispatch
 *  the result.
 */
export function logout() {
  return async function logout(dispatch, getState) {
    try {
      await Firebase.auth().signOut();
      console.log(`LOGGING USER OUT!`);
      return dispatch({
        type: LOGIN_READY,
        message: "Logged out!",
      });
    } catch (err) {
      console.error(`Error logging out user: `, err);
      localStorage.setItem("token", undefined);
      return dispatch({
        type: LOGIN_READY,
        message: "Error! Unable to logout user!",
      });
    }
  };
}
