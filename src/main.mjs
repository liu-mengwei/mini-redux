export function createStore(reducer, enhancer) {
  let state = undefined;
  const listeners = [];

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((listener) => listener?.());
  }

  function subscribe(listener) {
    listeners.push(listener);
  }

  function getState() {
    return state;
  }

  let store = {
    state,
    dispatch,
    subscribe,
    getState,
  };

  if (enhancer && typeof enhancer === "function") {
    const newCreateStore = enhancer(createStore);
    store = newCreateStore(reducer);
  }

  return store;
}

// 合并函数
function compose(...fns) {
  return fns.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}

// 返回一个store的加强函数
export function applyMiddleware(...middlewares) {
  function enhancer(createStore) {
    function newCreateStore(reducer) {
      const store = createStore(reducer);

      const funcs = middlewares.map((middleware) => middleware(store));
      const genfn = compose(...funcs);

      const { dispatch } = store;
      const newDispatch = genfn(dispatch);

      return { ...store, dispatch: newDispatch };
    }

    return newCreateStore;
  }

  return enhancer;
}

export function combineReduers(reducerMap) {
  function reducer(state, action) {
    const keys = Object.keys(reducerMap);

    keys.forEach((key) => {
      state[key] = reducerMap[key]?.(state, action);
    });
  }
  return reducer;
}
