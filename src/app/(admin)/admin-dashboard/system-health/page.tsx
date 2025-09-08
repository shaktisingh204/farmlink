import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Server } from 'lucide-react';

export default function Page() {
  return (
    <div className="space-y-8">
        <PageHeader title="System Health" description="Monitor system health." />
        <Card>
            <CardContent className="pt-6">
                 <div className="text-center py-16 text-muted-foreground">
                    <Server className="mx-auto h-12 w-12" />
                    <h3 className="mt-4 text-lg font-semibold">Nothing to show</h3>
                    <p className="mt-2 text-sm">
                        There is no system health data to display.
                    </p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}