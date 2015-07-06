# open-issue

Did you know that by opening the correct url, you can create a new issue on GitHub with already predefined content? Just [click here](https://github.com/pauldijou/open-issue/issues/new?title=Test&labels%5B%5D=bug&labels%5B%5D=duplicate&assignee=pauldijou&milestone=fake&body=**Please%2C%20do%20not%20actually%20create%20the%20issue!!**%20This%20is%20just%20a%20test.%0A%0A%60%60%60javascript%0Avar%20a%20%3D%201%20%2B%202%3B%0A%60%60%60%0A%0A%23%23%20Subtitle%0A%0AHope%20you%20like%20it.%20Cheers.) to see it in action (**please, do not actually create the issue**). This lib will provide you an API to create such url and eventually open it in the browser. The goal is to have your users easily create issues on your project.

## Install

```
npm install open-issue --save
```

## API

### Node (or Browserify)

```javascript
var issue = require('open-issue');
// Init an empty issue
var newOne = issue()
  // A Github issue
  .provider('github')
  // For a specify repository
  .repository('pauldijou/open-issue')
  // With a nice title
  .title('We just crashed everything')
  // And some labels
  .labels('bug', 'fatal')
  // For the next milestone?
  .milestone('fake')
  // Assign a poor developer
  .assign('pauldijou')
  // Append some text
  .append('This is a test.')
  // Or some code
  .appendCode('function () { return true; }', 'javascript')
  // More text
  .append('The end!');

// Generate the final url
newOne.url();

// Open a new tab in the browser
newOne.open();
```

### Browser

```html
<!DOCTYPE html>
<html>
<head></head>
<body>
  <div><input id="title" type="text" name="title" placeholder="Issue title"></div>
  <div><textarea id="body" name="body" rows="8" cols="40"></textarea></div>
  <div><button id="open" type="button" name="button">Open issue</button></div>

  <!-- For dev purpose only, install the file locally before going to production -->
  <script type="text/javascript" src="https://rawgit.com/pauldijou/open-issue/master/index.js"></script>
  <script type="text/javascript">
    document.getElementById('open').addEventListener('click', function () {
      OpenIssue()
        .provider('github')
        .repository('pauldijou/open-issue')
        .title(document.getElementById('title').value)
        .append(document.getElementById('body').value)
        .open();
    });
  </script>
</body>
</html>
```

[See it in action](https://jsbin.com/gebucoxere/edit?html,output) (you might need to click on "Run with JS")

### Shortcuts

```javascript
issue.github('pauldijou/open-issue');
// Same as
issue()
  .provider('github')
  .repository('pauldijou/open-issue')
```

### Configuration

By default, each `append` will be separated by `\n\n`. You can change that.

```javascript
var newOne = issue.github('pauldijou/open-issue').append('1').append('2').append('3');

console.log(newOne.url());
// https://github.com/pauldijou/open-issue/issues/new?body=1%0A%0A2%0A%0A3

issue.separator('\n');

console.log(newOne.url());
// https://github.com/pauldijou/open-issue/issues/new?body=1%0A2%0A3

issue.separator('');

console.log(newOne.url());
// https://github.com/pauldijou/open-issue/issues/new?body=123
```

## Real world use-case

### Node CLI

You can run all examples by doing `npm run examples`.

Help your users report an unexpected crash.

```javascript
// Extract stack and hide user paths
function parseError(error) {
  // If this file is at the root of your project
  var pathRegexp = new RegExp(__dirname, 'g');
  var display = '';
  if (error.code) { display += 'Error code: ' + error.code + '\n\n' };
  if (error.stack) { display += error.stack.replace(pathRegexp, ''); }
  if (!display) { display = error.toString(); }
  return display;
}

// Open the issue if user is ok
function openIssue(e) {
  require('open-issue')
    .github('pauldijou/open-issue')
    .title('Unexpected error')
    .labels('bug', 'fatal')
    .append('The following error occured:')
    .appendCode(parseError(e))
    .append('You can also add custom infos if necessary...')
    .open();
}

process.on('uncaughtException', function(e) {
  console.log('[ERROR] An unexpected error occured.\n');

  var readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Ask user if (s)he wants to open an issue
  readline.question('Would you like to open an issue to help fixing the problem? Y/n\n(this will open a new tab in your browser)\n', function(answer) {
    if (!answer || answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      openIssue(e);
      console.log('\nThanks a lot for your help!');
    }

    readline.close();
  });
});
```

## Test

```
npm test
```

## License

This software is licensed under the Apache 2 license, quoted below.

Copyright 2015 Paul Dijou ([http://pauldijou.fr](http://pauldijou.fr)).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
