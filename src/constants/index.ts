import { Icons } from "@/components";
import exp from "constants";
import { 
  Sparkles, 
  Palette, 
  Search, 
  Monitor, 
  Server, 
  Globe,
  Smartphone,
  BookOpen,
  Code,
  Wrench,
  Megaphone,
  Brush,
} from "lucide-react";

export const subject = [
    {
        titleKey: "1" 
    },
    {
        titleKey: "2" 
    },
    {
        titleKey: "3" 
    },
    {
        titleKey: "4" 
    },
    {
        titleKey: "5" 
    },
    {
        titleKey: "6" 
    }
]

export const perks = [
    {
        titleKey: "auth",
        icon: Icons.auth
    },
    {
        titleKey: "customize",
        icon: Icons.customize
    },
    {
        titleKey: "launch",
        icon: Icons.launch
    },
] as const;

export const services = [
   {
    titleKey: "1",
    icon: Globe
   },
   {
    titleKey: "2",
    icon: Smartphone
   },
   {
    titleKey: "3",
    icon: BookOpen
   },
   {
    titleKey: "4",
    icon: Code
   },
   {
    titleKey: "5",
    icon: Search
   },
   {
    titleKey: "6",
    icon: Wrench
   },
   {
    titleKey: "7",
    icon: Megaphone
   },
   {
    titleKey: "8",
    icon: Brush
   },
]

export const features = [
    {
        titleKey: "fast_setup",
        icon: Icons.bolt,
    },
    {
        titleKey: "customizable_templates",
        icon: Icons.palette,
    },
    {
        titleKey: "seo_optimized",
        icon: Icons.seo,
    },
    {
        titleKey: "responsive_design",
        icon: Icons.monitor,
    },
    {
        titleKey: "ecommerce_ready",
        icon: Icons.shop,
    },
    {
        titleKey: "secure_hosting",
        icon: Icons.server,
    },
] as const;

// export type Feature = {
//     icon: LucideIcon;
//     titleKey: string;
// };

export const pricingCards = [
    {
        titleKey: "starter",
        title: "Starter",
        features: ["Limited projects", "1 Team member", "Basic features"]
    },
    {
        titleKey: "unlimited",
        title: "Unlimited Saas",
        features: ["Unlimited projects", "5 Team members", "Advanced design tools", "Customizable domain"]
    },
    {
        titleKey: "enterprise",
        title: "Enterprise",
        features: ["Unlimited projects", "Unlimited Team members", "Custom branding", "Priority support (24/7)"]
    },
];

export const bentoCards = [
    {
        title: 'Start with Inspiration',
        info: 'Browse our vast library of pre-designed templates or upload your own images.',
        imgSrc: '/assets/bento-1.svg', // Lightbulb or Inspiration icon
        alt: 'Inspiration for website creation'
    },
    {
        title: 'AI Assists Your Vision',
        info: 'Our intelligent AI tailors suggestions and functionalities based on your goals.',
        imgSrc: '/assets/bento1.svg', // AI Assistant icon
        alt: 'AI website building assistant'
    },
    {
        title: 'Drag & Drop Customization',
        info: 'Effortlessly personalize your website with our intuitive drag-and-drop editor.',
        imgSrc: '/assets/bento1.svg', // Drag and Drop icon or hand editing a website
        alt: 'Website customization with drag and drop'
    },
    {
        title: 'Launch & Shine Online',
        info: 'Publish your website with a single click and take your brand to the world.',
        imgSrc: '/assets/bento1.svg', // Rocket launching or website going live
        alt: 'Website launch and publication'
    },
];

export const reviews = [
    {
        titleKey: "jack",
        name: "Jack",
        username: "@jack",
    },
    {
        titleKey: "jill",
        name: "Jill",
        username: "@jill",
    },
    {
        titleKey: "john",
        name: "John",
        username: "@john",
    },
    {
        titleKey: "jane",
        name: "Jane",
        username: "@jane",
    },
    {
        titleKey: "jenny",
        name: "Jenny",
        username: "@jenny",
    },
    {
        titleKey: "james",
        name: "James",
        username: "@james",
    },
];
