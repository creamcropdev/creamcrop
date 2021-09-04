## Basics

Creamcrop allows users to sort results via a custom JS script, for example:

```javascript
/** sort.js */

function sortitems (a, b) {
    return new Date(b.pubdate) - new Date(a.pubdate); // Sorts by publication date
}

module.exports = sortitems
```

The example above is the default sorting script, which sorts by date, however, this can be extended.


## Requirements

All sorting scripts must be stated in the `.creamcroprc` file:

```JSON
{
    "feeds": [
        "feed1__url",
        "feed2_url",
        "feed3_url",
        ...
    ],
    "sort": "sort.js"
}
```
Additionally, all sorting scripts should be directly executable, like below:
```javascript
const sorter = require('sort.js')

sorter(item, item)
```
With that, go create your own custom sorting scripts and share them with the world!
