export interface ShortCodeMedia {
    video_url?: string;
}

export interface InstagramPost {
    graphql: {
        shortcode_media: ShortCodeMedia;
    }
}

export interface InstagramPost1 {
    data: {
        xdt_shortcode_media: ShortCodeMedia;
    }
}