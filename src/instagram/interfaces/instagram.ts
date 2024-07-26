export interface ShortCodeMedia {
    video_url?: string;
}

export interface InstagramPost {
    data: {
        xdt_shortcode_media: ShortCodeMedia;
    }
}