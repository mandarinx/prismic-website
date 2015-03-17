# prismic-website

A super simple Node.js/Express based web server specifically tailored for using [Prismic.io](http://prismic.io/) for content management. Suitable for small websites, like portfolio sites and personal blogs. Can easily be extended to handle more advanced functionality.

# What does it handle?

## Routing
Setup routes using a json file. Prismic-website uses Express for [route handling](http://expressjs.com/4x/api.html#router) so you define them just like you would in any other Express app.

```
var web    = require('prismic-website');
var config = {
    "routes": {
        "home":       "/",
        "about":      "/about"
    }
};

web.on('ready', function(app) {
    app.events.on('home', function(req, res, next) {
    	...
    });
});

web.init(config, {
    base: __dirname
});

```
The config object has been truncated.

A route defined like ```"home" : "/"``` means that any request for ```"/"``` dispatches an event called ```"home"```.

## Web server
[Express](http://expressjs.com/) is used for the web server. [Handlebars](http://handlebarsjs.com) is used for templating, [Helmet](https://github.com/helmetjs/helmet) for basic security settings, [Cookie Parser](https://github.com/expressjs/cookie-parser) for handling cookies, [Serve Favicon](https://github.com/expressjs/serve-favicon) for favicons and [Compression](https://github.com/expressjs/compression) for serving compressed assets.

When you call ```init()``` the web server will setup the server, initialize all required modules and dispatch a ready event when done.

As of version 0.0.2 there's no easy way of customizing the server setup besides cloning the repo and creating your own server.

## Templating
Just like in any other Express app you can compose your templates using layouts and partials. Pass the directory references to where you put your templates via the config object.

```
var web    = require('prismic-website');
var config = {
    "dir": {
        "public":       "/public",
        "layout":       "/app/views/layouts",
        "partials":     "/app/views/partials",
        "views":        "/app/views"
    }
};

web.init(config, {
    base: __dirname
});
```
The base option passed to init() tells prismic-website which directory is to be used as root for the template directories.

## Prismic authentication and querying
Using [Prismic's javascript kit](https://github.com/prismicio/javascript-kit) to handle authentication and querying. Parts of the javascript kit have been wrapped in functions to be able to work with content on a higher level.

Authentication is completely handled by prismic-website. You put your credentials in the ```.env``` file, like this:

```
API_ENDPOINT=https://projectname.cdn.prismic.io/api
ACCESS_TOKEN=ABC123
CLIENT_ID=123ABC
CLIENT_SECRET=123HUSH
```

Querying is a bit simplified. Instead of getting all documents of type product like this:

```
Prismic.Api('https://lesbonneschoses.prismic.io/api', function (err, Api) {
    Api.form('everything')
        .ref(Api.master())
        .query(Prismic.Predicates.at("document.type", "product"))
        .submit(function (err, response) {
            if (err) {
                console.log(err);
                done();
            }
            var results = response.results;
        });
});
```

You can do like this:

```
app.events.on('home', function(req, res, next) {

	var options = { type: 'product' };

	app.query(res.locals.ctx, options)
		.then(function(products) {

			products.results.forEach(function(product) {
				console.log('Product name:' + product.getText('product.name'));
			});

		});
});
```

The options object can contain properties for sorting, limiting search results and search by type or id. You won't be missing out on anything.

```
var options = {
	type: 'product',
	id:   '123',
	sort: '[my.product.published desc]',
	limit: 25
};
```

# Requirements

- A Node.js server
- An account at Prismic.io

# Usage examples

## Setting up a server

Assuming you are familiar with developing Node.js applications and have used platforms like Heroku before, this should be a walk in the park for you.

Get yourself an account at [Prismic.io](http://prismic.io/) before installing prismic-website, as it won't work without.

Install prismic-website.

```
npm install prismic-website
```

Create a config.json file and fill it with configuration. The config shown here includes all the options prismic-website accepts.

```
{
    "construction":     false,
    "cache": {
        "static_files": 2592000
    },
    "url": {
        "base":         "http://www.mydomain.com"
    },
    "dir": {
        "public":       "/public",
        "layout":       "/templates/layouts",
        "partials":     "/templates/partials",
        "views":        "/templates"
    },
    "routes": {
        "home":         "/",
        "drawings":     "/drawings",
        "drawing":      "/drawing/:slug/:id",
        "about":        "/about",
        "contact":      "/contact"
    }
}
```

Create an .env file and add your Prismic.io credentials.

```
PORT=5000
NODE_ENV=development
VERBOSE=true
COOKIE_SECRET=supersecretcookie
API_ENDPOINT=https://mycontent.cdn.prismic.io/api
ACCESS_TOKEN=JIBBERISH
CLIENT_ID=VERYUNIQUE
CLIENT_SECRET=DONOTREADTHIS
```

If you're deploying to Heroku, you're probably already using [Foreman](https://www.npmjs.com/package/foreman) to run your app locally. If you aren't, you can use modules like [node-env-file](https://www.npmjs.com/package/node-env-file) and [dotenv](https://github.com/motdotla/dotenv) to load the .env file into memory. Prismic-website expects to find the config shown above in Node's environment variables.

Next up, create a main.js file using the following code:

```
var config  = require('./config.json');
var website = require('prismic-website');

website.on('ready', function(app) {
});

website.init(config, {
    base: __dirname
});

```
And that's it! The server should be running.

In the ready event handler you will be passed a reference to the application instance. From this variable you can access certain modules.

- __Events__. Listen for route events on ```app.events```.
- __Query__. Query Prismic's API via ```app.query```.
- __Linkresolver__. Resolve links to other documents, mailto and external sites via ```app.linkresolver```.
- __Bookmarks__. Get access to bookmarked content via ```app.bookmarks```.
- __Templates__. Pass content to the template renderer via ```app.templates```.
- __Utils__. Get access to utility methods, like iterators for Prismic groups, via ```app.utils```.

## Routing

As you can see of the setup example above, you will get access to the app instance on the ready event. The app contains a property for events, which you can use to listen to all events. As of version 0.0.2, the only events dispatched on the events object are route events.

Say you passed a route config like in the setup example.

```
{
    "routes": {
        "home":         "/",
        "drawings":     "/drawings",
        "drawing":      "/drawing/:slug/:id",
        "about":        "/about",
        "contact":      "/contact"
    }
}
```

With this setup you will have to listen for 'home', 'drawings', 'drawing', 'about' and 'contact' events, like this:

```
website.on('ready', function(app) {
	app.events.on('home', function(req, res, next) {
		...
   });
});

```

Whenever a request is successfully parsed and validated, prismic-website will dispatch an event. At the point of event handling, you have access to the request and results object, just like in any other Express app.

## Working with content

As shown in the introduction, you can use the query object to query Prismic for content. The query object is accessible via the instance variable. In a route handler, you can get content like this:

```
app.events.on('drawings', function(req, res, next) {

	app.query(res.locals.ctx, { type: 'drawings' })
		.then(function(drawings) {

			res.content.drawings = [];

			drawings.results.forEach(function(drawing) {
				res.content.drawings.push({
					name: drawing.getText('drawing.name')
				});
			});

		});
});
```

Each query returns a promise using the [promise](https://www.npmjs.com/package/promise) module.

When you have the content, you can work with the content by using the Prismic javascript kit documented at [Prismic's documentation](https://developers.prismic.io/documentation/VBgeDDYAADMAz2Rw/developers-manual). In this example we're getting a text node with the name 'drawing.name'.

Notice that we are adding content to ```res.content```. Prismic-website adds a page object to all res.content that looks like this:

```
page: {
	name: 'pagename',
	url:  config.url('base') + config.routes[page_name]
}
```

With this you can easily get access to the page's name and url in the template. Useful for toggling content based on what page you're looking at.

In this case, the page url will be ```http://www.mydomain.com/drawings```. ```config.url('base')``` is the base property of the url object in config.json that we passed to prismic-website in the setup.

Page_name is used to get the route for the current page. This won't be a problem for routes like '/home' but for routes like '/drawing/:slug/:id', the url will be 'http://www.mydomain.com/drawing/:slug/:id', which obviously won't work.

As of version 0.0.2, you have to run the page.url through a link resolver in order to fill it with the correct parameters.

## Render templates

Now that we have a few drawing names in ```res.content``` we can pass it to the renderer along with parameters for what template and layout we want to use.

The renderer is accessible via ```app.templates.render``` and you use it like this:

```
app.templates.render(res, 'layout', 'template');
```

## Using the link resolver

The link resolver is accessible via ```app.linkresolver``` and has of version 0.0.2 the following methods:

- __link(url)__. Wrap a URL in a plain ```<a href>```.
- __email(email)__. Wrap an email address in ```<a href="mailto:">```
- __document(route_name, document)__. Used for resolving links between documents using the routes provided in config.json.

The document link resolver works by passing a route name and a document which you want to use for creating the link. To continue with the same setups as we have been using in the previous examples, lets resolve a link to a drawing.

After querying Prismic, we get an object containing the contents for a drawing. We pass this object to ```app.linkresolver.document``` together with the route we want to use.

```
app.linkresolver.document('drawing', drawing);
```

The link resolver will get the route definition from config,

```
{
	"drawing": "/drawing/:slug/:id"
}
```

and try to fill the missing parts with content from the drawing content object.

When it comes to ':slug', it sees a required parameter and tries to look up 'slug' on the drawing object. Then it moves on to do the same with id.

If the drawing content object is missing e.g. the slug, you'll get a link that looks like:

```
http://www.mydomain.com/drawing/PARAM_ERROR/1234/
```

You should construct your routes based on the information you can get from Prismic and name the route parameters accordingly.

## Get the bookmarks

Getting the bookmarks is easy. Do like this in a route handler:

```
app.events.on('home', function(req, res, next) {

	app.bookmarks.get(res.locals.ctx)
		.then(function(bookmarks) {
			Object.keys(bookmarks).forEach(function(document_name) {
				// Document name: document_name
				// Document object: bookmarks[document_name]
			});
		});

});
```

As of version 0.0.2 you can not pass any options to the bookmarks helper to select document fields, limit the results by number or type. The bookmarks helper will get all bookmarked documents and all of their contents.

## Working with Prismic's groups

In Prismic you can sort content using groups, and there's a helper to aid you work with groups accessible via ```app.utils.iterateGroup```. You give it some options and a callback to be called for each item in the group.

Use it like this:

```
var tools = app.utils.iterateGroup({
	document:   drawing,
	path:       'drawing.tools'
}, function(tool, i) {

	return {
		type: tool.getText('type'),
		num:  i
	};

});
```

In this case we're passing the drawing content object we got from the query in the __Working with content__ example and iterating the group called 'tools'. The path to the group is what you set in the document mask definition in Prismic. The group iterator will call the callback with each tool object as the first parameter. We can use standard Prismic content methods on this object to get the content we need.

By returning an object in the callback, we add it to tools array defined on line 1. Now we can pass the tools array to the templates.

## Under construction page

It might be a bit 1990's to have support for an under construction page, but it's there anyway. At least is doesn't come with a default template with grey background and animated GIFs.

When you set ```construction: true``` in config.json prismic-website will use an Express middleware to intercept all requests and dispatch a 'construction' event. You have to add an event listener for it and pass whatever content to the template renderer.

Behind the scenes, prismic-website will plant a cookie in your browser which you can use to bypass the construction page. With this you can lock down the website on the live server, edit the content and simply bypass the contruction page to check out what the website will look like.

Bypass works by adding ```/?bypass=true``` to the URL. The cookie lasts for 3 hours, and then you have to do the bypass trick again.

# Developing

Tests are written with [Mocha](http://mochajs.org/).

Do you want to contribute? Pull requests are happily accepted.

# TODO

- Add Heroku install badge for easy setup.
- Run page.url through the link resolver before dispatching the route event.
- Add file watching on all source files including test files. Run Mocha tests on each update.

# License

The MIT License (MIT)

Copyright (c) 2015 Thomas Viktil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
