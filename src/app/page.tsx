

'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ShoppingBag, Building, Shield, ArrowRight, TrendingUp, Cpu, Truck, Lightbulb, Users, CheckCircle, Facebook, Twitter, Instagram, MessageSquare, Bot } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Chatbot } from '@/components/chatbot';
import { getFaqBotResponse } from './actions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';


const portals = [
  {
    title: 'Farmer Portal',
    description: 'Manage your produce, track earnings, and connect with markets.',
    href: '/farmer-login',
    icon: <User className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Retailer Portal',
    description: 'Browse produce, place orders, and discover new local suppliers.',
    href: '/retailer-login',
    icon: <ShoppingBag className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Market Portal',
    description: 'Oversee market operations, participation, and logistics.',
    href: '/market-login',
    icon: <Building className="w-12 h-12 text-primary" />,
  },
  {
    title: 'Admin Portal',
    description: 'System administration, user management, and analytics.',
    href: '/admin-login',
    icon: <Shield className="w-12 h-12 text-primary" />,
  },
];

const features = [
    {
        icon: <Cpu className="w-10 h-10 text-primary" />,
        title: "AI Price Advisor",
        description: "Leverage AI to get fair price recommendations for your produce based on quality and real-time market data."
    },
    {
        icon: <TrendingUp className="w-10 h-10 text-primary" />,
        title: "Real-time Market Data",
        description: "Access up-to-the-minute market prices and trends to make informed selling and purchasing decisions."
    },
    {
        icon: <Truck className="w-10 h-10 text-primary" />,
        title: "Supply Chain Optimization",
        description: "Our AI analyzes supply and demand to recommend the most efficient distribution strategies to minimize waste."
    },
    {
        icon: <Lightbulb className="w-10 h-10 text-primary" />,
        title: "Personalized Deals",
        description: "Retailers receive AI-powered recommendations for the best deals based on their purchasing history."
    },
     {
        icon: <Users className="w-10 h-10 text-primary" />,
        title: "Direct Connections",
        description: "A transparent marketplace that directly connects farmers with retailers and local markets, fostering community."
    },
    {
        icon: <Bot className="w-10 h-10 text-primary" />,
        title: "AI-Powered Assistants",
        description: "Get instant answers to your questions with our platform-wide FAQ bot and specialized Agri-Assistant for farmers."
    }
]

const testimonials = [
    {
        quote: "FarmLink has revolutionized how I sell my produce. The AI price advisor helps me get the best price every time.",
        name: "Anjali Patel",
        role: "Farmer, Gujarat"
    },
    {
        quote: "Finding high-quality, local produce has never been easier. The recommended deals save me time and money.",
        name: "Rohan Sharma",
        role: "Retailer, Mumbai"
    },
    {
        quote: "The Agri-Assistant chatbot is incredible. It's like having a farming expert in my pocket 24/7. I get instant advice on everything.",
        name: "Priya Singh",
        role: "Farmer, Pune"
    }
]

function FaqChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                 <Button
                    variant="primary"
                    className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-50"
                    aria-label="Open FAQ Chatbot"
                >
                    <Bot className="h-8 w-8" />
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                side="top" 
                align="end" 
                className="w-[24rem] h-[36rem] p-0 border-0 mr-[-0.5rem] mb-2"
                onInteractOutside={(e) => {
                    // Prevent closing when clicking inside the chatbot
                    if ((e.target as HTMLElement).closest('[data-chatbot-area]')) {
                        e.preventDefault();
                    }
                }}
            >
               <div data-chatbot-area="true" className='h-full'>
                 <Chatbot
                    chatbotName="FarmLink FAQ"
                    chatbotIcon={<Lightbulb />}
                    getAiResponse={(input) => getFaqBotResponse({ question: input.message, history: input.history })}
                    placeholder="Ask about FarmLink features..."
                    className="h-full flex flex-col"
                    initialMessage="Hello! How can I help you learn about FarmLink today?"
                />
               </div>
            </PopoverContent>
        </Popover>
    )
}


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center text-center text-white bg-black">
             <Image 
                src="https://picsum.photos/1920/1080?random=42" 
                alt="A vibrant farm landscape at sunrise" 
                fill
                objectFit="cover"
                className="opacity-50"
                data-ai-hint="farm landscape"
             />
             <div className="relative z-10 p-4">
                <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight">Connecting Fields to Markets, Seamlessly.</h1>
                <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
                    FarmLink is the all-in-one platform empowering farmers, retailers, and local markets with AI-driven insights for a more efficient and fair agricultural ecosystem.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="#portals">Get Started</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                        Learn More
                    </Button>
                </div>
             </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold font-headline">A Smarter Way to Trade</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Our powerful AI tools and transparent marketplace provide everything you need to thrive.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {features.map(feature => (
                        <Card key={feature.title} className="text-center bg-background border-2 border-transparent hover:border-primary hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 group">
                             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <CardHeader className="items-center p-8">
                                <div className="p-4 bg-primary/10 rounded-full">
                                    {feature.icon}
                                </div>
                                <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
        
        {/* AI Showcase Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <span className="text-primary font-semibold">AI-Powered Assistance</span>
                        <h2 className="text-4xl font-bold font-headline">Your Agricultural Expert is Here, 24/7</h2>
                        <p className="text-lg text-muted-foreground">
                            FarmLink integrates cutting-edge AI to provide instant support and expert advice. Whether you're a farmer needing crop advice or a new user exploring the platform, our AI assistants are here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">Agri-Assistant</h3>
                                    <p className="text-muted-foreground text-sm">Get expert answers to your farming questions, from pest control to market trends.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">Platform FAQ Bot</h3>
                                    <p className="text-muted-foreground text-sm">Have a question about a feature? Our FAQ bot provides instant answers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="bg-secondary/50 p-1.5 rounded-2xl shadow-lg h-[480px]">
                        <Chatbot
                            chatbotName="Agri-Assistant"
                            chatbotIcon={<Bot />}
                            getAiResponse={(input) => getFaqBotResponse({ question: input.message, history: input.history })}
                            placeholder="Ask about your crops..."
                            className="h-full"
                            initialMessage="Hello! Your Agricultural Expert is Here, 24/7. Ask me about your crops."
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md-py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold font-headline">Get Started in 3 Easy Steps</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Joining our network is simple and quick.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
                   <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground mb-4">
                           <span className="text-4xl font-bold">1</span>
                       </div>
                       <h3 className="text-xl font-headline font-semibold">Create an Account</h3>
                       <p className="text-muted-foreground mt-2">Choose your portal and register as a Farmer, Retailer, or Market Manager.</p>
                   </div>
                   <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground mb-4">
                           <span className="text-4xl font-bold">2</span>
                       </div>
                       <h3 className="text-xl font-headline font-semibold">Explore Your Dashboard</h3>
                       <p className="text-muted-foreground mt-2">Access powerful tools tailored to your role, from listing produce to analyzing data.</p>
                   </div>
                    <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground mb-4">
                           <span className="text-4xl font-bold">3</span>
                       </div>
                       <h3 className="text-xl font-headline font-semibold">Start Transacting</h3>
                       <p className="text-muted-foreground mt-2">Connect with partners, make sales, place orders, and grow your business.</p>
                   </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                 <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold font-headline">Trusted by the Community</h2>
                 </div>
                 <div className="grid md:grid-cols-3 gap-8 mt-12">
                     {testimonials.map(t => (
                         <Card key={t.name} className="bg-secondary/50 border-0">
                            <CardContent className="pt-6">
                                <blockquote className="text-lg text-foreground/80 italic">"{t.quote}"</blockquote>
                            </CardContent>
                            <CardFooter>
                                <p className="font-semibold">{t.name}, <span className="text-muted-foreground font-normal">{t.role}</span></p>
                            </CardFooter>
                         </Card>
                     ))}
                 </div>
            </div>
        </section>
        
        {/* Contact Us Section */}
        <section id="contact" className="py-16 md:py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold font-headline">Get In Touch</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Have questions or feedback? We'd love to hear from you.
                    </p>
                </div>
                <Card className="max-w-2xl mx-auto mt-12 bg-background">
                    <CardHeader>
                        <CardTitle>Contact Form</CardTitle>
                        <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Your Name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="your@email.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Your message..." rows={5}/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Send Message</Button>
                    </CardFooter>
                </Card>
            </div>
        </section>

        {/* Portal Section */}
        <section id="portals" className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto">
                    <PageHeader
                        title="Choose Your Portal"
                        description="Select the portal that matches your role to log in or create an account."
                    />
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-12 w-full max-w-6xl mx-auto">
                    {portals.map((portal) => (
                    <Card key={portal.title} className="flex flex-col text-center items-center">
                        <CardHeader className="items-center gap-4">
                        {portal.icon}
                        <div className='space-y-1'>
                            <CardTitle className="font-headline">{portal.title}</CardTitle>
                            <CardDescription>{portal.description}</CardDescription>
                        </div>
                        </CardHeader>
                        <CardContent className="mt-auto w-full">
                        <Link href={portal.href} passHref>
                            <Button className="w-full">
                            Login <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </div>
        </section>

        <FaqChatbot />
      </main>
      <footer className="relative bg-background border-t text-white">
        <Image 
            src="https://picsum.photos/1920/1080?random=101"
            alt="Abstract footer background"
            fill
            objectFit="cover"
            className="opacity-20"
            data-ai-hint="dark farm"
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 container mx-auto py-12 px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2">
                        <Bot className="w-7 h-7 text-primary"/>
                        <span className="text-xl font-semibold font-headline">FarmLink</span>
                    </div>
                    <p className="text-muted-foreground mt-4 text-sm">
                        Connecting fields to markets, seamlessly.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">Navigation</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><a href="#features" className="text-muted-foreground hover:text-primary">Features</a></li>
                        <li><a href="#portals" className="text-muted-foreground hover:text-primary">Portals</a></li>
                        <li><a href="#contact" className="text-muted-foreground hover:text-primary">Contact Us</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-foreground">Legal</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                        <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">Follow Us</h4>
                    <div className="flex mt-4 space-x-4">
                        <a href="#" className="text-muted-foreground hover:text-primary"><Twitter /></a>
                        <a href="#" className="text-muted-foreground hover:text-primary"><Facebook /></a>
                        <a href="#" className="text-muted-foreground hover:text-primary"><Instagram /></a>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6 text-center text-muted-foreground text-sm">
                <p>&copy; 2024 FarmLink. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}

    




