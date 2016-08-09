
function onPush(github, event, cb) {
  console.log("onPush");
  if (event.ref != "refs/heads/master") {
    console.log("Not master");
    cb();
  }
  console.log("Fetching PRs...");
  github.pullRequests.getAll({
    user: event.repository.owner.name,
    repo: event.repository.name,
    base: "master"
    
  }, function(err, res) {
    console.log("Got PRs...");
    console.log(err.message);
    cb();
  });
}
