# FILMHUB

A film discovery site on data from The Movie Database (TMDB): what is trending, what is coming, what is rated highest, with trailers that play on the page and a watchlist kept in the browser.

**Live:** https://filmhub-tr.netlify.app/

This is the second version of a course project that was called Cinemania. The first was plain JavaScript; I rewrote it in React and TypeScript and changed what a film's page is for. It no longer pretends to play the film. It shows the trailer, and then sends you to the service that actually carries it.

## What it does

- **A front page of shelves**: a hero carousel of trending films, then rows for popular, top rated and upcoming, each one scrolling sideways.
- **Trailers on the page.** A film's trailer opens in a dialog over the list. Escape closes it, and the page behind does not scroll while it is open.
- **Where to watch.** A film's page lists the services that carry it in Turkey, from TMDB's provider data. Each one links to that service's own search for the title (Netflix, Prime Video, Disney+, MUBI, BluTV and others) instead of back to TMDB.
- **Search** from the header, as you type, with results on their own page.
- **A library**: the films you saved and the ones you rated. It is kept in the browser's storage, so it needs no account and stays on the device.

## Stack

- React 19 and TypeScript, built with Vite
- React Router 7
- TanStack Query for fetching and caching, Axios underneath
- Zustand for the library and the interface state
- Tailwind CSS 4
- Framer Motion
- Oxlint

## Run it

Node 22, and a TMDB API key. A key is free: make an account at themoviedb.org and ask for one under Settings, API.

```bash
npm install
```

Put the key in a file called `.env` at the root:

```
VITE_TMDB_API_KEY=your_key_here
```

```bash
npm run dev        # the address Vite prints, usually http://localhost:5173
npm run build      # type-check, then the production build into dist/
npm run preview    # serve that build locally
npm run lint
```

| Variable | What it is for |
| --- | --- |
| `VITE_TMDB_API_KEY` | Every request to TMDB. It is read in the browser, so it is visible to anybody who opens the site: use a key that can do nothing but read. |

## Layout of the code

```
src/
  App.tsx                       routes: /, /watch/:id, /search, /library
  pages/                        Home, Watch, Search, Library
  components/
    features/hero/              HeroCarousel
    features/movies/            MovieCard, MovieCarousel, TrailerModal
    features/player/            VideoPlayer
    layout/                     Header, Footer
  services/tmdbService.ts       every call to TMDB, in one place
  stores/                       movieStore, uiStore, userStore (the library, kept in the browser)
  utils/watchProviders.ts       a TMDB provider id to that service's own search page
  types/                        the shapes TMDB returns
public/_redirects, netlify.toml send every path to index.html, so a deep link loads
```

## Deploying

The live site is on Netlify, built from this repository with `npm run build` and published from `dist`. `netlify.toml` sets the Node version and the single-page fallback.

`.github/workflows/deploy.yml` also builds the site and publishes it to the `gh-pages` branch on every push to `main`.

## Notes

- This product uses the TMDB API but is not endorsed or certified by TMDB. Posters, backdrops and film data are theirs.
- "Where to watch" depends on TMDB's provider data for Turkey, which comes from JustWatch, and it can be out of date.
- The interface is in Turkish.

## Author

[Canberk Yıldız](https://canberkyildiz.netlify.app)
