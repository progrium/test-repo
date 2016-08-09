
function onPush(github, event, cb) {
  if (event.ref != "refs/heads/master") {
    cb();
  }
  github.pullRequests.getAll({
    user: event.repository.owner.login,
    repo: event.repository.name,
    base: "master"
    
  }, function(err, res) {
    console.log(JSON.stringify(res));
    cb();
  });
}
