/** Convert a YouTube/Vimeo watch URL to its embeddable form. */
export function toEmbedUrl(url: string): string {
    const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
    if (youtube) {
        return `https://www.youtube.com/embed/${youtube[1]}`
    }
    const vimeo = url.match(/vimeo\.com\/(\d+)/)
    if (vimeo) {
        return `https://player.vimeo.com/video/${vimeo[1]}`
    }
    return url
}
