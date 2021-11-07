# v0.10.0

**BREAKING CHANGES:**
- Converts package to ESM compeltely. This will not affect the CLI, simply usage in code, which doesn't have many features. 

# v0.9.0

Adds:
- Add custom sorting of items
    - Add `%sort%` for custom sorting in custom HTML

# v0.8.0

Adds:
    - `%read%` option for already read items in custom HTML

# v0.7.0

Adds:
    - JSON feed support, with new package dep: `@creamcropdev/json`

# v0.6.0

Adds:
    - Custom filtering and searching
   
# v0.5.2

Add support for custom formats with read/unread indicators.

# v0.5.1

Patch update which fixes a server bug.

# v0.5.0

Adds:
    - Read/Unread filtering.

# v0.4.0

Adds:
    - Improved Web Design
    - Auto-update RSS feeds
    - Custom port and host values for `cream serve`
    - Add RSS sorting by date, independent of feed
    - Add `%pubdate%` option for format options
    - Add `%update%` option for website templates which get's replaced with an auto-update script 

# v0.3.0

Adds:
    - Custom Output Format
    - Custom HTML templates

# v0.2.0

Adds:
    - Multiple RSS Feeds
    - Config Files

# v0.1.0

Initial Release, includes:

- RSS feed parsing
- Displays latest news in a website
