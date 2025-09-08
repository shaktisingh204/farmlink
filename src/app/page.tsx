

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ShoppingBag, Building, Shield, ArrowRight, TrendingUp, Cpu, Truck, Lightbulb, Users, CheckCircle, Facebook, Twitter, Instagram } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
        icon: <ArrowRight className="w-10 h-10 text-primary" />,
        title: "Platform Analytics",
        description: "Powerful dashboards for market managers and admins to oversee participation, logistics, and revenue."
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
        quote: "Managing our local market is so much more efficient now. The logistics and participation dashboards are a game-changer.",
        name: "Priya Singh",
        role: "Market Manager, Pune"
    }
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center text-center text-white bg-black">
             <Image 
                src="https://picsum.photos/1920/1080?random=42" 
                alt="A vibrant farm landscape at sunrise" 
                layout="fill"
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
                        <Card key={feature.title} className="text-center bg-background">
                            <CardHeader className="items-center">
                                {feature.icon}
                                <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24">
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
        <section className="py-16 md:py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                 <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold font-headline">Trusted by the Community</h2>
                 </div>
                 <div className="grid md:grid-cols-3 gap-8 mt-12">
                     {testimonials.map(t => (
                         <Card key={t.name} className="bg-background">
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
        <section id="contact" className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold font-headline">Get In Touch</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Have questions or feedback? We'd love to hear from you.
                    </p>
                </div>
                <Card className="max-w-2xl mx-auto mt-12">
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
        <section id="portals" className="py-16 md:py-24 bg-secondary/50">
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
      </main>
      <footer className="bg-card border-t">
        <div className="container mx-auto py-12 px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2">
                        <User className="w-7 h-7 text-primary"/>
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
            <div className="mt-8 border-t pt-6 text-center text-muted-foreground text-sm">
                <p>&copy; 2024 FarmLink. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
