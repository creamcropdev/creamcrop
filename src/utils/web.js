const http = require('http');

/**
 * Serve website
 * 
 * @param {Object} feed - RSS Feed Object
*/
function serve(feed) {
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