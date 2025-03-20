/**
 * Utility functions for generating structured data (JSON-LD) for different page types
 * to improve search engine understanding and rich snippet display.
 */

/**
 * Generate structured data for a farmers market
 */
export const generateMarketStructuredData = (market: {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description?: string;
  openingHours?: string[];
  telephone?: string;
  website?: string;
  image?: string;
  products?: string[];
  latitude?: number;
  longitude?: number;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://planetwiseliving.com/market/${market.id}`,
    "name": market.name,
    "description": market.description || `${market.name} is a farmers market located in ${market.city}, ${market.state}.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": market.address,
      "addressLocality": market.city,
      "addressRegion": market.state,
      "postalCode": market.zipCode,
      "addressCountry": "US"
    },
    ...(market.latitude && market.longitude ? {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": market.latitude,
        "longitude": market.longitude
      }
    } : {}),
    ...(market.telephone ? { "telephone": market.telephone } : {}),
    ...(market.website ? { "url": market.website } : {}),
    ...(market.image ? { 
      "image": [market.image]
    } : {}),
    "openingHoursSpecification": market.openingHours?.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hours.split(":")[0].trim(),
      "opens": hours.includes("Closed") ? "" : hours.split(":")[1].trim().split("-")[0].trim(),
      "closes": hours.includes("Closed") ? "" : hours.split(":")[1].trim().split("-")[1].trim()
    })) || [],
    ...(market.products && market.products.length > 0 ? {
      "makesOffer": market.products.map(product => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": product
        }
      }))
    } : {}),
    "publicAccess": true,
    "isAccessibleForFree": true
  };
};

/**
 * Generate structured data for the homepage
 */
export const generateHomePageStructuredData = (featuredMarkets: any[] = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://planetwiseliving.com/",
    "name": "PlanetWiseLiving - Find Farmers Markets Near You",
    "description": "Discover local farmers markets across the United States. Find fresh produce, artisanal goods, and support local agriculture in your community.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://planetwiseliving.com/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};

/**
 * Generate structured data for state pages
 */
export const generateStatePageStructuredData = (state: string, markets: any[] = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Farmers Markets in ${state}`,
    "description": `Find local farmers markets in ${state}. Browse our directory of markets offering fresh produce, artisanal goods, and more.`,
    "url": `https://planetwiseliving.com/state/${state.toLowerCase().replace(/\s+/g, '-')}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": markets.map((market, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": market.name,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": market.city,
            "addressRegion": state
          },
          "url": `https://planetwiseliving.com/market/${market.id}`
        }
      }))
    }
  };
};

/**
 * Generate structured data for blog pages
 */
export const generateBlogStructuredData = (blog: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.description,
    "datePublished": blog.datePublished,
    "dateModified": blog.dateModified || blog.datePublished,
    "author": {
      "@type": "Person",
      "name": blog.author || "PlanetWiseLiving Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PlanetWiseLiving",
      "logo": {
        "@type": "ImageObject",
        "url": "https://planetwiseliving.com/logo.png"
      }
    },
    "image": blog.image || "https://planetwiseliving.com/default-blog-image.jpg",
    "url": blog.url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": blog.url
    }
  };
}; 