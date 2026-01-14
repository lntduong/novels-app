import GenreManager from '@/components/admin/genre-manager'

export default function AdminGenresPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Genres</h1>
                <p className="text-muted-foreground">
                    Manage story categories and genres.
                </p>
            </div>
            <GenreManager />
        </div>
    )
}
