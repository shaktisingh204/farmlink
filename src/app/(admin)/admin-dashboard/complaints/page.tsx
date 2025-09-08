import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { FileWarning } from 'lucide-react';

export default function Page() {
  return (
    <div className="space-y-8">
        <PageHeader title="Complaints" description="Manage user complaints." />
        <Card>
            <CardContent className="pt-6">
                <div className="text-center py-16 text-muted-foreground">
                    <FileWarning className="mx-auto h-12 w-12" />
                    <h3 className="mt-4 text-lg font-semibold">Nothing to show</h3>
                    <p className="mt-2 text-sm">
                        There are no complaints to display.
                    </p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}