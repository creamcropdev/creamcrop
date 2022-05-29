import * as http from "http";
import * as fs from "fs";
import * as rss from "./rss.js";
import * as metadata from "./metadata.js";
import * as url from "url";
import * as jsonparser from "@creamcropdev/json";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

/**
 * Serve website
 *
 * @param {Object} dir - Config file directory
 */
async function serve(dir, port, host, interval) {
  // Clear the console
  process.stdout.write("\x1Bc");

  if (
    fs.existsSync(dir + "/.creamcroprc") ||
    fs.existsSync(dir + ".creamcroprc")
  ) {
    console.log("Found config file, generating website...");
  } else {
    console.log("Directory not found or No Config File: " + dir);
    process.exit(1);
  }

  async function generate(dir, query = null) {
    let feed = {
      items: [],
    };

    let read = {
      items: [],
    };

    let config = JSON.parse(fs.readFileSync(dir + "/.creamcroprc"));

    // To prevent an error, add a empty "read" list to config if it doesn't exist
    if (!config.read) {
      config.read = [];
    }

    for (var x in config.feeds) {
      let data;

      if (Array.isArray(config.feeds[x])) {
        if (config.feeds[x][1] == "rss") {
          data = await rss.parse(config.feeds[x][0]);
        } else if (config.feeds[x][1] == "json") {
          data = await jsonparser.parse(config.feeds[x][0]);
        }
      } else if (config.feeds[x].endsWith(".rss")) {
        data = await rss.parse(config.feeds[x]);
      } else if (config.feeds[x].endsWith(".json")) {
        data = await jsonparser.parse(config.feeds[x]);
      } else {
        try {
          data = await jsonparser.parse(config.feeds[x]);
        } catch {
          data = await rss.parse(config.feeds[x]);
        }
      }

      for (var fitem in data.items) {
        // Check if the item matches the query, if query is not null. If the item does not match the query, skip the iteration
        if (query != null) {
          // If the item's title, description, link, feed, feedlink, or pubdate does not match the query, skip the iteration
          if (
            data.items[fitem].title
              .toLowerCase()
              .indexOf(query.toLowerCase()) == -1 &&
            data.items[fitem].link.toLowerCase().indexOf(query.toLowerCase()) ==
              -1 &&
            data.title.toLowerCase().indexOf(query.toLowerCase()) == -1 &&
            data.link.toLowerCase().indexOf(query.toLowerCase()) == -1 &&
            data.items[fitem].isoDate
              .toLowerCase()
              .indexOf(query.toLowerCase()) == -1
          ) {
            continue;
          }
        }
        
        // If data.items[fitem].link is in config.read list, then add it to read.items and skip the iteration
        if (config.read.indexOf(data.items[fitem].link) != -1) {
          read.items.push({
            title: data.items[fitem].title,
            link: data.items[fitem].link,
            feed: data.title,
            feedlink: data.link,
            pubdate: data.items[fitem].isoDate,
          });
          continue;
        }
        feed.items.push({
          title: data.items[fitem].title,
          link: data.items[fitem].link,
          feed: data.title,
          feedlink: data.link,
          pubdate: data.items[fitem].isoDate,
        });
      }
    }

    // Sort all the items in feed.items by date, or by function in config.sort, if it exists
    feed.items = feed.items.sort(function (a, b) {
      if (config.sort) {
        const sortFunc = require(config.sort);
        return sortFunc(a, b);
      } else {
        return new Date(b.pubdate) - new Date(a.pubdate);
      }
    });

    // Sort all the items in read.items by date, or by function in config.sort, if it exists
    read.items = read.items.sort(function (a, b) {
      if (config.sort) {
        const sortFunc = require(config.sort);
        return sortFunc(a, b);
      } else {
        return new Date(b.pubdate) - new Date(a.pubdate);
      }
    });
    console.log(read.items)

    function format(title, link, feedlink, feed, pubdate, add = "", end = "") {
      if (config.format !== undefined) {
        var format = `${add}${config.format}${end}`;
        format = format.replace(/%title%/g, title);
        format = format.replace(/%link%/g, link);
        format = format.replace(/%feed%/g, feed);
        format = format.replace(/%feedlink%/g, feedlink);
        format = format.replace(
          /%pubdate%/g,
          new Date(pubdate).toLocaleDateString()
        );
        return format;
      } else {
        return `${add}<a href="${link}">${title}</a> from <a href="${feedlink}">${feed}</a>${end}`;
      }
    }

    let html = "";

    function makeHTML() {
      console.log("\nParsing HTML...");

      let templates = ["basic", "modern"];
      let customconf = "";
      if (config.custom == undefined) {
        // Load up basic html template, located in creamcrop's src/utils/templates/basic.html
        customconf = fs.readFileSync(require.resolve('./templates/basic.html'), {
          encoding: "utf8",
          flag: "r",
        });
      } else if (templates.indexOf(config.custom) !== -1) {
        config.custom = require.resolve(
          "./templates/" + config.custom + ".html"
        );
      } else if (fs.existsSync(dir + config.custom)) {
        customconf = fs.readFileSync(dir + config.custom, {
          encoding: "utf8",
          flag: "r",
        });
      } else if (fs.existsSync(dir + "/" + config.custom)) {
        customconf = fs.readFileSync(dir + "/" + config.custom, {
          encoding: "utf8",
          flag: "r",
        });
      } else {
        console.log("Custom file not found: " + dir + config.custom);
        process.exit(1);
      }
      
      console.log("\nParsing RSS feed(s)...");
      customconf = customconf.replace(
        /%feed%/g,
        feed.items
          .map(
            (item) => `
          ${format(
            item.title,
            item.link,
            item.feedlink,
            item.feed,
            item.pubdate,
            `<div onClick="markRead(\'${item.link}\')">`,
            "</div>"
          )}
        `
          )
          .join("\n")
      );

      customconf = customconf.replace(
        /%read%/g,
        read.items
          .map(
            (item) => `
          ${format(
            item.title,
            item.link,
            item.feedlink,
            item.feed,
            item.pubdate,
            `<div>`,
            `</div>`
          )}
        `
          )
          .join("\n")
      );

      // if %sort% is found, replace it with all the items in feed.items and read.items, sorted by the function in config.sort, or by date, if it doesn't exist
      customconf = customconf.replace(/%sort%/g, function () {
        if (config.sort) {
          const sortFunc = require(config.sort);
          // Combine feed.items and read.items
          let items = feed.items.concat(read.items);
          // Sort the items
          items = items.sort(sortFunc);
          // Return the items in HTML format
          return items
            .map(
              (item) => `
              ${format(
                item.title,
                item.link,
                item.feedlink,
                item.feed,
                item.pubdate,
                `<div onClick="markRead(\'${item.link}\')">`,
                "</div>"
              )}
            `
            )
            .join("\n");
        } else {
          // Combine feed.items and read.items
          let items = feed.items.concat(read.items);
          // Sort the items
          items = items.sort(function (a, b) {
            return new Date(b.pubdate) - new Date(a.pubdate);
          });
          // Return the items in HTML format
          return items
            .map(
              (item) => `
              ${format(
                item.title,
                item.link,
                item.feedlink,
                item.feed,
                item.pubdate,
                `<div onClick="markRead(\'${item.link}\')">`,
                "</div>"
              )}
            `
            )
            .join("\n");
        }
      });

      // Replace %update% with automatic reloading script with interval in customconf
      customconf = customconf.replace(
        /%update%/g,
        `
          <script>
            setTimeout(function(){
              window.location.reload(1);
            }, ${Number(interval)});

            // Add function markRead to make API call to mark "item" as read at /markRead
            function markRead(item) {
              fetch('/markRead?id=' + item)
            }
          </script>
        `
      );

      // Replace %search% with search box with search in customconf
      customconf = customconf.replace(
        /%search%/g,
        `
          <form action="/search" method="get">
            <input type="text" name="q" placeholder="Search" />
            <input type="submit" value="Search" />
          </form>
        `
      );

      let keys = ["title", "link", "feedlink", "feed", "pubdate"];

      // Replace %feedelement-x% with element-x in customconf
      for (let i = 1; i <= feed.items; i++) {
        for (let key in keys) {
          customconf = customconf.replace(
            new RegExp(`%feedelement-${i}(${key})%`, "g"),
            feed.items[i][key]
          );
        }
      }
      
      // Replace %readelement-x% with element-x in customconf
      for (let i = 1; i <= read.items; i++) {
        for (let key in keys) {
          customconf = customconf.replace(
            new RegExp(`%readelement-${i}(${key})%`, "g"),
            read.items[i][key]
          );
        }
      }

      html = customconf;
      return html;
    }

    return makeHTML();
  }

  let html = await generate(dir);

  const requestListener = async function (req, res) {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    if (req.url === "/") {
      html = await generate(dir);
      res.end(html);
    }

    if (url.parse(req.url, true).pathname === "/markRead") {
      console.log("Recieved API Request, marking item as read...");
      let id = url.parse(req.url, true).query.id;

      // Append `id` to .creamcroprc's read section
      let read = JSON.parse(
        fs.readFileSync(dir + "/.creamcroprc", { encoding: "utf8", flag: "r" })
      );

      // Check if the read section exists in the .creamcroprc file
      if (read.read === undefined) {
        read.read = [];
      }

      // Append `id` to the read section
      read.read.push(id);
      fs.writeFileSync(dir + "/.creamcroprc", JSON.stringify(read, null, 2), {
        encoding: "utf8",
        flag: "w",
      });
      console.log("Marked item as read.");
    }

    if (url.parse(req.url, true).pathname === "/search") {
      console.log("Recieved API Request, searching...");

      // Get query from URL
      let query = url.parse(req.url, true).query.q;

      // Get items from RSS feed
      html = await generate(dir, query);
      res.end(html);
    }
  };

  const server = await http.createServer(requestListener);
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

export { serve };
