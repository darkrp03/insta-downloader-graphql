interface Edge {
    node: ShortCodeMedia;
}

interface DisplayResources {
    src: string;
}

export interface ShortCodeMedia {
    video_url?: string;
    display_resources?: DisplayResources[];
    edge_sidecar_to_children: {
        edges: Edge[]
    };
}

export interface InstagramGraphQLPost {
    data: {
        xdt_shortcode_media: ShortCodeMedia;
    }
}

export interface GraphQLData {
    headers: any;
    body: string;
}