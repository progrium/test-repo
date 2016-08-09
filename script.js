const Promise = require("bluebird");

const pleaseRebase = "Please rebase your PR, thanks!";

function onPush(github, event, cb) {
  console.log("onPush");
  if (event.ref != "refs/heads/master") {
    console.log("Not master");
    cb();
  }
  Promise.promisifyAll(github);
  github.pullRequests.getAll({
    user: event.repository.owner.name,
    repo: event.repository.name,
    base: "master"
  
  }).then(function(prs) {
    if (prs.length == 0) {
      console.log("No PRs");
      return cb();
    }
    Promise.all(
      prs.map(function(pr) {
        return github.pullRequests.get({
          user: pr.base.repo.owner.login,
          repo: pr.base.repo.name,
          number: pr.number
        })
      })
    ).then(function(prs) {
      Promise.all(
        prs.map(function(pr) {
          if (pr.mergeable == false) {
            return github.issues.getComments({
              user: pr.base.repo.owner.login,
              repo: pr.base.repo.name,
              number: pr.number,
              per_page: 100
            }).then(function(comments) {
              if (comments.length > 0 && comments[comments.length-1].body == pleaseRebase) {
                return Promise.resolve();
              }
              return github.issues.createComment({
                user: pr.base.repo.owner.login,
                repo: pr.base.repo.name,
                number: pr.number,
                body: pleaseRebase
              });
            });
          } else {
            return Promise.resolve();
          }
        })
      ).then(function() {
        console.log("done!");
        cb();
      });
    });
  }).catch(function(err) {
    if (err) {
      console.log("error:", err.message);
      return cb();
    }
  });
}

