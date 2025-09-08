
'use client';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { getContactMessages, markMessageAsRead, type ContactMessage } from './actions';
import { Loader2, Mail, Inbox, Check } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Page() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getContactMessages();
      if (result.error) {
        setError(result.error);
      } else {
        setMessages(result.messages || []);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const result = await markMessageAsRead(id);
    if (result.success) {
        toast({ title: "Message marked as read."});
        fetchMessages(); // Refresh the list
    } else {
        toast({ variant: 'destructive', title: "Error", description: result.error });
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contact Messages"
        description="View messages submitted through the public contact form."
      />
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>
            A list of all messages from your users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
          ) : messages.length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {messages.map((message) => (
                <AccordionItem value={message.id} key={message.id}>
                  <AccordionTrigger className={cn("hover:no-underline p-4 rounded-lg", !message.isRead && "bg-secondary/50")}>
                    <div className="flex-1 text-left">
                       <div className="flex items-center justify-between">
                            <p className={cn("font-medium", !message.isRead && "font-bold")}>{message.name}</p>
                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</p>
                       </div>
                       <p className="text-sm text-muted-foreground">{message.email}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-background border rounded-b-lg">
                    <p className="whitespace-pre-wrap text-foreground/80">{message.message}</p>
                    <div className="flex justify-end mt-4">
                        {!message.isRead && (
                             <Button size="sm" onClick={() => handleMarkAsRead(message.id)}>
                                <Check className="mr-2" /> Mark as Read
                            </Button>
                        )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Inbox className="mx-auto h-12 w-12" />
              <h3 className="mt-4 text-lg font-semibold">Empty Inbox</h3>
              <p className="mt-2 text-sm">
                No contact messages have been received yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
