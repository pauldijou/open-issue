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
  require('../lib/node.js')
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

throw new Error('Just crash');
