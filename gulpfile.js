const gulp = require('gulp');
const screeps = require('gulp-screeps');
const credentials = require('./.credentials.js');

const branchTasks = [];
['asimov','babbage'].forEach(branch => {
  const branchTask = taskScreeps(branch);
  gulp.task('screeps:' + branch, branchTask);
  branchTasks.push(branchTask);
});

const defaultTask = branchTasks['babbage'];
gulp.task('default', defaultTask);


const taskScreeps = function(branch = 'testing', options = {}) {
  const defaults = { branch };
  const config = Object.assign({}, defaults, credentials, options);

  const task = function(callback) {
    gulp.src(config.branch + '/*.js').pipe(
      screeps(config)
    );
    callback();
  };

  task.displayName = 'screeps:' + branch;
  // task.flags = { '-p' : 'Branch name prefix' };

  return task;
};

