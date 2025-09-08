
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Placeholder data for payments
const payments = [
  { id: 'pay_1', date: '2024-05-20', amount: 450.00, status: 'Completed', method: 'Credit Card' },
  { id: 'pay_2', date: '2024-05-18', amount: 1200.50, status: 'Completed', method: 'Bank Transfer' },
  { id: 'pay_3', date: '2024-05-15', amount: 300.00, status: 'Completed', method: 'Credit Card' },
  { id: 'pay_4', date: '2024-05-10', amount: 875.25, status: 'Completed', method: 'Credit Card' },
  { id: 'pay_5', date: '2024-05-01', amount: 150.00, status: 'Completed', method: 'Bank Transfer' },
];


export default function PaymentsPage() {
  return (
    <div className="space-y-8">
       <PageHeader title="Payments" description="Review your payment history." />
       <Card>
            <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>A record of all your transactions.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map(payment => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                                    <TableCell>{payment.date}</TableCell>
                                    <TableCell>{payment.method}</TableCell>
                                    <TableCell><Badge>{payment.status}</Badge></TableCell>
                                    <TableCell className="text-right">INR {payment.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                   </div>
            </CardContent>
       </Card>
    </div>
  );
}
