/**
 * TMDB provider ID -> platformun kendi arama sayfası.
 * TMDB'nin döndürdüğü `link` her platform için aynı TMDB sayfasına gider;
 * kullanıcı doğrudan platformda açılsın istiyor.
 */
type LinkBuilder = (query: string) => string

const PROVIDER_LINKS: Record<number, LinkBuilder> = {
  8: (q) => `https://www.netflix.com/search?q=${q}`,                          // Netflix
  1796: (q) => `https://www.netflix.com/search?q=${q}`,                       // Netflix (reklamlı)
  119: (q) => `https://www.primevideo.com/search/?phrase=${q}`,               // Amazon Prime Video
  9: (q) => `https://www.primevideo.com/search/?phrase=${q}`,                 // Amazon Prime Video (alt)
  337: (q) => `https://www.disneyplus.com/tr-tr/search?q=${q}`,               // Disney+
  1899: (q) => `https://www.hbomax.com/search?q=${q}`,                        // HBO Max
  350: (q) => `https://tv.apple.com/tr/search?term=${q}`,                     // Apple TV+
  2: (q) => `https://tv.apple.com/tr/search?term=${q}`,                       // Apple TV Store
  3: (q) => `https://play.google.com/store/search?q=${q}&c=movies`,           // Google Play Movies
  1904: (q) => `https://www.tvplus.com.tr/arama?query=${q}`,                  // Turkcell TV+
  341: (q) => `https://www.blutv.com/arama?q=${q}`,                           // BluTV
  342: (q) => `https://puhutv.com/arama?q=${q}`,                              // puhutv
  11: (q) => `https://mubi.com/tr/search/films?query=${q}`,                   // MUBI
  283: (q) => `https://www.crunchyroll.com/search?q=${q}`,                    // Crunchyroll
  531: (q) => `https://www.paramountplus.com/search/?q=${q}`,                 // Paramount+
}

/** İsimden eşleştirme — ID listede yoksa son çare olarak denenir. */
const NAME_PATTERNS: Array<[RegExp, LinkBuilder]> = [
  [/netflix/i, (q) => `https://www.netflix.com/search?q=${q}`],
  [/prime video|amazon/i, (q) => `https://www.primevideo.com/search/?phrase=${q}`],
  [/disney/i, (q) => `https://www.disneyplus.com/tr-tr/search?q=${q}`],
  [/hbo/i, (q) => `https://www.hbomax.com/search?q=${q}`],
  [/apple/i, (q) => `https://tv.apple.com/tr/search?term=${q}`],
  [/google play/i, (q) => `https://play.google.com/store/search?q=${q}&c=movies`],
  [/tv\+|turkcell/i, (q) => `https://www.tvplus.com.tr/arama?query=${q}`],
  [/blutv/i, (q) => `https://www.blutv.com/arama?q=${q}`],
  [/puhu/i, (q) => `https://puhutv.com/arama?q=${q}`],
  [/mubi/i, (q) => `https://mubi.com/tr/search/films?query=${q}`],
]

/**
 * Platformun kendi sayfasına giden link üretir.
 * Tanınmayan platformlarda TMDB'nin "where to watch" sayfasına düşer.
 */
export function buildProviderLink(
  providerId: number,
  providerName: string,
  movieTitle: string,
  fallback: string | null,
): string {
  const query = encodeURIComponent(movieTitle)

  const byId = PROVIDER_LINKS[providerId]
  if (byId) return byId(query)

  const byName = NAME_PATTERNS.find(([pattern]) => pattern.test(providerName))
  if (byName) return byName[1](query)

  return fallback || `https://www.google.com/search?q=${query}+izle+${encodeURIComponent(providerName)}`
}

/** TMDB bazı platformların adını kısaltıyor ("TV+" gibi) — okunur hale getir. */
const DISPLAY_NAMES: Record<number, string> = {
  1904: 'Turkcell TV+',
  2: 'Apple TV',
  350: 'Apple TV+',
  3: 'Google Play',
  119: 'Prime Video',
  9: 'Prime Video',
  1796: 'Netflix',
  1899: 'HBO Max',
}

export function providerDisplayName(providerId: number, providerName: string): string {
  return DISPLAY_NAMES[providerId] || providerName
}
