interface Video {
    url: string;
}

interface Item {
    video_versions?: Video[];
}

export interface InstagramJsonPost {
    items?: Item[];
}