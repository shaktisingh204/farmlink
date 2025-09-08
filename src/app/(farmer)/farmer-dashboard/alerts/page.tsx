
'use client';

import { PageHeader } from '@/components/page-header';
import { getAlertsForFarmer, type Alert } from './actions';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Bell, AlertTriangle, ShoppingCart, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

function AlertIcon({ type }: { type: Alert['type'] }) {
    switch (type) {
        case 'new_order':
            return <ShoppingCart className="h-5 w-5 text-blue-500" />;
        case 'low_stock':
            return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        case 'price_change':
            return <Info className="h-5 w-5 text-green-500" />;
        default:
            return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
}

export default function AlertsPage() {
    const { user, loading: authLoading } = useAuth();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setIsLoading(false);
            setError("You must be logged in to view your alerts.");
            return;
        }

        const fetchAlerts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await getAlertsForFarmer(user.uid);
                if (result.error) {
                    setError(result.error);
                } else {
                    setAlerts(result.alerts || []);
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching alerts.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAlerts();
    }, [user, authLoading]);

  return (
    <div className="space-y-8">
        <PageHeader title="Your Alerts" description="Notifications about your orders, listings, and market changes." />

        <Card>
            <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>This is a list of your recent notifications.</CardDescription>
            </CardHeader>
            <CardContent>
                 {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-destructive">{error}</div>
                ) : alerts.length > 0 ? (
                   <div className="space-y-4">
                        {alerts.map(alert => (
                            <div key={alert.id} className={cn("flex items-start gap-4 p-4 rounded-lg border", {
                                'bg-secondary/50': !alert.isRead,
                                'bg-background': alert.isRead,
                            })}>
                               <AlertIcon type={alert.type} />
                                <div className='flex-1'>
                                    <p className={cn("font-medium", {
                                        'font-bold': !alert.isRead,
                                    })}>{alert.message}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))}
                   </div>
                ) : (
                    <div className="col-span-full text-center py-12 flex flex-col items-center">
                        <Bell className="w-12 h-12 mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">You have no alerts right now.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
