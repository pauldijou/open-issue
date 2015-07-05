// So few tests that they can all fit in one file
var assert = require('assert');
var issue = require('./index.js');

describe('open-issue', function () {
  describe('constructor', function () {
    it('should init an empty issue', function () {
      assert.deepEqual({body: [], labels:[]}, issue().content);
    });

    it('should init a github issue', function () {
      assert.deepEqual({provider: 'github', body: [], labels:[]}, issue.github().content);
    });
  });

  describe('setters', function () {
    it('should set title', function () {
      var i = issue();
      i.title('My title');
      assert.deepEqual({title: 'My title', body: [], labels:[]}, i.content);
      i.title(undefined);
      assert.deepEqual({title: undefined, body: [], labels:[]}, i.content);
    });

    it('should set provider', function () {
      var i = issue();
      i.provider('github');
      assert.deepEqual({provider: 'github', body: [], labels:[]}, i.content);

      assert.throws(function () {
        i.provider(undefined);
      }, /Invalid provider/);

      assert.throws(function () {
        i.provider('unknow');
      }, /Invalid provider/);
    });

    it('should set repository', function () {
      var i = issue();
      i.repository('pauldijou/open-issue');
      assert.deepEqual({repository: 'pauldijou/open-issue', body: [], labels:[]}, i.content);
      i.repository(undefined);
      assert.deepEqual({repository: undefined, body: [], labels:[]}, i.content);
    });

    it('should set labels', function () {
      var i = issue();
      i.labels('bug', 'fatal', 'error');
      assert.deepEqual({body: [], labels:['bug', 'fatal', 'error']}, i.content);
      i.labels('two', undefined, 'more');
      assert.deepEqual({body: [], labels:['bug', 'fatal', 'error', 'two', 'more']}, i.content);
      i.labels(undefined, null);
      assert.deepEqual({body: [], labels:['bug', 'fatal', 'error', 'two', 'more']}, i.content);
    });

    it('should set milestone', function () {
      var i = issue();
      i.milestone('1.0.0');
      assert.deepEqual({milestone: '1.0.0', body: [], labels:[]}, i.content);
      i.milestone(undefined);
      assert.deepEqual({milestone: undefined, body: [], labels:[]}, i.content);
    });

    it('should set assignee', function () {
      var i = issue();
      i.assign('pauldijou');
      assert.deepEqual({assignee: 'pauldijou', body: [], labels:[]}, i.content);
      i.assign(undefined);
      assert.deepEqual({assignee: undefined, body: [], labels:[]}, i.content);
    });

    it('should append content', function () {
      var i = issue();
      i.append('some text');
      assert.deepEqual({body: [{type: 'text', value: 'some text'}], labels:[]}, i.content);

      i.append('more text');
      assert.deepEqual({body: [{type: 'text', value: 'some text'}, {type: 'text', value: 'more text'}], labels:[]}, i.content);

      i.appendCode('console.log(1);', 'javascript');
      assert.deepEqual({body: [{type: 'text', value: 'some text'}, {type: 'text', value: 'more text'}, {type: 'code', lang: 'javascript', value: 'console.log(1);'}], labels:[]}, i.content);

      i.append('the end');
      assert.deepEqual({body: [{type: 'text', value: 'some text'}, {type: 'text', value: 'more text'}, {type: 'code', lang: 'javascript', value: 'console.log(1);'}, {type: 'text', value: 'the end'}], labels:[]}, i.content);
    });
  });

  describe('separator', function () {
    it('should be used and changed', function () {
      var i = issue.github('pauldijou/open-issue').append('1').append('2').append('3');
      assertUrls(i.url(), 'https://github.com/pauldijou/open-issue/issues/new?body=1%0A%0A2%0A%0A3');

      issue.separator('\n');
      assertUrls(i.url(), 'https://github.com/pauldijou/open-issue/issues/new?body=1%0A2%0A3');

      issue.separator('');
      assertUrls(i.url(), 'https://github.com/pauldijou/open-issue/issues/new?body=123');

      // Reset default separator for following tests
      issue.separator('\n\n');
    });
  });

  describe('url', function () {
    it('should support basic usage', function () {
      var url = issue.github('pauldijou/open-issue').title('title').labels('bug').assign('pauldijou').append('We got a bug').url();
      assertUrls(url, 'https://github.com/pauldijou/open-issue/issues/new?title=title&labels%5B%5D=bug&assignee=pauldijou&body=We%20got%20a%20bug');
    });

    it('should be ok with multiple append', function () {
      var url = issue.github('pauldijou/open-issue').title('BUG').append('We got a bug').append('And it is complicated').url();
      assertUrls(url, 'https://github.com/pauldijou/open-issue/issues/new?title=BUG&body=We%20got%20a%20bug%0A%0AAnd%20it%20is%20complicated');
    });

    it('should support real world case', function () {
      var url = issue.github('pauldijou/open-issue').title('Test').labels('bug', 'duplicate').assign('pauldijou').milestone('fake').append('**Please, do not actually create the issue!!** This is just a test.').appendCode('var a = 1 + 2;', 'javascript').append('## Subtitle').append('Hope you like it. Cheers.').url();

      assertUrls(url, 'https://github.com/pauldijou/open-issue/issues/new?title=Test&labels%5B%5D=bug&labels%5B%5D=duplicate&assignee=pauldijou&milestone=fake&body=**Please%2C%20do%20not%20actually%20create%20the%20issue!!**%20This%20is%20just%20a%20test.%0A%0A%60%60%60javascript%0Avar%20a%20%3D%201%20%2B%202%3B%0A%60%60%60%0A%0A%23%23%20Subtitle%0A%0AHope%20you%20like%20it.%20Cheers.');
    });
  });

  describe('open', function () {
    it('should open the browser', function () {
      // No real assert, it's up to you to check your browser ;-)
      issue.github('pauldijou/open-issue').title('Test').labels('bug', 'duplicate').assign('pauldijou').milestone('fake').append('**Please, do not actually create the issue!!** This is just a test.').appendCode('var a = 1 + 2;', 'javascript').append('## Subtitle').append('Hope you like it. Cheers.').open();
      assert.equal(true, true);
    });
  });
});

// ------------------------------------
// Utils

// We shouldn't care about the order of the query string
function extractQueries(str) {
  return str.split('&').map(function (q) {
    return {key: q.split('=')[0], value: q.split('=')[1]};
  }).sort(function (q1, q2) {
    if (q1.key < q1.key) {
      return -1;
    } else if (q1.key > q2.key) {
      return 1;
    } else if (q1.value < q2.value) {
      return -1;
    } else if (q1.value > q2.value) {
      return 1;
    } else {
      return 0;
    }
  });
}

function assertQueries(q1, q2) {
  var queries1 = extractQueries(q1);
  var queries2 = extractQueries(q2);

  for(var i = 0, l = queries1.length; i < l; ++i) {
    assert.equal(queries1[i].name, queries2[i].name);
    assert.equal(queries1[i].value, queries2[i].value);
  }
}

function assertUrls(url1, url2) {
  if (url1 === url2) {
    assert.equal(true, true);
    return;
  }

  var parts1 = url1.split('?');
  var parts2 = url2.split('?');

  assert.equal(parts1[0], parts2[0]);
  assertQueries(parts1[1], parts2[1]);
}
