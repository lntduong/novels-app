'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useTranslation } from '@/components/providers/language-provider'

interface Genre {
    id: string
    name: string
    slug: string
    _count?: {
        stories: number
    }
}

export default function GenreManager() {
    const { t } = useTranslation()
    const [genres, setGenres] = useState<Genre[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [editingGenre, setEditingGenre] = useState<Genre | null>(null)
    const [formData, setFormData] = useState({ name: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchGenres()
    }, [])

    const fetchGenres = async () => {
        try {
            const res = await fetch('/api/genres')
            const data = await res.json()
            if (data.genres) {
                setGenres(data.genres)
            }
        } catch (error) {
            console.error('Failed to fetch genres:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredGenres = genres.filter(genre =>
        genre.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const url = editingGenre ? `/api/genres/${editingGenre.id}` : '/api/genres'
            const method = editingGenre ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Failed to save genre')

            await fetchGenres()
            handleCloseDialog()
        } catch (error) {
            console.error('Error saving genre:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/genres/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete genre')

            setGenres(genres.filter(g => g.id !== id))
        } catch (error) {
            console.error('Error deleting genre:', error)
        }
    }

    const handleOpenCreate = () => {
        setEditingGenre(null)
        setFormData({ name: '' })
        setIsCreateDialogOpen(true)
    }

    const handleOpenEdit = (genre: Genre) => {
        setEditingGenre(genre)
        setFormData({ name: genre.name })
        setIsCreateDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setIsCreateDialogOpen(false)
        setEditingGenre(null)
        setFormData({ name: '' })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search genres..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Genre
                </Button>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingGenre ? 'Edit Genre' : 'Create Genre'}</DialogTitle>
                        <DialogDescription>
                            {editingGenre ? 'Update genre name.' : 'Add a new genre for stories.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="E.g. Fantasy, Romance"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                    <p className="text-center col-span-full py-8 text-gray-500">Loading genres...</p>
                ) : filteredGenres.length === 0 ? (
                    <p className="text-center col-span-full py-8 text-gray-500">No genres found.</p>
                ) : (
                    filteredGenres.map((genre) => (
                        <Card key={genre.id} className="group hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">{genre.name}</h3>
                                    <p className="text-xs text-gray-500">{genre._count?.stories || 0} stories</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(genre)}>
                                        <Pencil className="h-4 w-4 text-gray-500" />
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will delete the genre "{genre.name}". Stories using this genre will keep their other genres.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(genre.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
