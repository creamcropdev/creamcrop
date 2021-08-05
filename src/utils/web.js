const http = require('http');
const fs = require('fs');
const rss = require('./rss');

/**
 * Serve website
 * 
 * @param {Object} dir - Config file directory
*/
async function serve(dir) {
  if (fs.existsSync(dir+'/.creamcroprc') || fs.existsSync(dir+'.creamcroprc.json')) {
    console.log('Found config file, generating website...')
  }
  else {
    console.log('Directory not found or No Config File: ' + dir);
    process.exit(1);
  }
  let feed = {
    items: []
  };
  
  let config = JSON.parse(fs.readFileSync(dir+'/.creamcroprc'));
  for (var x in config.feeds) {
    let data = await rss.parse(config.feeds[x]);
    for (var fitem in data.items) {
      feed.items.push({
        title: data.items[fitem].title,
        link: data.items[fitem].link,
      });
    }
  }

  const requestListener = function (req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Creamcrop | A cream-of-the-crop, top-of-the-top, slice-and-chop, absolutely minimalist news getter</title>
        </head>
        <body>
          <h1>Your News Feed</h1>
          <sub>Your news feed from creamcrop, the cream-of-the-crop, top-of-the-top, slice-and-chop, absolutely minimalist news getter.</sub>
          <ul>
            ${feed.items.map(item => `
              <li>
                <a href="${item.link}">${item.title}</a>
              </li>
            `).join('\n')}
          </ul>
        </body>
      </html>
    `;
    res.end(html);
  }
  
  const server = http.createServer(requestListener);
  server.listen(8080);
  console.log('Server running at http://localhost:8080')
}

exports.serve = serve