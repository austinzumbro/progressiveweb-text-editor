# Progressive Web Application: Text Editor

## Description

This week I'm exploring the process of building a Progressive Web Application. Specifically, I'm looking at topics of webpack, service workers and caching, and offline functionality. A simple text editor checks those boxes, so we'll go with that!

| **Scenario**                                                                                                                      |
| :-------------------------------------------------------------------------------------------------------------------------------- |
| _I want a basic text editor that I can use online or install locally. I would like the things I type to persist across sessions._ |

---

## Usage

[Check out the deployed application here.](https://young-shore-20097.herokuapp.com/) Type something. Click the install button. Have fun.

---

## My Approach

The novel and interesting things in this project (at least, novel _to me_) are all generally related to webpack, service workers, and IndexedDB.

## Webpack

Feel free to check out the `webpack.config.js` if you're interested in the details. It took a while to research all the options, but once I got it set up it's all pretty standard stuff.

Working with `webpack-pwa-manifest` was probably the most interesting piece, in that I've never worked with a manifest before. The icon generation process was nifty; it takes in one image and spits out whatever sizes you might need.

```javascript
icons: [
    {
    src: path.resolve("src/images/logo.png"),
    sizes: [96, 128, 192, 256, 384, 512],
    destination: path.join("assets", "icons"),
    },
    {
    src: path.resolve("favicon.ico"),
    size: [16],
    destination: path.join("assets", "icons"),
    },
```

---

## Service Workers

I handled this with Google's [Workbox](https://developer.chrome.com/docs/workbox/), which, I will freely admit, was the least intuitive piece of this whole endeavor, but I got there eventually. I played around with the `GenerateSW` method, but settled on `InjectManifest` to play around with more settings.

The service worker handles a page cache and an assets cache.

Here are the asset cache settings:

```javascript
registerRoute(
  // filtering which requests we'll cache, in this case its JS and CSS files
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  // I went with the StaleWhileRevalidate strategy. See note below.
  new StaleWhileRevalidate({
    // Name of the cache storage.
    cacheName: "asset-cache",
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
```

> I opted for the StaleWhileRevalidate strategy to, in the words of [this nice little web.dev article](https://web.dev/stale-while-revalidate/), strike a "balance between immediacy ... and freshness."
>
> This app is so small that I don't think there's much concern about either immediacy or freshness, but it sounds nice nonetheless.

---

## IndexedDB

This was fun to play with and simple to implement with `idb` module. Here's an example of the put method:

```javascript
export const putDb = async (content) => {
  console.log("PUT to the database");
  const jateDb = await openDB("jate", 1);
  const tx = jateDb.transaction("jate", "readwrite");
  const store = tx.objectStore("jate");
  const request = store.put({ value: content });
  const result = await request;
  console.log("🚀 - data saved to the database", result);
};
```

---

## Learnings / Reflections

I can't say this project was all that... fun? The concepts were interesting and, honestly, easier to grock than I'd expected. But the actual implementation of everything was a lot more fiddly than I'd assumed it would be going in. I definitely see the appeal of frameworks that handle this for you.

Speaking of which, my interest in something like React or Angular has definitely been piqued, so I think I'll be getting into that next.
