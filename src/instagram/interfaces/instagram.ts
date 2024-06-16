interface CarouselNode {
    node: ShortCodeMedia
}

interface Carousel {
    edges: CarouselNode[];
}

export interface ShortCodeMedia {
    video_url?: string;
    display_url?: string;
    edge_sidecar_to_children?: Carousel;
}

export interface InstagramPost {
    data: {
        xdt_shortcode_media: ShortCodeMedia;
    }
}

export interface MediaItem {
    media: string;
    type: string;
}