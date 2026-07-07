export interface ApiEnvelope<T> {
    data: T
}

export interface ApiCollectionMeta {
    current_page: number
    per_page: number
    total: number
    last_page: number
}
