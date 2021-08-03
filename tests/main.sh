set -e

# Help
cream --help

# Version
cream --version

# Fetching
cream fetch https://medium.com/feed/swlh

# Serving
cream serve https://medium.com/feed/swlh & sleep 10 ; kill $!

# About
cream about
