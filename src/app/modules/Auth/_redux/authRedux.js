import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
// import { getUserByToken } from "./authCrud"

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  // UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",
  SetUser: "[Set User] Action",
};

const initialAuthState = {
  user: undefined,
  tokens: undefined,
  userAccess: undefined,
  menu: undefined,
  // authToken: undefined,
};

export const reducer = persistReducer(
  {
    storage,
    key: "v726-demo1-auth",
    whitelist: ["tokens", "user", "userAccess","menu"],
  },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        //console.log("AuthRedux login action")
        // const { authToken } = action.payload
        const { data } = action.payload;

        // return { authToken, user: undefined }
        // return { ...data.data }
        return { ...data };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;

        return { authToken, user: undefined };
      }

      case actionTypes.Logout: {
        // TODO: Change this code. Actions in reducer aren't allowed.
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;
        return { ...state, user };
      }

      case actionTypes.SetUser: {
        const { user } = action.payload;
        return { ...state, user };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: (data) => ({
    type: actionTypes.Login,
    payload: { data },
  }),
  register: (authToken) => ({
    type: actionTypes.Register,
    payload: { authToken },
  }),
  logout: () => ({ type: actionTypes.Logout }),
  // requestUser: (user) => ({
  //   type: actionTypes.UserRequested,
  //   payload: { user },
  // }),
  fulfillUser: (user) => ({ type: actionTypes.UserLoaded, payload: { user } }),
  setUser: (user) => ({ type: actionTypes.SetUser, payload: { user } }),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    //console.log("function* saga()");
    //yield put(actions.requestUser())
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    //yield put(actions.requestUser())
  });

  // yield takeLatest(actionTypes.UserRequested, function* userRequested() {
  //   //   console.log("here is data error")
  //   //   const { user } = yield getUserByToken()
  //   //   yield put(actions.fulfillUser(user))
  // })
}
