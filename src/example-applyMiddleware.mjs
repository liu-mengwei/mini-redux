import { applyMiddleware, createStore } from "./main.mjs";

function logger1(store) {
  // dispatch 包装函数， next就是原来的dispatch;
  return function (next) {
    // 返回一个新的 dispatch
    return function (action) {
      console.group(action.type);
      console.info("dispatching", action);
      let result = next(action);
      console.log("next state", store.getState());
      console.groupEnd();
      return result;
    };
  };
}

function logger2(store) {
  // dispatch 包装函数， next就是原来的dispatch;
  return function (next) {
    // 返回一个新的 dispatch
    return function (action) {
      console.log(1);
      let result = next(action);
      console.log(2);
      return result;
    };
  };
}

function logger3(store) {
  // dispatch 包装函数， next就是原来的dispatch;
  return function (next) {
    // 返回一个新的 dispatch
    return function (action) {
      console.log(3);
      let result = next(action);
      console.log(4);
      return result;
    };
  };
}

const initState = {
  milk: 0,
};

export function reducer(state = initState, action) {
  switch (action.type) {
    case "PUT_MILK":
      return { ...state, milk: state.milk + action.count };
    case "TAKE_MILK":
      return { ...state, milk: state.milk - action.count };
    default:
      return state;
  }
}

// 在createStore的时候将applyMiddleware作为第二个参数传进去
const store = createStore(reducer, applyMiddleware(logger1, logger2, logger3));
store.dispatch({ type: "PUT_MILK", count: 1 });
store.getState();
