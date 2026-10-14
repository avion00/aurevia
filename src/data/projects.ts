import projectConcrete from "@/assets/project-concrete.jpg";
import projectBasement1 from "@/assets/project-basement-1.jpg";
import projectBasement2 from "@/assets/project-basement-2.jpg";
import projectBasement3 from "@/assets/project-basement-3.jpg";
import projectBasement4 from "@/assets/project-basement-4.jpg";
import projectBasement5 from "@/assets/project-basement-5.jpg";
import projectKitchen1 from "@/assets/project-kitchen-1.jpg";
import projectKitchen2 from "@/assets/project-kitchen-2.jpg";
import projectKitchenVideo from "@/assets/project-kitchen-video.mp4";
import projectShed1 from "@/assets/project-shed-1.jpg";
import projectShed2 from "@/assets/project-shed-2.jpg";
import projectTileVideo from "@/assets/project-tile-video.mp4";
import projectTilePoster from "@/assets/project-tile-poster.jpg";
import projectBathroom1 from "@/assets/project-bathroom-1.jpg";
import projectBathroom2 from "@/assets/project-bathroom-2.jpg";
import projectBathroom3 from "@/assets/project-bathroom-3.jpg";
import projectBathroom4 from "@/assets/project-bathroom-4.jpg";
import projectFraming1 from "@/assets/project-framing-1.jpg";
import projectFraming2 from "@/assets/project-framing-2.jpg";
import projectFraming3 from "@/assets/project-framing-3.jpg";
import projectFraming4 from "@/assets/project-framing-4.jpg";
import projectFraming5 from "@/assets/project-framing-5.jpg";
import projectExterior1 from "@/assets/project-exterior-1.jpg";
import projectFlooring1 from "@/assets/project-flooring-1.jpg";
import projectFlooring2 from "@/assets/project-flooring-2.jpg";
import projectFlooring3 from "@/assets/project-flooring-3.jpg";

export type Project = {
  image: string;
  video?: string;
  title: string;
  location: string;
  category: string;
  description: string;
  area: string;
  year: string;
};

export type CategoryGroup = { category: string; items: Project[] };

export const projects: Project[] = [
  // CONCRETE
  {
    image: projectConcrete,
    title: "CONCRETE DRIVEWAY POUR",
    location: "Buffalo, NY",
    category: "CONCRETE",
    description: "Full driveway concrete pour with a clean broom finish — built for durability and curb appeal through every Western New York season.",
    area: "Residential",
    year: "2024"
  },

  // KITCHEN
  {
    image: projectKitchen1,
    title: "KITCHEN TEAR-DOWN & REBUILD",
    location: "Buffalo, NY",
    category: "KITCHEN",
    description: "Mid-project kitchen rebuild — cabinets stripped to the frame and prepped for a complete refinish and modernized layout.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectKitchen2,
    video: projectKitchenVideo,
    title: "KITCHEN REMODEL",
    location: "Buffalo, NY",
    category: "KITCHEN",
    description: "Full kitchen renovation featuring custom white cabinetry, quartz countertops, and modern pendant lighting for a bright, timeless space.",
    area: "Residential",
    year: "2024"
  },

  // BATHROOM
  {
    image: projectBathroom1,
    title: "BATHROOM GUT & DEMO",
    location: "Niagara Falls, NY",
    category: "BATHROOM",
    description: "Full bathroom tear-out and demo — clearing the way for a complete modern rebuild from the studs up.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectBathroom2,
    title: "BATHROOM BACKER BOARD PREP",
    location: "Niagara Falls, NY",
    category: "BATHROOM",
    description: "Waterproof backer board installation around a new tub — the prep work that makes a tile shower last for decades.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectBathroom3,
    title: "BATHROOM TUB & TILE INSTALL",
    location: "Niagara Falls, NY",
    category: "BATHROOM",
    description: "Fresh tub install with marble-style tile surround and new subfloor prep — ready for the final finish.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectBathroom4,
    title: "BATHROOM REMODEL — MARBLE TILE SHOWER",
    location: "Niagara Falls, NY",
    category: "BATHROOM",
    description: "Full bathroom remodel finished with a floor-to-ceiling marble-look tile shower surround and modern fixtures. Need your bathroom brought up-to-date? Contact us for a free quote.",
    area: "Residential",
    year: "2024"
  },

  // BASEMENT
  {
    image: projectBasement1,
    title: "BASEMENT REFRESH",
    location: "Buffalo, NY",
    category: "BASEMENT",
    description: "Updated basement featuring crisp white wainscoting and deep charcoal walls for a modern, finished feel.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectBasement2,
    title: "OPEN-CEILING BASEMENT",
    location: "Buffalo, NY",
    category: "BASEMENT",
    description: "Modern open-ceiling basement design with recessed lighting and a clean two-tone wall treatment.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectBasement3,
    title: "BASEMENT REMODEL — FRAMING",
    location: "Buffalo, NY",
    category: "BASEMENT",
    description: "Full basement remodel in progress — framing, drywall prep, and structural work delivering a transformed living space.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectBasement4,
    title: "BASEMENT LIVING SPACE",
    location: "Buffalo, NY",
    category: "BASEMENT",
    description: "Completed basement living area featuring tile flooring, recessed lighting, and a sleek modern finish.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectBasement5,
    title: "BASEMENT BUILD-OUT",
    location: "Buffalo, NY",
    category: "BASEMENT",
    description: "Mid-project basement build-out with new framing and prep work for a fully finished lower level.",
    area: "Residential",
    year: "2024"
  },

  // FLOORING
  {
    image: projectFlooring1,
    title: "HARDWOOD FLOORING INSTALL",
    location: "Niagara Falls, NY",
    category: "FLOORING",
    description: "Pergo XP hardwood-look plank flooring installed across an open living space — clean, durable, and built to last.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectFlooring2,
    title: "WARM WOOD PLANK FLOORING",
    location: "Niagara Falls, NY",
    category: "FLOORING",
    description: "Warm-tone wood plank flooring delivering a cozy, finished look to a freshly remodeled room.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectFlooring3,
    title: "LIGHT OAK PLANK FLOORING",
    location: "Niagara Falls, NY",
    category: "FLOORING",
    description: "Bright light-oak plank flooring installation brightening up a freshly drywalled room — looking for flooring replacement? Contact us for a free quote.",
    area: "Residential",
    year: "2024"
  },

  // FRAMING
  {
    image: projectFraming1,
    title: "BATHROOM FRAMING",
    location: "Niagara Falls, NY",
    category: "FRAMING",
    description: "Fresh stud framing and insulation for a bathroom rebuild — solid structural work prepped for plumbing, drywall, and tile. Framing services needed? Reach out for a free quote.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectFraming2,
    title: "INTERIOR WALL FRAMING",
    location: "Niagara Falls, NY",
    category: "FRAMING",
    description: "Full interior stud framing with rough plumbing and electrical boxes set — clean, square, and ready for inspection.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectFraming3,
    title: "FRAMING WITH ROUGH PLUMBING",
    location: "Niagara Falls, NY",
    category: "FRAMING",
    description: "Wall framing with rough plumbing stack and insulation prep — every detail squared away before drywall goes up.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectFraming4,
    title: "WHOLE-ROOM REFRAME",
    location: "Niagara Falls, NY",
    category: "FRAMING",
    description: "Complete reframe of a gutted room — new studs, headers, and openings ready for the next phase of the rebuild.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectFraming5,
    title: "ROOM FRAMING & ELECTRICAL ROUGH-IN",
    location: "Niagara Falls, NY",
    category: "FRAMING",
    description: "Stud-wall framing with electrical boxes and wire pulls in place — built to code and ready for insulation and drywall.",
    area: "Residential",
    year: "2024"
  },

  // EXTERIOR
  {
    image: projectExterior1,
    title: "FRONT DOOR ROUGH-IN & TRIM",
    location: "Niagara Falls, NY",
    category: "EXTERIOR",
    description: "Fresh exterior opening framed with clean white trim, prepped for a stylish new front door install. Enhance your home's curb appeal — contact D&C Contracting today.",
    area: "Residential",
    year: "2024"
  },

  // SHED
  {
    image: projectShed1,
    title: "SHED ASSEMBLY IN PROGRESS",
    location: "Buffalo, NY",
    category: "SHED",
    description: "Mid-build shed assembly featuring durable steel panels, reinforced framing, and a clean modern profile. Need help putting up a shed? Give us a call.",
    area: "Residential",
    year: "2024"
  },
  {
    image: projectShed2,
    title: "BACKYARD SHED BUILD",
    location: "Buffalo, NY",
    category: "SHED",
    description: "Custom backyard shed build — sleek black exterior with white trim, fully assembled and ready for storage or a workshop space.",
    area: "Residential",
    year: "2024"
  },

  // TILE
  {
    image: projectTilePoster,
    video: projectTileVideo,
    title: "CUSTOM TILE WORK",
    location: "Buffalo, NY",
    category: "TILE",
    description: "Precision tile installation with clean lines and a flawless finish — perfect for bathrooms, kitchens, and floors. Call today for a free estimate.",
    area: "Residential",
    year: "2024"
  }
];

export const categories = ["ALL", "CONCRETE", "KITCHEN", "BATHROOM", "BASEMENT", "FLOORING", "FRAMING", "EXTERIOR", "SHED", "TILE"];

export const categoryGroups: CategoryGroup[] = categories
  .filter((c) => c !== "ALL")
  .map((category) => ({ category, items: projects.filter((p) => p.category === category) }))
  .filter((g) => g.items.length > 0);
