const middlewareLogger = store => next => action => {
  // console.log('Original State: ', store.getState());
  next(action);
  // console.log('New Updated State:', store.getState());
};

export default middlewareLogger;