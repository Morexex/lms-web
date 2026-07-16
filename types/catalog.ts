export interface Category {
    id: string
    name: string
    slug: string
}

export interface Course {
    id: string
    title: string
    slug: string
    summary: string | null
    description: string | null
    level: string
    status: string
    cover_media_id: string | null
    cover_image_url: string | null
    is_free: boolean
    price_amount: number | null
    price_currency: string | null
    prices?: Array<{ currency: string; amount: number }>
    category: { id: string; name: string } | null
    published_at: string | null
}
