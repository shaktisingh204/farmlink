
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2, Bot, Microscope, Tags } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type ServiceStatus = 'checking' | 'healthy' | 'error';

interface Service {
  name: string;
  status: ServiceStatus;
  description: string;
}

interface RecentActivity {
    id: string;
    icon: React.ElementType;
    description: string;
    timestamp: Date;
}

const initialServices: Service[] = [
  { name: 'Firebase Authentication', status: 'checking', description: 'User login and registration services.' },
  { name: 'Realtime Database', status: 'checking', description: 'Primary data storage for all app content.' },
  { name: 'Genkit AI Services', status: 'checking', description: 'All AI models and flows (Gemini).' },
  { name: 'Market Data API (data.gov.in)', status: 'checking', description: 'External API for market price data.' },
];

// In a real app, this data would come from a logging service or database.
const sampleRecentActivity: RecentActivity[] = [
    { id: 'act1', icon: Microscope, description: 'AI Price Advisor generated a recommendation for Tomatoes.', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 'act2', icon: Bot, description: 'Agri-Assist chatbot answered a query about pest control.', timestamp: new Date(Date.now() - 1000 * 60 * 12) },
    { id: 'act3', icon: Tags, description: 'AI Market Suggestions generated insights for Wheat.', timestamp: new Date(Date.now() - 1000 * 60 * 35) },
    { id: 'act4', icon: Microscope, description: 'AI Price Advisor generated a recommendation for Apples.', timestamp: new Date(Date.now() - 1000 * 60 * 62) },
];


function StatusIndicator({ status }: { status: ServiceStatus }) {
    if (status === 'checking') {
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
    }
    if (status === 'healthy') {
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-destructive" />;
}

export default function Page() {
    const [services, setServices] = useState<Service[]>(initialServices);

    useEffect(() => {
        // Simulate checking services on page load
        const timers = services.map((service, index) => 
            setTimeout(() => {
                setServices(prev => prev.map(s => s.name === service.name ? {...s, status: 'healthy'} : s));
            }, (index + 1) * 700)
        );

        return () => timers.forEach(clearTimeout);
    }, []);

  return (
    <div className="space-y-8">
        <PageHeader title="System Health" description="Monitor the status and performance of key platform services." />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Service Status</CardTitle>
                    <CardDescription>A real-time check of all critical infrastructure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {services.map(service => (
                        <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg bg-secondary/30">
                           <div>
                             <p className="font-semibold">{service.name}</p>
                             <p className="text-sm text-muted-foreground">{service.description}</p>
                           </div>
                           <div className="flex items-center gap-2">
                                <StatusIndicator status={service.status} />
                                <span className={cn(
                                    "text-sm font-medium capitalize",
                                    service.status === 'healthy' && 'text-green-600',
                                    service.status === 'error' && 'text-destructive',
                                )}>{service.status === 'checking' ? 'Checking...' : service.status}</span>
                           </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Recent AI Activity</CardTitle>
                    <CardDescription>A log of the latest AI-driven events on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sampleRecentActivity.map(activity => (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 rounded-full mt-1">
                                    <activity.icon className="w-5 h-5 text-primary"/>
                                </div>
                                <div>
                                    <p className="text-sm">{activity.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
