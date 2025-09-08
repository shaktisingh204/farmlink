
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ShoppingBag, Building, Shield, ArrowRight, TrendingUp, Cpu, Truck, Lightbulb, Users, CheckCircle, Facebook, Twitter, Instagram, MessageSquare, Bot, Terminal, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React, { useState, useActionState, useEffect } from 'react';
import { Chatbot } from '@/components/chatbot';
import { getFaqBotResponse, saveContactMessageAction, type ContactFormState } from './actions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFormStatus } from 'react-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { LanguageSwitcher, useLanguage } from '@/hooks/use-language';
import { Logo } from '@/components/logo';

function FaqChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                 <Button
                    variant="primary"
                    className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-50"
                    aria-label="Open FAQ Chatbot"
                >
                    <MessageSquare className="h-8 w-8" />
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
                    chatbotName={t('farmLinkFaq')}
                    chatbotIcon={<Lightbulb />}
                    getAiResponse={(input) => getFaqBotResponse({ question: input.message, history: input.history })}
                    placeholder={t('askAboutFarmLink')}
                    className="h-full flex flex-col"
                    initialMessage={t('faqBotInitialMessage')}
                />
               </div>
            </PopoverContent>
        </Popover>
    )
}

function ContactSubmitButton() {
    const { pending } = useFormStatus();
    const { t } = useLanguage();
    return (
        <Button type="submit" disabled={pending}>
             {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('sending')}</> : t('sendMessage')}
        </Button>
    )
}


function ContactForm() {
    const initialState: ContactFormState = {};
    const [state, dispatch] = useActionState(saveContactMessageAction, initialState);
    const { toast } = useToast();
    const formRef = React.useRef<HTMLFormElement>(null);
    const { t } = useLanguage();

    useEffect(() => {
        if(state.success) {
            toast({
                title: t('messageSent'),
                description: t('messageSentDesc'),
            });
            formRef.current?.reset();
        }
    }, [state.success, toast, t])

    return (
        <form action={dispatch} ref={formRef}>
            <Card className="max-w-2xl mx-auto mt-12 bg-background">
                <CardHeader>
                    <CardTitle>{t('contactForm')}</CardTitle>
                    <CardDescription>{t('contactFormDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('name')}</Label>
                            <Input id="name" name="name" placeholder={t('yourName')} required />
                             {state.fieldErrors?.name && <p className="text-sm text-destructive">{state.fieldErrors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input id="email" name="email" type="email" placeholder="your@email.com" required/>
                             {state.fieldErrors?.email && <p className="text-sm text-destructive">{state.fieldErrors.email}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">{t('message')}</Label>
                        <Textarea id="message" name="message" placeholder={t('yourMessage')} rows={5} required />
                        {state.fieldErrors?.message && <p className="text-sm text-destructive">{state.fieldErrors.message}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                     {state.error && <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>{t('error')}</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
                    <ContactSubmitButton />
                </CardFooter>
            </Card>
        </form>
    );
}

export default function LandingPage() {
    const { t } = useLanguage();

    const portals = [
        {
            title: "farmerPortal",
            description: "farmerPortalDesc",
            href: '/farmer-login',
            icon: <User className="w-12 h-12 text-primary" />,
        },
        {
            title: "retailerPortal",
            description: "retailerPortalDesc",
            href: '/retailer-login',
            icon: <ShoppingBag className="w-12 h-12 text-primary" />,
        },
        {
            title: "marketPortal",
            description: "marketPortalDesc",
            href: '/market-login',
            icon: <Building className="w-12 h-12 text-primary" />,
        },
        {
            title: "adminPortal",
            description: "adminPortalDesc",
            href: '/admin-login',
            icon: <Shield className="w-12 h-12 text-primary" />,
        },
    ];

    const features = [
        {
            icon: <Cpu className="w-10 h-10 text-primary" />,
            title: "aiPriceAdvisor",
            description: "featurePriceAdvisorDesc"
        },
        {
            icon: <TrendingUp className="w-10 h-10 text-primary" />,
            title: "realTimeMarketData",
            description: "featureMarketDataDesc"
        },
        {
            icon: <Truck className="w-10 h-10 text-primary" />,
            title: "supplyChainOptimization",
            description: "featureSupplyChainDesc"
        },
        {
            icon: <Lightbulb className="w-10 h-10 text-primary" />,
            title: "personalizedDeals",
            description: "featurePersonalizedDealsDesc"
        },
        {
            icon: <Users className="w-10 h-10 text-primary" />,
            title: "directConnections",
            description: "featureDirectConnectionsDesc"
        },
        {
            icon: <Bot className="w-10 h-10 text-primary" />,
            title: "aiPoweredAssistants",
            description: "featureAIAssistantsDesc"
        }
    ];

    const testimonials = [
        {
            quote: "testimonial1Quote",
            name: "Anjali Patel",
            role: "testimonial1Role",
            avatar: "https://picsum.photos/100/100?random=21"
        },
        {
            quote: "testimonial2Quote",
            name: "Rohan Sharma",
            role: "testimonial2Role",
            avatar: "https://picsum.photos/100/100?random=22"
        },
        {
            quote: "testimonial3Quote",
            name: "Priya Singh",
            role: "testimonial3Role",
            avatar: "https://picsum.photos/100/100?random=23"
        }
    ];


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="absolute top-0 left-0 right-0 z-20 bg-transparent text-white">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Logo className="w-7 h-7"/>
                <span className="text-xl font-semibold font-headline">FarmLink</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <a href="#features" className="hover:text-primary transition-colors">{t('features')}</a>
                <a href="#portals" className="hover:text-primary transition-colors">{t('portals')}</a>
                <a href="#contact" className="hover:text-primary transition-colors">{t('contactUs')}</a>
            </nav>
            <div className="flex items-center gap-2">
                <LanguageSwitcher />
            </div>
        </div>
      </header>
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
                <h2 className="text-xl md:text-2xl font-semibold tracking-wide text-primary-foreground/80 mb-2">{t('heroSubtitle')}</h2>
                <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight">{t('heroTitle')}</h1>
                <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
                    {t('heroDescription')}
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="#portals">{t('getStarted')}</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                        {t('learnMore')}
                    </Button>
                </div>
             </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold font-headline">{t('featuresTitle')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t('featuresDescription')}
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
                                <CardTitle className="font-headline mt-4">{t(feature.title)}</CardTitle>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <p className="text-muted-foreground">{t(feature.description)}</p>
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
                        <span className="text-primary font-semibold">{t('aiPoweredAssistance')}</span>
                        <h2 className="text-4xl font-bold font-headline">{t('aiShowcaseTitle')}</h2>
                        <p className="text-lg text-muted-foreground">
                           {t('aiShowcaseDesc')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">{t('agriAssistant')}</h3>
                                    <p className="text-muted-foreground text-sm">{t('agriAssistantDesc')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">{t('platformFaqBot')}</h3>
                                    <p className="text-muted-foreground text-sm">{t('platformFaqBotDesc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="bg-secondary/50 p-1.5 rounded-2xl shadow-lg h-[480px]">
                        <Chatbot
                            chatbotName={t('agriAssistant')}
                            chatbotIcon={<Bot />}
                            getAiResponse={(input) => getFaqBotResponse({ question: input.message, history: input.history })}
                            placeholder={t('askAboutCrops')}
                            className="h-full"
                            initialMessage={t('agriAssistantInitialMessage')}
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md-py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold font-headline">{t('howItWorksTitle')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                       {t('howItWorksDesc')}
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
                   <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground mb-4">
                           <span className="text-4xl font-bold">1</span>
                       </div>
                       <h3 className="text-xl font-headline font-semibold">{t('howItWorksStep1Title')}</h3>
                       <p className="text-muted-foreground mt-2">{t('howItWorksStep1Desc')}</p>
                   </div>
                   <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground mb-4">
                           <span className="text-4xl font-bold">2</span>
                       </div>
                       <h3 className="text-xl font-headline font-semibold">{t('howItWorksStep2Title')}</h3>
                       <p className="text-muted-foreground mt-2">{t('howItWorksStep2Desc')}</p>
                   </div>
                    <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground mb-4">
                           <span className="text-4xl font-bold">3</span>
                       </div>
                       <h3 className="text-xl font-headline font-semibold">{t('howItWorksStep3Title')}</h3>
                       <p className="text-muted-foreground mt-2">{t('howItWorksStep3Desc')}</p>
                   </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                 <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold font-headline">{t('testimonialsTitle')}</h2>
                 </div>
                 <div className="grid md:grid-cols-3 gap-8 mt-12">
                     {testimonials.map(testimonial => (
                         <Card key={testimonial.name} className="bg-background flex flex-col items-center text-center p-8 border-2">
                            <CardContent className="p-0">
                                <blockquote className="text-lg text-foreground/80 italic">"{t(testimonial.quote)}"</blockquote>
                            </CardContent>
                            <CardFooter className="flex flex-col items-center mt-6 p-0">
                                <Avatar className="w-16 h-16 mb-4">
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-muted-foreground text-sm">{t(testimonial.role)}</p>
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
                    <h2 className="text-4xl font-bold font-headline">{t('getInTouch')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t('getInTouchDesc')}
                    </p>
                </div>
                <ContactForm />
            </div>
        </section>

        {/* Portal Section */}
        <section id="portals" className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto">
                    <PageHeader
                        title={t('chooseYourPortal')}
                        description={t('chooseYourPortalDesc')}
                    />
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-12 w-full max-w-6xl mx-auto">
                    {portals.map((portal) => (
                    <Card key={portal.title} className="flex flex-col text-center items-center">
                        <CardHeader className="items-center gap-4">
                        {portal.icon}
                        <div className='space-y-1'>
                            <CardTitle className="font-headline">{t(portal.title)}</CardTitle>
                            <CardDescription>{t(portal.description)}</CardDescription>
                        </div>
                        </CardHeader>
                        <CardContent className="mt-auto w-full">
                        <Link href={portal.href} passHref>
                            <Button className="w-full">
                            {t('login')} <ArrowRight className="ml-2 h-4 w-4" />
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
      <footer className="bg-background border-t">
        <div className="container mx-auto py-12 px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2 md:col-span-4 lg:col-span-2">
                    <div className="flex items-center gap-2">
                        <Bot className="w-7 h-7 text-primary"/>
                        <span className="text-xl font-semibold font-headline text-foreground">FarmLink</span>
                    </div>
                    <p className="text-muted-foreground mt-4 text-sm">
                        {t('heroTitle')}
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">{t('navigation')}</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><a href="#features" className="text-muted-foreground hover:text-foreground">{t('features')}</a></li>
                        <li><a href="#portals" className="text-muted-foreground hover:text-foreground">{t('portals')}</a></li>
                        <li><a href="#contact" className="text-muted-foreground hover:text-foreground">{t('contactUs')}</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-foreground">{t('legal')}</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><a href="#" className="text-muted-foreground hover:text-foreground">{t('privacyPolicy')}</a></li>
                        <li><a href="#" className="text-muted-foreground hover:text-foreground">{t('termsOfService')}</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">{t('followUs')}</h4>
                    <div className="flex mt-4 space-x-4">
                        <a href="#" className="text-muted-foreground hover:text-foreground"><Twitter /></a>
                        <a href="#" className="text-muted-foreground hover:text-foreground"><Facebook /></a>
                        <a href="#" className="text-muted-foreground hover:text-foreground"><Instagram /></a>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t border-border pt-6 text-center text-muted-foreground text-sm">
                <p>{t('copyright')}</p>
            </div>
        </div>
      </footer>
    </div>
  );
}

    