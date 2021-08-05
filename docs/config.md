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
        "feed3_url"
    ]
}
```

Later on, more parameters will be added.

## Valid parameters

| Parameter | Description | Default |
| --------- | ----------- | ------- |
|  `feeds`  | Array of feeds to parse | No default. **Required**. |