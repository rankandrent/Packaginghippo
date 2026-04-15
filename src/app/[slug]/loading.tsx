export default function SlugLoading() {
    return (
        <main className="min-h-screen bg-white">
            <section className="border-b bg-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                </div>
            </section>

            <section className="py-10">
                <div className="container mx-auto px-4">
                    <div className="grid gap-10 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <div className="aspect-square animate-pulse rounded-2xl bg-gray-200" />
                        </div>
                        <div className="space-y-4 lg:col-span-7">
                            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                            <div className="h-12 w-3/4 animate-pulse rounded bg-gray-200" />
                            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                            <div className="flex flex-wrap gap-3 pt-2">
                                <div className="h-10 w-32 animate-pulse rounded-full bg-yellow-100" />
                                <div className="h-10 w-36 animate-pulse rounded-full bg-green-100" />
                                <div className="h-10 w-28 animate-pulse rounded-full bg-green-100" />
                            </div>
                            <div className="mt-6 h-56 animate-pulse rounded-2xl bg-gray-100" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
