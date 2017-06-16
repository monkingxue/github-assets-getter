/**
 * Created by xueyingchen.
 */

function createIssue({title, body, labels, milestone, assignees, owner, repository}) {
  return this.httpPost({
    path: `/repos/${owner}/${repository}/issues`, data: {
      title, body, labels, milestone, assignees, owner, repository
    }
  }).then(body => {
    return body.data;
  });
}

function fetchIssue({owner, repository, number}) {
  return this.httpGet({path: `/repos/${owner}/${repository}/issues/${number}`})
    .then(body => {
      return body.data;
    });
}

function fetchIssues({owner, repository}) {
  return this.httpGet({path: `/repos/${owner}/${repository}/issues`})
    .then(body => {
      return body.data;
    });
}

function addIssueComment({owner, repository, number, body}) {
  return this.httpPost({
    path: `/repos/${owner}/${repository}/issues/${number}/comments`, data: {
      body
    }
  }).then(body => {
    return body.data;
  });
}

function fetchIssueComments({owner, repository, number}) {
  return this.httpGet({path: `/repos/${owner}/${repository}/issues/${number}/comments`})
    .then(body => {
      return body.data;
    });
}

function addIssueReaction({owner, repository, number, content}) {
  let saveAccept = this.headers["Accept"];
  this.headers["Accept"] = "application/vnd.github.squirrel-girl-preview";
  return this.httpPost({
    path: `/repos/${owner}/${repository}/issues/${number}/reactions`, data: {
      content
    }
  }).then(body => {
    this.headers["Accept"] = saveAccept;
    return body.data;
  });
}

function addIssueCommentReaction({owner, repository, id, content}) {
  let saveAccept = this.headers["Accept"];
  this.headers["Accept"] = "application/vnd.github.squirrel-girl-preview";
  return this.httpPost({
    path: `/repos/${owner}/${repository}/issues/comments/${id}/reactions`, data: {
      content
    }
  }).then(body => {
    this.headers["Accept"] = saveAccept;
    return body.data;
  });
}

module.exports = {
  createIssue: createIssue,
  fetchIssue: fetchIssue,
  fetchIssues: fetchIssues,
  addIssueComment: addIssueComment,
  fetchIssueComments: fetchIssueComments,
  addIssueReaction: addIssueReaction,
  addIssueCommentReaction: addIssueCommentReaction
};