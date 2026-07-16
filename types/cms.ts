export type CmsContentType = 'page' | 'post'

export interface CmsContent {
    id: string
    type: CmsContentType
    title: string
    slug: string
    body: string
    seo_title: string | null
    seo_description: string | null
    status: 'draft' | 'published'
    published_at: string | null
    updated_at: string | null
}

export interface MenuItem {
    label: string
    url: string
}

export interface PublicMenu {
    institution: { name: string; slug: string }
    items: MenuItem[]
}

export interface PublicPostSummary {
    title: string
    slug: string
    seo_description: string | null
    published_at: string | null
}
