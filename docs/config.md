> Configuration for the package

Configuration for the package is located at the `.creamcroprc` file, 
which is auto-generated, and currently only contains the feeds to use
when generating the webiste. However, there are plans to extend this 
to allow for more configuration in the package, including custom formats,
website templates, and more.


## Configuration Syntax

There is a simple configuration syntax used in creamcrop.

```JSON
{
    "feeds": [
        "feed1__url",
        "feed2_url",
        "feed3_url",
        ...
    ]
}
```

Currently, `feeds` is the only required parameter.

## Valid parameters

| Parameter | Description | Default | Values |
| --------- | ----------- | ------- | ------ |
|  `feeds`  | Array of feeds to parse | No default. **Required**. | An array of URLs to feeds |
| `format` | The format of the output. Each value should be surrounded by `%`. | `<a href="%link%">%item%</a> from <a href="%feedlink%">%feed%</a>` | `%feed%`- The name of the RSS feed the item is in. <br> `%feedlink%` - The RSS feed's link that the item is in. <br> `%item%` - The name of the RSS feed Item. <br> `%itemlink%` Link to the item. |
| `custom` | A custom HTML template. Inside the HTML, use `%feed%`, which will be replaced by the content of the feed. |  A basic HTML page. | The relative path to the HTML template file |