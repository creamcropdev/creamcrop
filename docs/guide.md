> Learn the fundamentals of creamcrop

## Installation

You can install the package through the npm registry:
<!-- tabs:start -->

#### **`npm`**
```sh
npm install -g creamcrop
```

#### **`yarn`**
```sh   
yarn global add creamcrop
```

#### **`pnpm`**
```sh
pnpm add -g creamcrop
```
<!-- tabs:end -->
Installation is also avaliable through git:
```sh
git clone https://github.com/creamcropdev/creamcrop.git # or "gh repo clone creamcropdev/creamcrop"
cd creamcrop
npm install -g . # or, "npm link"
```

## Commands

Creamcrop allows you to view the latest news and updates from specified RSS feeds.
```sh
$ cream --help
Usage: (creamcrop|cream) <command> [options]

Commands:
  (creamcrop|cream) fetch [url]  Fetch a feed.
  (creamcrop|cream) serve [url]  Serves website from RSS feed
  (creamcrop|cream) about        Displays package info and exits.

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```
!> The creamcrop CLI can be accessed through both `cream` and `creamcrop`, but we'll just use `cream` in the documentation.

### `fetch [url]`

The `fetch` command fetches a feed and prints a JSON output of the feed. This is useful if you'd like to verify that a feed exists.

```sh
$ cream fetch https://www.feedforall.com/sample.xml
{
  items: [
    {
      title: 'RSS Solutions for Restaurants',
      link: 'http://www.feedforall.com/restaurant.htm',
      pubDate: 'Tue, 19 Oct 2004 11:09:11 -0400',
      comments: 'http://www.feedforall.com/forum',
# and so on...
```

### `serve [url]`

The `serve` command fetches the URL and gives a HTML display.

```sh
$ cream serve https://www.feedforall.com/sample.xml
Server running at http://localhost:8080
```

### `about`

The about command will print metadata about the package:

```sh
$ cream about
creamcrop
A cream-of-the-crop, top-of-the-top, slice-and-chop, absolutely minimalist news getter.
Qlabs (@Quantalabs)
0.1.0
```

## Options

There are multiple options that can be passed into creamcrop.

### `--help`
The `--help` command allows you to get help for a particular command or package.

```sh
$ cream --help
Usage: (creamcrop|cream) <command> [options]

Commands:
  (creamcrop|cream) fetch [url]  Fetch a feed.
  (creamcrop|cream) serve [url]  Serves website from RSS feed
  (creamcrop|cream) about        Displays package info and exits.

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]

$ cream --help fetch
(creamcrop|cream) fetch [url]

Fetch a feed.

Positionals:
  url  The url of the feed to fetch.                                    [string]

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```


### `--version`
The version command gives you the version info of the package.
```sh
$ cream --version
0.1.0
```
