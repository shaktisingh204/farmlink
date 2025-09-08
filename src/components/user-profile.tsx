
'use client';

import { useEffect, useState, useActionState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserCircle, Terminal, CheckCircle } from 'lucide-react';
import { getUserProfile, updateProfileAction, type UpdateProfileState } from '@/lib/actions/user-actions';
import type { UserProfile as UserProfileType } from '@/lib/types';
import { useFormStatus } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from './hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export function UserProfile() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfileType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const { toast } = useToast();
    const initialState: UpdateProfileState = {};
    const updateUserActionWithId = updateProfileAction.bind(null, user?.uid || '');
    const [state, dispatch] = useActionState(updateUserActionWithId, initialState);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setIsLoading(false);
            setError("You must be logged in to view your profile.");
            return;
        }

        const fetchProfile = async () => {
            setIsLoading(true);
            setError(null);
            const result = await getUserProfile(user.uid);
            if (result.error) {
                setError(result.error);
            } else if (result.profile) {
                setProfile(result.profile);
            }
            setIsLoading(false);
        };

        fetchProfile();
    }, [user, authLoading]);

    useEffect(() => {
        if (state.success) {
            toast({
                title: 'Success!',
                description: 'Your profile has been updated.',
                variant: 'default',
            });
        }
    }, [state.success, toast]);

    if (isLoading) {
        return <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error) {
        return <div className="text-center py-12 text-destructive">{error}</div>;
    }

    if (!profile) {
        return <div className="text-center py-12 text-muted-foreground">Could not load profile.</div>;
    }

  return (
    <div className="space-y-8">
        <PageHeader title="Your Profile" description="View and manage your account details." />

        <form action={dispatch}>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Update your personal information here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <UserCircle className="w-16 h-16 text-muted-foreground" />
                        <div>
                            <p className="font-bold text-xl">{profile.name}</p>
                            <p className="text-muted-foreground">{profile.email}</p>
                            <p className="text-sm text-primary font-semibold capitalize">{profile.role}</p>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" defaultValue={profile.name} required/>
                        {state.fieldErrors?.name && <p className="text-sm text-destructive">{state.fieldErrors.name}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" defaultValue={profile.location} placeholder="e.g., Nashik, Maharashtra" />
                        {state.fieldErrors?.location && <p className="text-sm text-destructive">{state.fieldErrors.location}</p>}
                    </div>

                </CardContent>
                 <CardFooter className="flex flex-col items-start gap-4">
                    {state.error && (
                        <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Update Failed</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}
                    <SubmitButton />
                </CardFooter>
            </Card>
        </form>
    </div>
  );
}
