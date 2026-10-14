export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const placeholderBody = `
This article is coming soon. Full content from D&C Contracting will be published here.

[Add full article content here.]
`;

export const blogPosts: BlogPost[] = [
  {
    id: "planning-successful-renovation",
    title: "Tips for Planning a Successful Renovation Project",
    excerpt: "Key things to consider before starting a renovation, from budgeting and timelines to choosing the right contractor.",
    content: placeholderBody,
    author: "D&C Contracting",
    date: "[Add date]",
    readTime: "5 min read",
    category: "RENOVATION",
    image: "/src/assets/blog-sustainable-architecture.jpg"
  },
  {
    id: "quality-workmanship-matters",
    title: "Why Quality Workmanship Matters in Construction",
    excerpt: "How attention to detail and quality workmanship protect your investment and ensure lasting results.",
    content: placeholderBody,
    author: "D&C Contracting",
    date: "[Add date]",
    readTime: "4 min read",
    category: "CONSTRUCTION",
    image: "/src/assets/blog-minimalist-living.jpg"
  },
  {
    id: "choosing-right-contracting-company",
    title: "How to Choose the Right Contracting Company",
    excerpt: "What to look for when hiring a contractor: experience, communication, reliability, and project transparency.",
    content: placeholderBody,
    author: "D&C Contracting",
    date: "[Add date]",
    readTime: "5 min read",
    category: "CONTRACTING",
    image: "/src/assets/blog-urban-planning.jpg"
  },
  {
    id: "residential-vs-commercial-contracting",
    title: "Residential vs Commercial Contracting: What to Know",
    excerpt: "Understanding the differences between residential and commercial contracting work and what each project type involves.",
    content: placeholderBody,
    author: "D&C Contracting",
    date: "[Add date]",
    readTime: "6 min read",
    category: "CONTRACTING",
    image: "/src/assets/blog-sustainable-architecture.jpg"
  }
];
