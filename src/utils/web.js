const http = require('http');
const fs = require('fs');
const rss = require('./rss');
const metadata = require('./metadata');

/**
 * Serve website
 * 
 * @param {Object} dir - Config file directory
*/
async function serve(dir, port, host, interval) {
  if (fs.existsSync(dir+'/.creamcroprc') || fs.existsSync(dir+'.creamcroprc')) {
    console.log('Found config file, generating website...')
  }
  else {
    console.log('Directory not found or No Config File: ' + dir);
    process.exit(1);
  }

  async function generate(dir) {
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
          feed: data.title,
          feedlink: data.link,
          pubdate: data.items[fitem].isoDate
        });
      }
    }

    // Sort all the items in feed.items by date
    feed.items = feed.items.sort(function(a, b) {
      return new Date(b.pubdate) - new Date(a.pubdate);
    });

    function format(title, link, feedlink, feed, pubdate, add="", end="") {
      if (config.format !== undefined) {
        var format = config.format
        format = format.replace(/%title%/g, title);
        format = format.replace(/%link%/g, link);
        format = format.replace(/%feed%/g, feed);
        format = format.replace(/%feedlink%/g, feedlink);
        format = format.replace(/%pubdate%/g, new Date(pubdate).toLocaleDateString());
        return format;
      }
      else {
        return `${add}<a href="${link}">${title}</a> from <a href="${feedlink}">${feed}</a>${end}`;
      }
    }

    let html = ''

    if (config.custom !== undefined) {
      console.log('\nParsing custom HTML...');

      let customconf = ''
      if (fs.existsSync(dir+config.custom)) {
        customconf = fs.readFileSync(dir+config.custom, {encoding:'utf8', flag:'r'});
      } 
      else if (fs.existsSync(dir+'/'+config.custom)) {
        customconf = fs.readFileSync(dir+'/'+config.custom, {encoding:'utf8', flag:'r'});
      } 
      else {
        console.log('Custom file not found: ' + dir+config.custom);
        process.exit(1);
      }

      console.log('\nParsing RSS feed(s)...');
      customconf = customconf.replace(/%feed%/g, feed.items.map(item => `
          ${format(item.title, item.link, item.feedlink, item.feed, item.pubdate)}
        `).join('\n'));

      html = customconf
    }

    else {
      console.log('\nParsing RSS feed(s)...\n');
      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Creamcrop | A cream-of-the-crop, top-of-the-top, slice-and-chop, absolutely minimalist news getter</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Georama&display=swap" rel="stylesheet">
            <meta charset="utf-8">
            <meta name="generator" content="Creamcrop ${metadata.version}" />
          </head>
          <body style="font-family: 'Georama', sans-serif; margin: 0; border: none; padding: 0; overflow-x: hidden;">
            <section id="main-content">
              <h1 style="width: 100vw; text-align: center;">Your News Feed</h1>
              <p style="margin: auto; text-align: center;">Your news feed from creamcrop, the cream-of-the-crop, top-of-the-top, slice-and-chop, absolutely minimalist news getter.</p>
              <br>
              <hr style="width: 50vw; margin: auto;">
              <br>
              <ol style="width: 100vw; text-align: center; list-style-position: inside;">
                ${feed.items.map(item => `
                    ${format(item.title, item.link, item.feedlink, item.feed, item.pubdate, '<li>', '</li>')}
                `).join('\n')}
              </ol style="width: 100vw; text-align: center;">
            </section>
            <br><br>
            <!-- Add footer -->
            <footer style="width: 100vw; text-align: center; bottom: 0; position: fixed; background-color: white;">
              <p>Creamcrop | A cream-of-the-crop, top-of-the-top, slice-and-chop, absolutely minimalist news getter</p>
            </footer>
            <script>
              setTimeout(function(){
                window.location.reload(1);
              }, ${Number(interval)});
            </script>
          </body>
        </html>
      `;
    }
    return html;
  }

  let html = await generate(dir);

  const requestListener = async function (req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(html);

    if (req.url === '/') {
      html = await generate(dir);
      res.end(html);
    }
  }
  
  const server = await http.createServer(requestListener);
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

exports.serve = serve