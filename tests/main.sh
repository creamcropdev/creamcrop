set -e

# Help
cream --help

# Version
cream --version

# Fetching
cream fetch https://medium.com/feed/swlh
cream fetch https://reddit.com/.rss

# Serving
cream serve . & sleep 10 ; kill $!

# About
cream about

rm -rf ./.creamcroprc