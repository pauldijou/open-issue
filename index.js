var separator = '\n\n';

var providers = {
  github: {
    url: 'https://github.com'
  }
};

var providersNames = Object.keys(providers);

function Issue() {
  this.content = {
    body: [],
    labels: []
  };

  this.provider = function (provider) {
    if (providersNames.indexOf(provider) < 0) {
      throw new Error('Invalid provider [' + provider + ']');
    }

    this.content.provider = provider;
    return this;
  };

  this.title = function (title) {
    this.content.title = title;
    return this;
  };

  this.repository = function (repository) {
    this.content.repository = repository;
    return this;
  };

  this.append = function (txt) {
    this.content.body.push({
      type: 'text',
      value: txt
    });
    return this;
  };

  this.appendCode = function (code, lang) {
    this.content.body.push({
      type: 'code',
      lang: lang,
      value: code
    });
    return this;
  };

  this.labels = function () {
    for (var i = 0, l = arguments.length; i < l; ++i) {
      if (arguments[i] && this.content.labels.indexOf(arguments[i]) < 0) {
        this.content.labels.push(arguments[i]);
      }
    }
    return this;
  };

  this.milestone = function (milestone) {
    this.content.milestone = milestone;
    return this;
  };

  this.assign = function (assignee) {
    this.content.assignee = assignee;
    return this;
  };

  this.url = function () {
    var isFirst = true;
    function query(name, value) {
      var res = '';
      if (name && value) {
        res = (isFirst ? '' : '&') + name + '=' + encodeURIComponent(value);
        isFirst = false;
      }
      return res;
    }

    function extractBody(part) {
      switch (part.type) {
        case 'text':
          return part.value;
        case 'code':
          return '```' + (part.lang || '') + '\n' + part.value + '\n```';
      }
    }

    var url = '';
    url += providers[this.content.provider].url;
    url += '/' + this.content.repository + '/issues/new?';
    url += query('title', this.content.title);
    this.content.labels.forEach(function (label) {
      url += query('labels%5B%5D', label);
    });
    url += query('assignee', this.content.assignee);
    url += query('milestone', this.content.milestone);
    url += query('body', this.content.body.map(extractBody).join(separator));
    return url;
  };

  this.open = function () {
    require('opn')(this.url());
    return this;
  };
}

module.exports = function () {
  return new Issue();
};

module.exports.separator = function (sep) {
  separator = sep;
};

// Add aliases for each provider
providersNames.forEach(function (name) {
  module.exports[name] = function (repo) {
    var issue = new Issue();
    issue.provider(name);
    if (repo) {
      issue.repository(repo);
    }
    return issue;
  };
});
