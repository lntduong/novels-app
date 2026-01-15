'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { updateProfile } from '@/lib/actions'
import { useTranslation } from '@/components/providers/language-provider'
import Link from 'next/link'
import { Upload, ArrowLeft } from 'lucide-react'

// ... (interfaces)
interface UserProfile {
    id: string
    email: string
    username: string | null
    nickname: string | null
    avatar: string | null
    birthDate: string | null // ISO string
}

export default function ProfileClientPage({ user }: { user: UserProfile }) {
    const { t } = useTranslation()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(user.avatar || '')
    const [uploading, setUploading] = useState(false)

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.[0]) return
        setUploading(true)
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', 'avatars')

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            setAvatarUrl(data.url)
        } catch (error: any) {
            console.error(error)
            alert(error.message || 'Avatar upload failed')
        } finally {
            setUploading(false)
        }
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        // Ensure avatar URL is included if changed
        if (avatarUrl !== user.avatar) {
            formData.set('avatar', avatarUrl)
        }

        const res = await updateProfile(formData)
        if (res?.error) {
            alert(res.error)
        } else {
            alert('Profile updated successfully!')
            router.refresh()
            router.push('/')
        }
        setLoading(false)
    }

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Link href="/">
                <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('common.back') || 'Back'}
                </Button>
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{t('profile.title') || 'My Profile'}</CardTitle>
                    <CardDescription>{t('profile.subtitle') || 'Manage your account settings'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback>{user.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                />
                                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('avatar-upload')?.click()} disabled={uploading}>
                                    <Upload className="w-4 h-4 mr-2" />
                                    {uploading ? 'Uploading...' : (t('profile.change_avatar') || 'Change Avatar')}
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">{t('common.username') || 'Username'}</Label>
                                <Input id="username" value={user.username || ''} disabled />
                                <p className="text-xs text-muted-foreground">Username cannot be changed.</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('common.email')}</Label>
                                <Input id="email" value={user.email} disabled />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nickname">{t('profile.nickname') || 'Nickname'}</Label>
                                <Input
                                    id="nickname"
                                    name="nickname"
                                    defaultValue={user.nickname || ''}
                                    placeholder="Enter your nickname"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="birthDate">{t('profile.birth_date') || 'Birth Date'}</Label>
                                <Input
                                    id="birthDate"
                                    name="birthDate"
                                    type="date"
                                    defaultValue={user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : ''}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading || uploading}>
                                {loading ? 'Saving...' : (t('common.save') || 'Save Changes')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
