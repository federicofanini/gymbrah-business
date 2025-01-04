import { Icons } from "@/components/icons";
import {
  AudioLines,
  BrainIcon,
  CodeIcon,
  Dumbbell,
  GlobeIcon,
  Handshake,
  Loader,
  PlugIcon,
  SmilePlus,
  Timer,
  UsersIcon,
  ZapIcon,
} from "lucide-react";

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "GymBrah",
  description: "Build better tiny habits to get fit and healthy.",
  cta: "Sign in",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: [
    "tiny habits",
    "fitness",
    "health",
    "habits",
    "AI",
    "health coach",
    "AI health coach",
    "AI fitness coach",
    "AI health coach",
    "AI fitness coach",
    "gym",
    "exercise",
    "workout",
    "health",
  ],
  links: {
    email: "support@gymbrah.com",
    twitter: "https://twitter.com/gymbrah",
    discord: "https://discord.gg/gymbrah",
    github: "https://github.com/gymbrah",
    instagram: "https://instagram.com/gymbrah",
  },
  hero: {
    title: "Build tiny habits",
    description:
      "Every achievement counts. Track your fitness journey, keep yourself accountable, and stay motivated every step of the way.",
    cta: "Ready to level up?",
    ctaDescription: "Claim $49 lifetime deal, free during beta.",
  },
  features: [
    {
      name: "Fitness Tracking",
      description:
        "Track your workouts, set goals, and monitor your progress across multiple metrics — whether it’s strength, endurance, or overall fitness. ",
      icon: <AudioLines className="h-6 w-6" />,
    },
    {
      name: "Progress Insights",
      description:
        "Set personalized fitness goals and get insights into your performance. Celebrate milestones in your fitness journey to stay motivated and on track.",
      icon: <Loader className="h-6 w-6" />,
    },
    {
      name: "Customizable Workouts",
      description:
        "Create your own workouts, follow predefined fitness plans, or customize routines to fit your needs. Adapts to your personal fitness level and evolves with your goals.",
      icon: <Dumbbell className="h-6 w-6" />,
    },
    {
      name: "Real-Time Accountability",
      description:
        "Stay accountable to your fitness goals with regular updates, reminders, and progress tracking. Gymbrah ensures you’re always moving forward with encouragement at every step.",
      icon: <Timer className="h-6 w-6" />,
    },
    {
      name: "Community Support",
      description:
        "Connect with like-minded individuals in the Gymbrah community. Share your progress, cheer on others, and get inspired to push harder as you grow alongside a supportive network.",
      icon: <Handshake className="h-6 w-6" />,
    },
    {
      name: "Community Driven",
      description:
        "Gymbrah is built with transparency in mind. As a fully open-source project, you can contribute, improve, and share your experience with the growing Gymbrah community.",
      icon: <SmilePlus className="h-6 w-6" />,
    },
  ],
  pricing: [
    {
      name: "Basic",
      price: { monthly: "$9", yearly: "$99" },
      frequency: { monthly: "month", yearly: "year" },
      description: "Perfect for individuals and small projects.",
      features: [
        "100 AI generations per month",
        "Basic text-to-image conversion",
        "Email support",
        "Access to community forum",
      ],
      cta: "Get Started",
    },
    {
      name: "Pro",
      price: { monthly: "$29", yearly: "$290" },
      frequency: { monthly: "month", yearly: "year" },
      description: "Ideal for professionals and growing businesses.",
      features: [
        "1000 AI generations per month",
        "Advanced text-to-image conversion",
        "Priority email support",
        "API access",
        "Custom AI model fine-tuning",
        "Collaboration tools",
      ],
      cta: "Get Started",
    },
    {
      name: "Enterprise",
      price: { monthly: "$999", yearly: "Custom" },
      frequency: { monthly: "month", yearly: "year" },
      description: "Tailored solutions for large organizations.",
      features: [
        "Unlimited AI generations",
        "Dedicated account manager",
        "24/7 phone and email support",
        "Custom AI model development",
        "On-premises deployment option",
        "Advanced analytics and reporting",
      ],
      popular: true,
      cta: "Get Started",
    },
  ],
  footer: {
    socialLinks: [
      // {
      //   icon: <Icons.twitter className="h-5 w-5" />,
      //   url: "#",
      // },
    ],
    links: [
      { text: "Terms", url: "/terms" },
      { text: "Privacy", url: "/privacy" },
    ],
    bottomText: "All rights reserved.",
    brandText: "GYMBRAH",
  },

  testimonials: [
    {
      id: 1,
      text: "The AI Agent SDK has revolutionized how we build intelligent systems. It's incredibly intuitive and powerful.",
      name: "Alice Johnson",
      company: "OpenMind Labs",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      text: "We've significantly reduced development time for our AI projects using this SDK. The multi-agent feature is a game-changer.",
      name: "Bob Brown",
      company: "NeuralForge",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 3,
      text: "The cross-language support allowed us to seamlessly integrate AI agents into our existing tech stack.",
      name: "Charlie Davis",
      company: "CodeHarbor",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 4,
      text: "The AI Agent SDK's tool integration feature has streamlined our workflow automation processes.",
      name: "Diana Evans",
      company: "AutomateX",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 5,
      text: "The customizable agent behaviors have allowed us to create highly specialized AI solutions for our clients.",
      name: "Ethan Ford",
      company: "AICore",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 6,
      text: "The AI Agent SDK's efficiency features have significantly improved our system's performance and scalability.",
      name: "Fiona Grant",
      company: "ScaleAI",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 7,
      text: "The SDK's intuitive APIs have made it easy for our team to quickly prototype and deploy AI agent systems.",
      name: "George Harris",
      company: "RapidAI",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 8,
      text: "The AI Agent SDK's multi-agent system has enabled us to build complex, collaborative AI solutions with ease.",
      name: "Hannah Irving",
      company: "CollabAI",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 9,
      text: "The SDK's flexibility in integrating external tools has expanded our AI agents' capabilities tremendously.",
      name: "Ian Johnson",
      company: "FlexAI",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 10,
      text: "The AI Agent SDK's documentation and support have made our learning curve much smoother.",
      name: "Julia Kim",
      company: "DevAI",
      image:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 11,
      text: "We've seen a significant boost in our AI's decision-making capabilities thanks to the AI Agent SDK.",
      name: "Kevin Lee",
      company: "DecisionTech",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 12,
      text: "The SDK's multi-agent system has revolutionized our approach to complex problem-solving.",
      name: "Laura Martinez",
      company: "SolveX",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzZ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 13,
      text: "The customization options in the AI Agent SDK have allowed us to create truly unique AI solutions.",
      name: "Michael Chen",
      company: "UniqueAI",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 14,
      text: "The efficiency of the AI Agent SDK has significantly reduced our development time and costs.",
      name: "Natalie Wong",
      company: "FastTrackAI",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODh8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 15,
      text: "The cross-language support has made it easy for our diverse team to collaborate on AI projects.",
      name: "Oliver Smith",
      company: "GlobalAI",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
