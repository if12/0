const path = require('path');
const spawn = require('cross-spawn');

function checkCmd(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn.sync(cmd, args);
    const worked = child.stdout && child.stdout.toString();
    return worked ? resolve(true) : reject(false);
  });
}

// exports.getFilename = filePath => path.parse(filePath).name;
exports.getFilename = filePath =>
  path.basename(filePath, path.extname(filePath));

/**
 * @param []
 * return Promise
 */
exports.fallback = tasks => {
  return new Promise((resolve, reject) => {
    const resolveIt = task => {
      return () => {
        return resolve(task.resolve);
      };
    };
    return tasks.reduce((acc, task, index, tasks) => {
      let fn = typeof task === 'object' ? task.fn : task;
      let resolveTask = index === 0 ? resolve : resolveIt(tasks[index - 1]);

      if (index === tasks.length - 1) {
        return acc.then(resolveTask, fn).then(resolveIt(tasks[index]), reject);
      } else {
        return acc.then(resolveTask, fn);
      }
    }, Promise.reject());
  });
};

exports.checkYarnInstalled = () => {
  return checkCmd('yarn', ['--version']);
};

exports.checkNpmInstalled = () => {
  return checkCmd('npm', ['--version']);
};
