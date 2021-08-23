> Configuration for the package

Configuration for the package is located at the `.creamcroprc` file, 
which is auto-generated, and contains easy ways to add custom HTML templates
and format's for the website when served.

## Configuration Syntax

There is a simple configuration syntax used in creamcrop.

```JSON
{
    "feeds": [
        "feed1__url",
        "feed2_url",
        "feed3_url",
        ...
    ],
    "custom": "./template.html",
    "read": [
        "feed2_url"
    ],
    "format": "%title% @ <a href=\"%link%\">%link%</a> - From <a href=\"%feedlink%\">%feed%</a>. Published at %pubdate%",
}
```

Currently, `feeds` is the only required parameter. `read` does not have to be manually updated, it's automatically updated when you click a link.

## Valid parameters

| Parameter | Description | Default | Values |
| --------- | ----------- | ------- | ------ |
|  `feeds`  | Array of feeds to parse | No default. **Required**. | An array of URLs to feeds |
| `format` | The format of the output. Each value should be surrounded by `%`. | `<a href="%link%">%title%</a> from <a href="%feedlink%">%feed%</a>` | `%feed%`- The name of the RSS feed the item is in. <br> `%feedlink%` - The RSS feed's link that the item is in. <br> `%title%` - The name of the RSS feed Item. <br> `%link%` Link to the item. <br> `%pubdate%` - The publication date. |
| `custom` | A custom HTML template. Inside the HTML, use `%feed%`, which will be replaced by the content of the feed. Use `%update%` in the HTML, which will be replaced by a script that auto-updates the RSS feed. Use `%search%` in the HTML to get the search bar to filter through results. |  A basic HTML page. | The relative path to the HTML template file |
| `read` | Array of URLs which have already been read. Whenever you click a URL on the webpage, it is automatically added here. | `[]` | An array of URLs as strings. |