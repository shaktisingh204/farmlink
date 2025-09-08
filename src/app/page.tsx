
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
import { useLanguage, LanguageSwitcher } from '@/hooks/use-language';

function FaqChatbot() {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
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
                    chatbotName={t('faqBot_name')}
                    chatbotIcon={<Lightbulb />}
                    getAiResponse={(input) => getFaqBotResponse({ question: input.message, history: input.history })}
                    placeholder={t('faqBot_placeholder')}
                    className="h-full flex flex-col"
                    initialMessage={t('faqBot_initialMessage')}
                />
               </div>
            </PopoverContent>
        </Popover>
    )
}

function ContactSubmitButton() {
    const { t } = useLanguage();
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
             {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('contactForm_sending')}</> : t('contactForm_sendMessage')}
        </Button>
    )
}


function ContactForm() {
    const { t } = useLanguage();
    const initialState: ContactFormState = {};
    const [state, dispatch] = useActionState(saveContactMessageAction, initialState);
    const { toast } = useToast();
    const formRef = React.useRef<HTMLFormElement>(null);

    useEffect(() => {
        if(state.success) {
            toast({
                title: t('contactForm_success_title'),
                description: t('contactForm_success_description'),
            });
            formRef.current?.reset();
        }
    }, [state.success, toast, t])

    return (
        <form action={dispatch} ref={formRef}>
            <Card className="max-w-2xl mx-auto mt-12 bg-background">
                <CardHeader>
                    <CardTitle>{t('contactForm_title')}</CardTitle>
                    <CardDescription>{t('contactForm_description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('contactForm_nameLabel')}</Label>
                            <Input id="name" name="name" placeholder={t('contactForm_namePlaceholder')} required />
                             {state.fieldErrors?.name && <p className="text-sm text-destructive">{state.fieldErrors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('contactForm_emailLabel')}</Label>
                            <Input id="email" name="email" type="email" placeholder={t('contactForm_emailPlaceholder')} required/>
                             {state.fieldErrors?.email && <p className="text-sm text-destructive">{state.fieldErrors.email}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">{t('contactForm_messageLabel')}</Label>
                        <Textarea id="message" name="message" placeholder={t('contactForm_messagePlaceholder')} rows={5} required />
                        {state.fieldErrors?.message && <p className="text-sm text-destructive">{state.fieldErrors.message}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                     {state.error && <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
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
            title: t('portal_farmer_title'),
            description: t('portal_farmer_description'),
            href: '/farmer-login',
            icon: <User className="w-12 h-12 text-primary" />,
        },
        {
            title: t('portal_retailer_title'),
            description: t('portal_retailer_description'),
            href: '/retailer-login',
            icon: <ShoppingBag className="w-12 h-12 text-primary" />,
        },
        {
            title: t('portal_market_title'),
            description: t('portal_market_description'),
            href: '/market-login',
            icon: <Building className="w-12 h-12 text-primary" />,
        },
        {
            title: t('portal_admin_title'),
            description: t('portal_admin_description'),
            href: '/admin-login',
            icon: <Shield className="w-12 h-12 text-primary" />,
        },
    ];

    const features = [
        {
            icon: <Cpu className="w-10 h-10 text-primary" />,
            title: t('feature_priceAdvisor_title'),
            description: t('feature_priceAdvisor_description')
        },
        {
            icon: <TrendingUp className="w-10 h-10 text-primary" />,
            title: t('feature_marketData_title'),
            description: t('feature_marketData_description')
        },
        {
            icon: <Truck className="w-10 h-10 text-primary" />,
            title: t('feature_supplyChain_title'),
            description: t('feature_supplyChain_description')
        },
        {
            icon: <Lightbulb className="w-10 h-10 text-primary" />,
            title: t('feature_personalizedDeals_title'),
            description: t('feature_personalizedDeals_description')
        },
        {
            icon: <Users className="w-10 h-10 text-primary" />,
            title: t('feature_directConnections_title'),
            description: t('feature_directConnections_description')
        },
        {
            icon: <Bot className="w-10 h-10 text-primary" />,
            title: t('feature_aiAssistants_title'),
            description: t('feature_aiAssistants_description')
        }
    ];

    const testimonials = [
        {
            quote: t('testimonial1_quote'),
            name: "Anjali Patel",
            role: t('testimonial1_role'),
            avatar: "https://picsum.photos/100/100?random=21"
        },
        {
            quote: t('testimonial2_quote'),
            name: "Rohan Sharma",
            role: t('testimonial2_role'),
            avatar: "https://picsum.photos/100/100?random=22"
        },
        {
            quote: t('testimonial3_quote'),
            name: "Priya Singh",
            role: t('testimonial3_role'),
            avatar: "https://picsum.photos/100/100?random=23"
        }
    ];


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
                <h2 className="text-xl md:text-2xl font-semibold tracking-wide text-primary-foreground/80 mb-2">{t('hero_subtitle')}</h2>
                <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight">{t('hero_title')}</h1>
                <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
                    {t('hero_description')}
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="#portals">{t('hero_cta_getStarted')}</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                        {t('hero_cta_learnMore')}
                    </Button>
                </div>
             </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold font-headline">{t('features_title')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t('features_description')}
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
                        <span className="text-primary font-semibold">{t('aiShowcase_tagline')}</span>
                        <h2 className="text-4xl font-bold font-headline">{t('aiShowcase_title')}</h2>
                        <p className="text-lg text-muted-foreground">
                            {t('aiShowcase_description')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">{t('aiShowcase_agriAssist_title')}</h3>
                                    <p className="text-muted-foreground text-sm">{t('aiShowcase_agriAssist_description')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">{t('aiShowcase_faqBot_title')}</h3>
                                    <p className="text-muted-foreground text-sm">{t('aiShowcase_faqBot_description')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="bg-secondary/50 p-1.5 rounded-2xl shadow-lg h-[480px]">
                        <Chatbot
                            chatbotName={t('agriAssist_name')}
                            chatbotIcon={<Bot />}
                            getAiResponse={(input) => getFaqBotResponse({ question: input.message, history: input.history })}
                            placeholder={t('agriAssist_placeholder')}
                            className="h-full"
                            initialMessage={t('agriAssist_initialMessage')}
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md-py-24 bg-secondary/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold font-headline">{t('howItWorks_title')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t('howItWorks_description')}
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
                   <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground mb-4">
                           <span className="text-4xl font-bold">1</span>
                       </div>
                       <h3 className="text-xl font-headline font-semibold">{t('howItWorks_step1_title')}</h3>
                       <p className="text-muted-foreground mt-2">{t('howItWorks_step1_description')}</p>
                   </div>
                   <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground mb-4">
                           <span className="text-4xl font-bold">2</span>
                       </div>
                       <h3 className="text-xl font-headline font-semibold">{t('howItWorks_step2_title')}</h3>
                       <p className="text-muted-foreground mt-2">{t('howItWorks_step2_description')}</p>
                   </div>
                    <div className="flex flex-col items-center">
                       <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary text-primary-foreground mb-4">
                           <span className="text-4xl font-bold">3</span>
                       </div>
                       <h3 className="text-xl font-headline font-semibold">{t('howItWorks_step3_title')}</h3>
                       <p className="text-muted-foreground mt-2">{t('howItWorks_step3_description')}</p>
                   </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                 <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold font-headline">{t('testimonials_title')}</h2>
                 </div>
                 <div className="grid md:grid-cols-3 gap-8 mt-12">
                     {testimonials.map(t => (
                         <Card key={t.name} className="bg-background flex flex-col items-center text-center p-8 border-2">
                            <CardContent className="p-0">
                                <blockquote className="text-lg text-foreground/80 italic">"{t.quote}"</blockquote>
                            </CardContent>
                            <CardFooter className="flex flex-col items-center mt-6 p-0">
                                <Avatar className="w-16 h-16 mb-4">
                                    <AvatarImage src={t.avatar} alt={t.name} />
                                    <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="font-semibold">{t.name}</p>
                                <p className="text-muted-foreground text-sm">{t.role}</p>
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
                    <h2 className="text-4xl font-bold font-headline">{t('contact_title')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t('contact_description')}
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
                        title={t('portals_title')}
                        description={t('portals_description')}
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
                            {t('portals_loginButton')} <ArrowRight className="ml-2 h-4 w-4" />
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
                        {t('footer_tagline')}
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">{t('footer_navigation')}</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><a href="#features" className="text-muted-foreground hover:text-foreground">{t('footer_features')}</a></li>
                        <li><a href="#portals" className="text-muted-foreground hover:text-foreground">{t('footer_portals')}</a></li>
                        <li><a href="#contact" className="text-muted-foreground hover:text-foreground">{t('footer_contactUs')}</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-foreground">{t('footer_legal')}</h4>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><a href="#" className="text-muted-foreground hover:text-foreground">{t('footer_privacyPolicy')}</a></li>
                        <li><a href="#" className="text-muted-foreground hover:text-foreground">{t('footer_termsOfService')}</a></li>
                        <li><LanguageSwitcher /></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">{t('footer_followUs')}</h4>
                    <div className="flex mt-4 space-x-4">
                        <a href="#" className="text-muted-foreground hover:text-foreground"><Twitter /></a>
                        <a href="#" className="text-muted-foreground hover:text-foreground"><Facebook /></a>
                        <a href="#" className="text-muted-foreground hover:text-foreground"><Instagram /></a>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t border-border pt-6 text-center text-muted-foreground text-sm">
                <p>&copy; 2024 FarmLink. {t('footer_allRightsReserved')}</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
