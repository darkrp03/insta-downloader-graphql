import "reflect-metadata";
import axios from "axios";
import { InstagramGraphql } from "../../configs/graphql";
import { InstagramPost, MediaItem, ShortCodeMedia } from "../interfaces/instagram";
import { injectable } from "inversify";

@injectable()
export class InstagramService {
    private getRegexValue(url: string, regex: RegExp): string | undefined {
        const check = url.match(regex);

        let id: string | undefined;

        if (check) {
            id = check.at(-1);
        }

        return id;
    }

    private async getMediaDataUsingGraphQl(id: string): Promise<InstagramPost> {
        const instagramUrl = `https://www.instagram.com/api/graphql`;
        const instagramGraphQl = new InstagramGraphql();

        const headers = instagramGraphQl.getGraphqlHeaders();
        const graphqlData = instagramGraphQl.getPostGraphqlQueryString(id as string);

        const response = await axios.post(instagramUrl, graphqlData, {
            headers: headers
        })

        const data = response.data as InstagramPost;

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

            if (node.video_url) {
                const video = this.parseVideo(edge.node);
                media.push(video);

                continue;
            }

            if (node.display_url) {
                const photo = this.parsePhoto(edge.node);
                media.push(photo);

                continue;
            }
        }

        return media;
    }

    async getMedia(id: string): Promise<MediaItem[]> {
        const instagramResponse = await this.getMediaDataUsingGraphQl(id);
        const instagramMedia: MediaItem[] = [];

        const post = instagramResponse.data.xdt_shortcode_media;

        if (post.edge_sidecar_to_children) {
            return this.parseCarousel(instagramResponse);
        }

        if (post.video_url) {
            const video = this.parseVideo(post);

            instagramMedia.push(video);
        }

        if (post.display_url) {
            const photo = this.parsePhoto(post);

            instagramMedia.push(photo);
        }

        return instagramMedia;
    }

    getReelsInfoFromUrl(url: string): string | undefined {
        const reelRegex = /^https:\/\/(?:www\.)?instagram\.com\/reels?\/([a-zA-Z0-9_-]+)\/?/;
        
        return this.getRegexValue(url, reelRegex);
    }

    getPostInfoFromUrl(url: string): string | undefined {
        const postRegex = /^https:\/\/(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?/;

        return this.getRegexValue(url, postRegex);
    }
}