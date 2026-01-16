'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { resetPasswordWithCode } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { ChevronLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setMessage(null);
        setError(null);

        const result = await resetPasswordWithCode(null, formData);

        if (result?.error) {
            setError(result.error);
        } else if (result?.success) {
            setMessage('Password reset successfully! You can now login with your new password.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md">
                <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-6 transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Login
                </Link>

                <Card className="shadow-lg border-none sm:border-gray-200 dark:sm:border-gray-800">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                        <CardDescription>
                            Enter your email and a valid recovery code to duplicate your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {message ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium text-center">
                                    {message}
                                </div>
                                <Button asChild className="w-full">
                                    <Link href="/login">Return to Login</Link>
                                </Button>
                            </div>
                        ) : (
                            <form action={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        className="bg-white dark:bg-gray-950"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">Recovery Code</Label>
                                    <Input
                                        id="code"
                                        name="code"
                                        type="text"
                                        placeholder="XXXX-XXXX"
                                        required
                                        className="font-mono bg-white dark:bg-gray-950 uppercase"
                                    />
                                    <p className="text-[10px] text-gray-500">
                                        Format: 8-character code saved from your profile.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="bg-white dark:bg-gray-950"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="bg-white dark:bg-gray-950"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">
                                        {error}
                                    </div>
                                )}

                                <SubmitButton />
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={pending}>
            {pending ? 'Resetting...' : 'Reset Password'}
        </Button>
    );
}
