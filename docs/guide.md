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
  (creamcrop|cream) serve [dir]  Serves website from config file in [dir].
  (creamcrop|cream) about        Displays package info and exits.

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```
!> The creamcrop CLI can be accessed through both `cream` and `creamcrop`, but we'll just use `cream` in the documentation.

### `fetch [url]`

The `fetch` command fetches a feed, check's if it's valid, and adds it to the config file.

?> The config file is a required file if using the [`serve` command](#serve-url). See more info at [config](./config.md)

Help:
```sh
$ cream --help fetch
(creamcrop|cream) fetch [url]

Fetch a feed.

Positionals:
  url  The url of the feed to fetch.                                    [string]

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```
Example:
```sh
$ cream fetch https://www.feedforall.com/sample.xml
Valid feed... adding to config
```

### `serve [dir]`

The `serve` command finds the config file in the given directory and serves a website using the configuration specified.
See [config](./config.md) for more info on the config file.

Help:
```sh
$ cream --help serve
(creamcrop|cream) serve [dir]

Serves website from config file in [dir].

Positionals:
  dir  The directory of the config file.                                [string]

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -p, --port      The port to run the server on.        [number] [default: 8080]
  -h, --host      The host to run the server on. [string] [default: "localhost"]
  -i, --interval  The interval to check for new posts. Defaults to 5 minutes.
                                                      [number] [default: 300000]
```
Example
```sh
$ cream serve ./
Found config file, generating website...
Server running at http://localhost:8080
```

### `about`

The about command will print metadata about the package:

```sh
$ cream about
creamcrop
A cream-of-the-crop, top-of-the-top, slice-and-chop, absolutely minimalist news getter.
Qlabs (@Quantalabs)
0.5.2
```

## Global Options

There are multiple options that can be passed into creamcrop.

### `--help`
The `--help` command allows you to get help for a particular command or package.

```sh
$ cream --help
Usage: (creamcrop|cream) <command> [options]

Commands:
  (creamcrop|cream) fetch [url]  Fetch a feed.
  (creamcrop|cream) serve [dir]  Serves website from config file in [dir].
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
0.5.2
```
