import IAuth from "../Interface";

const INITIAL_STATE: Partial<IAuth> = {
  isLogin: false,
};

interface baseActionProps {
  type: string;
  payload: any;
}

const index = (state = INITIAL_STATE, action: baseActionProps) => {
  switch (action.type) {
    case "setAuth": {
      const newState = { ...state, ...action?.payload };
      return newState;
    }
    case "resetAuth": {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};

export default index;