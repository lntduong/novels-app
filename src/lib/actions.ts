
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

// --- Recovery Code Actions ---

import { randomBytes, createHash } from 'crypto';
import bcrypt from 'bcryptjs';

export async function generateRecoveryCodes() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Not authenticated' };
    }

    const codes: string[] = [];
    const hashedCodesData: { code: string; userId: string }[] = [];

    // Generate 10 codes
    for (let i = 0; i < 10; i++) {
        // Generate random 8-char hex string (e.g., "a1b2c3d4")
        const code = randomBytes(4).toString('hex').toUpperCase();
        // Format as XXXX-XXXX for readability
        const formattedCode = `${code.slice(0, 4)}-${code.slice(4)}`;

        codes.push(formattedCode); // Return raw code to user ONCE

        // Hash code for storage (SHA256 is fast and sufficient for this, or bcrypt for slower hashing)
        // Using bcrypt for consistency with passwords, though slower it's safer.
        const hashedCode = await bcrypt.hash(formattedCode, 10);

        hashedCodesData.push({
            userId: session.user.id,
            code: hashedCode,
        });
    }

    try {
        await prisma.$transaction(async (tx) => {
            // Delete old codes
            await tx.recoveryCode.deleteMany({
                where: { userId: session.user.id },
            });

            // Insert new codes
            await tx.recoveryCode.createMany({
                data: hashedCodesData,
            });
        });

        return { success: true, codes };
    } catch (error) {
        console.error('Generate codes error:', error);
        return { error: 'Failed to generate codes' };
    }
}

export async function resetPasswordWithCode(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const code = formData.get('code') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!email || !code || !password || !confirmPassword) {
        return { error: 'Please fill in all fields' };
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' };
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {}, // No include needed for now
        });

        if (!user) {
            // Return generic error for security
            return { error: 'Invalid information' };
        }

        // Find matches manually because we need to compare hashes
        // We fetch ALL valid (unused) codes for this user
        const recoveryCodes = await prisma.recoveryCode.findMany({
            where: {
                userId: user.id,
                used: false
            }
        });

        let matchedCodeId: string | null = null;

        for (const rc of recoveryCodes) {
            const isMatch = await bcrypt.compare(code.trim().toUpperCase(), rc.code);
            if (isMatch) {
                matchedCodeId = rc.id;
                break;
            }
        }

        if (!matchedCodeId) {
            return { error: 'Invalid recovery code' };
        }

        // Valid code found: Reset password AND mark code as used
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            }),
            prisma.recoveryCode.update({
                where: { id: matchedCodeId },
                data: { used: true },
            })
        ]);

        return { success: true };

    } catch (error) {
        console.error('Reset password error:', error);
        return { error: 'Failed to reset password' };
    }
}
