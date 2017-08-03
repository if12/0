/**
 *  
 fallback([
    () => {
      console.log('task1');
      return Promise.resolve();
    },
    () => {
      console.log('task2');
      return Promise.reject();
    }
  ]).then(
    () => {
      console.log('success!');
    },
    () => {
      console.log('failure!');
    }
  );
 */