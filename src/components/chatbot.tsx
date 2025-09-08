
'use client';
import { useState, useRef, useEffect, startTransition } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgriAssistInput } from '@/ai/flows/agri-assist-flow';
import type { FaqBotInput } from '@/ai/flows/faq-bot-flow';

type Message = {
    role: 'user' | 'model';
    content: string;
};

type ChatbotProps = {
    chatbotName: string;
    chatbotIcon: React.ReactNode;
    getAiResponse: (input: any) => Promise<{ answer: string } | { error: string }>;
    placeholder?: string;
    className?: string;
    initialMessage?: string;
};

export function Chatbot({
    chatbotName,
    chatbotIcon,
    getAiResponse,
    placeholder = "Type your message...",
    className,
    initialMessage,
}: ChatbotProps) {
    const [messages, setMessages] = useState<Message[]>(
        initialMessage ? [{ role: 'model', content: initialMessage }] : []
    );
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        startTransition(() => {
            scrollToBottom();
        });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const historyForApi = messages.map(msg => ({
            role: msg.role,
            content: [{ text: msg.content }]
        }));

        try {
            const result = await getAiResponse({ message: input, history: historyForApi });
            if ('answer' in result) {
                const botMessage: Message = { role: 'model', content: result.answer };
                setMessages(prev => [...prev, botMessage]);
            } else {
                 const errorMessage: Message = { role: 'model', content: `Error: ${result.error}` };
                 setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            const errorMessage: Message = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className={cn("flex flex-col h-full", className)}>
            <CardHeader className="flex flex-row items-center gap-3 border-b">
                {chatbotIcon}
                <CardTitle className="font-headline">{chatbotName}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                                {message.role === 'model' && (
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                        <Bot className="w-5 h-5" />
                                    </span>
                                )}
                                <div className={cn("p-3 rounded-lg max-w-xs md:max-w-md", message.role === 'user' ? 'bg-secondary' : 'bg-background border')}>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                                {message.role === 'user' && (
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                                        <User className="w-5 h-5" />
                                    </span>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                    <Bot className="w-5 h-5" />
                                </span>
                                <div className="p-3 rounded-lg bg-background border">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="pt-6 border-t">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={placeholder}
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
