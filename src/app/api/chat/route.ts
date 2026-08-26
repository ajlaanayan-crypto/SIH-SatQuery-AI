import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const query = body.query?.toLowerCase() || '';

  await new Promise(resolve => setTimeout(resolve, 1500));

  type MockResponse = {
    keywords: string[];
    action: 'change_detection' | 'highlight' | 'text';
    language: 'en' | 'hi' | 'hinglish';
    message: string;
    geoJSON?: any;
  };

  // Helper geometries for diverse marking shapes
  const poly = (coords: number[][], color: string, name: string) => ({
    type: "Feature", properties: { color, name },
    geometry: { type: "Polygon", coordinates: [coords] }
  });
  
  const line = (coords: number[][], color: string, name: string) => ({
    type: "Feature", properties: { color, name },
    geometry: { type: "LineString", coordinates: coords }
  });

  const scatter = (coords: number[][], color: string, name: string) => ({
    type: "Feature", properties: { color, name },
    geometry: { type: "MultiPoint", coordinates: coords }
  });

  const mockDatabase: MockResponse[] = [
    // ---------------- DELHI ----------------
    {
      keywords: ["delhi", "yamuna", "floodplain", "encroachment", "khadar", "atikraman"],
      action: "highlight",
      language: "en",
      message: "Here is the Yamuna floodplain near Mayur Vihar. I have highlighted irregular patches where new concrete structures and illegal encroachment have appeared since 2015.",
      geoJSON: { type: "FeatureCollection", features: [
        poly([[77.29, 28.59], [77.30, 28.59], [77.31, 28.58], [77.29, 28.57], [77.29, 28.59]], '#FF4D4D', 'Encroachment'),
        scatter([[77.295, 28.585], [77.301, 28.581], [77.305, 28.588]], '#FFA500', 'New Structures')
      ]}
    },
    {
      keywords: ["delhi", "ground", "water", "borewell", "boring"],
      action: "highlight",
      language: "hi",
      message: "Satellite soil moisture aur geological data ke anusar, South Delhi / East Delhi me ye irregular blue zones sabse safe hain borewell drilling ke liye jahan water table sabse accha hai.",
      geoJSON: { type: "FeatureCollection", features: [
        poly([[77.20, 28.50], [77.22, 28.51], [77.23, 28.49], [77.21, 28.48], [77.20, 28.50]], '#00B4D8', 'High Water Table')
      ]}
    },
    {
      keywords: ["delhi", "smog", "pm2.5", "pollution", "heat", "map"],
      action: "highlight",
      language: "hinglish",
      message: "Delhi ke upar November mahine ka PM2.5 aur smog concentration heat map generate kar diya gaya hai. Red polygons high density areas dikhate hain.",
      geoJSON: { type: "FeatureCollection", features: [
        poly([[77.10, 28.70], [77.30, 28.75], [77.25, 28.60], [77.15, 28.55], [77.10, 28.70]], 'rgba(255,0,0,0.4)', 'Severe Smog')
      ]}
    },

    // ---------------- MUMBAI ----------------
    {
      keywords: ["mumbai", "coastal", "road", "reclamation", "samundar"],
      action: "highlight",
      language: "en",
      message: "Highlighting the new coastal reclamation areas for the Mumbai Coastal Road project along the western shoreline over the last 3 years.",
      geoJSON: { type: "FeatureCollection", features: [
        line([[72.81, 18.93], [72.815, 18.96], [72.82, 18.99], [72.825, 19.03]], '#FF9900', 'Coastal Road'),
        poly([[72.805, 18.95], [72.815, 18.95], [72.818, 18.98], [72.808, 18.98], [72.805, 18.95]], '#0088FF', 'Reclaimed Land')
      ]}
    },
    {
      keywords: ["mumbai", "flood", "waterlogging", "monsoon", "baarish"],
      action: "highlight",
      language: "hi",
      message: "Mumbai mein pichle monsoon (July) aur high tide ke dauran sabse zyada jalbharaav (waterlogging) wale flood-prone irregular zones ko blue dots aur polygons se mark kiya gaya hai.",
      geoJSON: { type: "FeatureCollection", features: [
        scatter([[72.83, 19.05], [72.84, 19.06], [72.85, 19.04], [72.86, 19.07]], '#0000FF', 'Waterlogged Points'),
        poly([[72.82, 19.04], [72.84, 19.05], [72.83, 19.02], [72.82, 19.04]], 'rgba(0,0,255,0.3)', 'Flood Zone')
      ]}
    },
    {
      keywords: ["mumbai", "urban", "expansion", "mangroves"],
      action: "highlight",
      language: "hinglish",
      message: "Mumbai ke aas paas mangroves ko clear karke jo urban expansion aur naye construction hue hain, unhe scatter points aur polygons me highlight kiya gaya hai.",
      geoJSON: { type: "FeatureCollection", features: [
        poly([[72.90, 19.10], [72.95, 19.12], [72.94, 19.08], [72.90, 19.10]], '#22C55E', 'Mangroves Left'),
        scatter([[72.92, 19.11], [72.93, 19.09], [72.91, 19.10]], '#FF0000', 'Illegal Construction')
      ]}
    },

    // ---------------- BANGALORE ----------------
    {
      keywords: ["bangalore", "bellandur", "varthur", "lake", "jheel"],
      action: "highlight",
      language: "en",
      message: "Comparing old and new satellite imagery. The irregular red polygons show the exact areas of Bellandur and Varthur lakes lost to weeds, encroachment, and new apartment constructions since 2018.",
      geoJSON: { type: "FeatureCollection", features: [
        poly([[77.65, 12.92], [77.67, 12.94], [77.66, 12.91], [77.65, 12.92]], '#0088FF', 'Current Water'),
        poly([[77.64, 12.93], [77.65, 12.94], [77.66, 12.93], [77.64, 12.93]], '#FF4D4D', 'Lost to Encroachment'),
        scatter([[77.66, 12.935], [77.67, 12.925], [77.655, 12.915]], '#94A3B8', 'New Apartments')
      ]}
    },
    {
      keywords: ["bangalore", "green", "cover", "tree", "forest", "hariyali"],
      action: "highlight",
      language: "hi",
      message: "Bangalore ke IT corridors (Outer Ring Road) ke paas 2015 se 2025 ke beech jitni hariyali (green cover) kam hui hai, use scattered red markers se darshaya gaya hai.",
      geoJSON: { type: "FeatureCollection", features: [
        line([[77.60, 12.90], [77.65, 12.92], [77.70, 12.95]], '#FFA500', 'Outer Ring Road'),
        scatter([[77.61, 12.91], [77.64, 12.93], [77.68, 12.94], [77.69, 12.96]], '#FF0000', 'Vegetation Loss')
      ]}
    },

    // ---------------- CHENNAI ----------------
    {
      keywords: ["chennai", "reservoir", "water", "paani"],
      action: "highlight",
      language: "en",
      message: "Here is the spatial extent of Chennai's main reservoirs compared to last summer. The blue irregular shape is the current water, and the dry exposed beds are marked in yellow.",
      geoJSON: { type: "FeatureCollection", features: [
        poly([[80.00, 13.00], [80.05, 13.02], [80.03, 12.98], [80.00, 13.00]], '#00B4D8', 'Current Water'),
        poly([[79.98, 12.99], [80.00, 13.00], [80.03, 12.98], [80.01, 12.97], [79.98, 12.99]], '#FFD700', 'Dried Bed')
      ]}
    },
    {
      keywords: ["chennai", "flood", "high", "tide", "baadh"],
      action: "highlight",
      language: "hinglish",
      message: "Chennai ke coastal areas me high tide ke time jo zones sabse jyada flood-prone hote hain, unhe red polygons me dikhaya gaya hai.",
      geoJSON: { type: "FeatureCollection", features: [
        poly([[80.25, 13.05], [80.30, 13.10], [80.28, 13.02], [80.25, 13.05]], 'rgba(255,0,0,0.4)', 'Flood Prone Zone')
      ]}
    },

    // ---------------- KOLKATA ----------------
    {
      keywords: ["kolkata", "hooghly", "bridge", "building"],
      action: "highlight",
      language: "en",
      message: "I have traced the Hooghly river path in blue, and used scattered points to highlight all new bridges and high-rise constructions along its banks over the last decade.",
      geoJSON: { type: "FeatureCollection", features: [
        line([[88.30, 22.60], [88.32, 22.55], [88.31, 22.50], [88.28, 22.45]], '#0088FF', 'Hooghly River'),
        scatter([[88.31, 22.57], [88.315, 22.52], [88.29, 22.48]], '#FF4D4D', 'New Bridges/Structures')
      ]}
    },
    {
      keywords: ["kolkata", "wetland", "illegal", "construction"],
      action: "highlight",
      language: "hi",
      message: "Kolkata ke East Kolkata Wetlands ko green polygon se, aur wahan ho rahe avaidh nirman (illegal construction) ko scattered red points se highlight kiya gaya hai.",
      geoJSON: { type: "FeatureCollection", features: [
        poly([[88.40, 22.50], [88.45, 22.55], [88.48, 22.50], [88.42, 22.45], [88.40, 22.50]], 'rgba(34,197,94,0.4)', 'Wetlands'),
        scatter([[88.41, 22.51], [88.44, 22.53], [88.46, 22.48]], '#FF0000', 'Illegal Encroachment')
      ]}
    },

    // ---------------- LADAKH ----------------
    {
      keywords: ["ladakh", "glacier", "snow", "warming", "melt", "baraf"],
      action: "highlight",
      language: "hinglish",
      message: "Ladakh region me global warming ki wajah se pichle 20 saalon me shrink hue glaciers aur snow cover melt ka irregular pattern draw kar diya gaya hai. White area bachi hui baraf hai, yellow area melted snow hai.",
      geoJSON: { type: "FeatureCollection", features: [
        poly([[77.50, 34.20], [77.60, 34.30], [77.55, 34.10], [77.50, 34.20]], 'rgba(255,255,255,0.8)', 'Current Snow'),
        poly([[77.45, 34.15], [77.50, 34.20], [77.55, 34.10], [77.40, 34.05], [77.45, 34.15]], 'rgba(255,215,0,0.5)', 'Melted Area')
      ]}
    },

    // ---------------- NATIONWIDE / AIRPORTS ----------------
    {
      keywords: ["airport", "terminal", "vegetation", "cleared"],
      action: "highlight",
      language: "en",
      message: "Highlighting Navi Mumbai airport and other new airports. The runway is drawn as a line, terminals as polygons, and cleared vegetation as scattered red zones.",
      geoJSON: { type: "FeatureCollection", features: [
        line([[73.05, 18.98], [73.08, 18.99]], '#1A1A1A', 'Runway'),
        poly([[73.06, 18.985], [73.07, 18.985], [73.07, 18.982], [73.06, 18.982], [73.06, 18.985]], '#0088FF', 'Terminal'),
        scatter([[73.04, 18.97], [73.09, 19.00], [73.05, 19.01]], '#FF4D4D', 'Cleared Forest')
      ]}
    },
    {
      keywords: ["soil", "stability", "construction", "ghar", "residential"],
      action: "highlight",
      language: "hinglish",
      message: "Soil stability aur flood maps ke aadhar par naya ghar banwane ya residential construction ke liye sabse safe irregular zones ko green color me highlight kar diya hai.",
      geoJSON: { type: "FeatureCollection", features: [
        poly([[77.35, 28.65], [77.40, 28.68], [77.38, 28.60], [77.35, 28.65]], 'rgba(34,197,94,0.5)', 'Safe Construction Zone')
      ]}
    },

    // ---------------- UPLOADED IMAGES (VQA & Change Detection) ----------------
    {
      keywords: ["change", "detect", "compare", "badlav", "fark", "dono", "image", "images", "difference"],
      action: "change_detection",
      language: "en",
      message: "Based on the uploaded T1 and T2 images, I have detected coastal land reclamation for the Mumbai Coastal Road. The red pulsing mask indicates the primary anomaly, and I have mapped the new road and reclaimed land.",
      geoJSON: { 
        type: "FeatureCollection", 
        image_bounds: [72.80, 18.92, 72.83, 19.04], // Coastal Road bounds
        features: [
          line([[72.81, 18.93], [72.815, 18.96], [72.82, 18.99], [72.825, 19.03]], '#FF9900', 'Coastal Road'),
          poly([[72.805, 18.95], [72.815, 18.95], [72.818, 18.98], [72.808, 18.98], [72.805, 18.95]], '#0088FF', 'Reclaimed Land')
        ]
      }
    },
    {
      keywords: ["what", "is", "this", "kya", "hai", "isme", "analyze", "explain", "uploaded"],
      action: "highlight",
      language: "en",
      message: "Analyzing the uploaded optical image... I detect an airport under construction (Navi Mumbai Airport). I have traced the runway (line), terminal buildings (polygon), and cleared vegetation (red points).",
      geoJSON: { 
        type: "FeatureCollection", 
        image_bounds: [73.03, 18.95, 73.10, 19.02], // Navi Mumbai Airport bounds
        features: [
          line([[73.05, 18.98], [73.08, 18.99]], '#1A1A1A', 'Runway'),
          poly([[73.06, 18.985], [73.07, 18.985], [73.07, 18.982], [73.06, 18.982], [73.06, 18.985]], '#0088FF', 'Terminal'),
          scatter([[73.04, 18.97], [73.09, 19.00], [73.05, 19.01]], '#FF4D4D', 'Cleared Forest')
        ]
      }
    }
  ];

  let bestMatch: MockResponse | null = null;
  let maxScore = 0;

  for (const mock of mockDatabase) {
    let score = 0;
    for (const keyword of mock.keywords) {
      if (query.includes(keyword)) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = mock;
    }
  }

  if (!bestMatch) {
    const isHindi = query.includes('hai') || query.includes('kya') || query.includes('kaise') || query.includes('kahan') || query.includes('kro') || query.includes('batao');
    
    return NextResponse.json({
      message: isHindi 
        ? "Mujhe is query ke baare me data nahi mil pa raha. Kripya Delhi, Mumbai, Bangalore, Chennai, Kolkata ya Ladakh se judi koi specific query puchein (jaise airport, jheel, baraf, ya baadh)."
        : "I couldn't identify specific features in your query. Try asking about specific events in Delhi, Mumbai, Bangalore, Chennai, Kolkata or Ladakh (e.g., airports, lakes, floods, snow melt).",
      action: 'text'
    });
  }

  return NextResponse.json({
    message: bestMatch.message,
    action: bestMatch.action,
    geoJSON: bestMatch.geoJSON
  });
}
