import { HelpCircleIcon, LineChartIcon, Link2Icon, LockIcon, NewspaperIcon, QrCodeIcon, ShoppingCart, Tags } from "lucide-react";

export const NAV_LINKS = [
    
    {
        title: "Features",
        href: "/features",
        menu: [
            {
                title: "Link Shortening",
                tagline: "Shorten links and track their performance.",
                href: "/features/link-shortening",
                icon: Link2Icon,
            },
            {
                title: "Password Protection",
                tagline: "Secure your links with a password.",
                href: "/features/password-protection",
                icon: LockIcon,
            },
            {
                title: "Advanced Analytics",
                tagline: "Gain insights into who is clicking your links.",
                href: "/features/analytics",
                icon: LineChartIcon,
            },
            {
                title: "Custom QR Codes",
                tagline: "Use QR codes to reach your audience.",
                href: "/features/qr-codes",
                icon: QrCodeIcon,
            },
        ],
    },
    {
        title: "Pricing",   
        href: "/pricing",
    },
    {
        title: "Enterprise",
        href: "/enterprise",
    },
    {
        title: "Resources",
        href: "/resources",
        menu: [
            {
                title: "Blog",
                tagline: "Read articles on the latest trends in tech.",
                href: "/resources/blog",
                icon: NewspaperIcon,
            },
            {
                title: "Tag",
                tagline: "Read articles on the latest trends in tech.",
                href: "/resources/blog/tags",
                icon: Tags,
            },
            {
                title: "Products",
                tagline: "Read articles on the latest trends in tech.",
                href: "/resources/blog/tags/Products",
                icon: ShoppingCart,
            },
            {
                title: "Help",
                tagline: "Get answers to your questions.",
                href: "/resources/help",
                icon: HelpCircleIcon,
            },
        ]
    },
    {
        title: "About",
        href: "/about",
    },
    {
        title: "Changelog",
        href: "/changelog",
    },
];
