set -e

# Help
cream --help

# Version
cream --version

# Fetching
cream fetch https://medium.com/feed/swlh # Fetch latest posts from a Medium RSS feed
cream fetch https://reddit.com/.rss # Fetch latests posts from reddit
cream fetch creamcropdev/creamcrop/releases # Fetch latest releases in the creamcrop repo

# Serving
cream serve . & sleep 10 ; kill $!

# About
cream about

rm -rf ./.creamcroprc