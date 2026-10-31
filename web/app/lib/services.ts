export type Service = {
  id: string;
  title: string;
  icon: string; // Font Awesome icon name
  short: string;
  long: string;
  goodFor: string;
  from: string; // e.g. "$350". Empty = the website says "Request a quote"
  duration: string; // e.g. "2 to 3 hours". Empty = hidden
  includes: string[]; // what is included. Empty = hidden
  image: string; // full web address of a photo for this service. Empty = no photo
};

export const services: Service[] = [
  { id: "wedding-photography", title: "Wedding Photography", icon: "fa-ring", short: "Ceremony, portraits and reception coverage.", long: "Full-day or half-day coverage of your ceremony, portraits and reception, from getting ready to the last dance.", goodFor: "Weddings, engagements, bridal portraits", from: "", duration: "", includes: [], image: "" },
  { id: "portrait-sessions", title: "Portrait Sessions", icon: "fa-camera", short: "Individual, couple and graduation portraits.", long: "Relaxed individual, couple or graduation portraits, in the studio or on location, with guidance on posing and styling.", goodFor: "Personal branding, graduations, couples, milestones", from: "", duration: "", includes: [], image: "" },
  { id: "family-maternity", title: "Family & Maternity", icon: "fa-people-roof", short: "Family, newborn and maternity sessions.", long: "Family, newborn and maternity sessions designed to be comfortable for every age, with gentle direction and no rush.", goodFor: "Families, newborns, expecting parents", from: "", duration: "", includes: [], image: "" },
  { id: "fashion-editorial", title: "Fashion & Editorial", icon: "fa-shirt", short: "Lookbooks, model portfolios and magazine shoots.", long: "Lookbooks, model portfolios and magazine-style shoots with studio lighting, styling support and a clear creative brief.", goodFor: "Models, designers, boutiques, magazines", from: "", duration: "", includes: [], image: "" },
  { id: "commercial-product", title: "Commercial & Product", icon: "fa-box-open", short: "Product, food and brand imagery.", long: "Clean, consistent product, food and brand imagery for websites, catalogues, packaging and social media.", goodFor: "Shops, restaurants, brands, online sellers", from: "", duration: "", includes: [], image: "" },
  { id: "corporate-headshots", title: "Corporate Headshots", icon: "fa-briefcase", short: "Professional headshots and team photos.", long: "Professional headshots and team photos for LinkedIn, company websites and press, shot quickly with consistent lighting.", goodFor: "Professionals, teams, company websites", from: "", duration: "", includes: [], image: "" },
  { id: "event-coverage", title: "Event Coverage", icon: "fa-champagne-glasses", short: "Birthdays, launches, conferences and community events.", long: "Birthdays, launches, conferences and community events, captured candidly and delivered promptly.", goodFor: "Parties, corporate events, NGOs, community gatherings", from: "", duration: "", includes: [], image: "" },
  { id: "travel-landscape", title: "Travel & Landscape", icon: "fa-mountain-sun", short: "Destination, scenic and lifestyle photography.", long: "Destination, scenic and lifestyle photography for tourism businesses, lodges and personal trips, with prints available.", goodFor: "Tourism, hospitality, travellers, art buyers", from: "", duration: "", includes: [], image: "" },
  { id: "editing-retouching", title: "Editing & Retouching", icon: "fa-wand-magic-sparkles", short: "Colour correction, retouching and restoration.", long: "Colour correction, skin retouching, background clean-up and restoration of your own photos.", goodFor: "Existing photos, old prints, product images", from: "", duration: "", includes: [], image: "" },
  { id: "prints-albums", title: "Prints & Albums", icon: "fa-print", short: "Fine-art prints, framed pieces and custom albums.", long: "Fine-art prints, framed pieces and custom albums, produced to last.", goodFor: "Gifts, home and office walls, wedding albums", from: "", duration: "", includes: [], image: "" },
];