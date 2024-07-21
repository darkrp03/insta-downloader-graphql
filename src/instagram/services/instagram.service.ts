import "reflect-metadata";
import { InstagramGraphql } from "../../configs/graphql";
import { InstagramPost, MediaItem, ShortCodeMedia } from "../interfaces/instagram";
import { injectable } from "inversify";
import fs from "fs";

@injectable()
export class InstagramService {
    private readonly token: string;

    constructor() {
        this.token = process.env.SCRAPE_TOKEN as string;
    }

    async getMedia(id: string): Promise<MediaItem | MediaItem[] | undefined> {
        const instagramResponse = await this.getMediaDataUsingGraphQl(id);
        const post = instagramResponse.data.xdt_shortcode_media;

        if (post.edge_sidecar_to_children) {
            return this.parseCarousel(instagramResponse);
        }

        if (post.video_url) {
            return this.parseVideo(post);
        }

        if (post.display_url) {
            return this.parsePhoto(post);
        }
    }
    
    private async getMediaDataUsingGraphQl(id: string): Promise<InstagramPost> {
        const instagramUrl = `https://www.instagram.com/api/graphql`;
        const instagramGraphQl = new InstagramGraphql();

        const headers = instagramGraphQl.getGraphqlHeaders();
        const graphqlData = instagramGraphQl.getPostGraphqlQueryString(id as string);

        const response = await fetch(instagramUrl, {
            method: 'POST',
            headers: headers,
            body: graphqlData
        });

        if (!response.body) {
            throw new Error('Cannot to load the response body!');
        }

        fs.writeFileSync('test.json', await response.text());

        const data = await response.json() as InstagramPost;

        return data;
    }

    private parseVideo(media: ShortCodeMedia): MediaItem {
        const videoUrl = media.video_url;

        if (!videoUrl) {
            throw new Error('Empty video_url property!');
        }

        return {
            media: videoUrl,
            type: 'video'
        };
    }

    private parsePhoto(media: ShortCodeMedia): MediaItem {
        const photoUrl = media.display_url;

        if (!photoUrl) {
            throw new Error('Empty display_url property!');
        }

        return {
            media: photoUrl,
            type: 'photo'
        };
    }

    private parseCarousel(instagramResponse: InstagramPost): MediaItem[] {
        const carousel = instagramResponse.data.xdt_shortcode_media.edge_sidecar_to_children;

        if (!carousel) {
            throw new Error('Empty edge_sidecar_to_children value!');
        }

        const media: MediaItem[] = [];

        for (const edge of carousel.edges) {
            const node = edge.node;
            const mediaItem = this.getPhotoOrVideo(node);

            if (!mediaItem) {
                continue;
            }

            media.push(mediaItem);
        }

        return media;
    }

    private getPhotoOrVideo(node: ShortCodeMedia): MediaItem | undefined {
        if (node.video_url) {
            const video = this.parseVideo(node);

            return video;
        }

        if (node.display_url) {
            const photo = this.parsePhoto(node);
            
            return photo
        }
    }
}