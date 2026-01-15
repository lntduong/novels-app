
'use server';

import { signIn, signOut, auth } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';



export async function logout() {
    await signOut();
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Not authenticated' };
    }

    const nickname = formData.get('nickname') as string;
    const avatar = formData.get('avatar') as string;
    const birthDateStr = formData.get('birthDate') as string;

    const updateData: any = {};
    if (nickname) updateData.nickname = nickname;
    if (avatar) updateData.avatar = avatar;
    if (birthDateStr) {
        // Handle date string to Date object
        const date = new Date(birthDateStr);
        if (!isNaN(date.getTime())) {
            updateData.birthDate = date;
        }
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
        });
        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Profile update error:', error);
        return { error: 'Failed to update profile' };
    }
}
