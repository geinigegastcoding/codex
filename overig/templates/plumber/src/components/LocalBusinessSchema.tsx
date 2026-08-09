export default function LocalBusinessSchema() {
  const brandnaam = "{brandnaam}";
  const locatie = "{locatie}";
  const phone = "0800-1234567";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    "name": brandnaam,
    "image": "https://www.example.com/logo.png",
    "@id": "https://www.example.com",
    "url": "https://www.example.com",
    "telephone": phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "[Straat en huisnummer]",
      "addressLocality": locatie,
      "postalCode": "[Postcode]",
      "addressCountry": "NL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 52.3676,
      "longitude": 4.9041
    },
    "areaServed": [
      {
        "@type": "City",
        "name": locatie
      },
      {
        "@type": "City",
        "name": "{Plaats 1}"
      }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "€€",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "350"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
