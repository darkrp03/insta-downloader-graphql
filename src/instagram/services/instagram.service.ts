import axios from "axios";
import { InstagramPost, ShortCodeMedia } from "../interfaces/instagram";
import { GraphqlService } from "./graphql.service";
import { RegexService } from "./regex.service";
import { Media } from "../../shared/interfaces/media";

export class InstagramService {
    private readonly graphQLService: GraphqlService;
    private readonly regexService: RegexService;
    private readonly MAX_FILE_SIZE: number;
    private readonly KILOBYTE_SIZE: number;

    constructor() {
        this.graphQLService = new GraphqlService();
        this.regexService = new RegexService();

        this.MAX_FILE_SIZE = 50;
        this.KILOBYTE_SIZE = 1024;
    }

    async getMedia(url: string): Promise<Media[] | undefined> {
        const id = this.regexService.getPostId(url);

        if (!id) {
            return;
        }

        const instagramResponse = await this.getMediaData(id);
        const media = await this.parseAllMedia(instagramResponse);
   
        return media;
    }
    
    private async getMediaData(id: string): Promise<InstagramPost> {
        const instagramUrl = 'https://www.instagram.com/api/graphql'
        const graphQLData = this.graphQLService.getGraphqlData(id);

        const response = await axios.post(instagramUrl, graphQLData.body, {
            headers: graphQLData.headers
        });

        if (!response.data) {
            throw new Error('Cannot to load the response body!');
        }

        return response.data;
    }

    private async parseAllMedia(instagramResponse: InstagramPost): Promise<Media[] | undefined> {
        let shortCodeMedia = instagramResponse.data?.xdt_shortcode_media;

        if (!shortCodeMedia) {
            return;
        }

        const edges = shortCodeMedia.edge_sidecar_to_children

        if (edges) {
            return await this.parseCarousel(shortCodeMedia);
        }

        const media = await this.parseSingleMedia(shortCodeMedia);

        if (!media) {
            return;
        }

        return [media];
    }

    private async parseCarousel(shortcodeMedia: ShortCodeMedia): Promise<Media[]> {
        const mediaElements: Media[] = [];
        const edges = shortcodeMedia.edge_sidecar_to_children.edges;

        for (const edge of edges) {
            const node = edge.node;
            const media = await this.parseSingleMedia(node);

            if (!media) {
                continue;
            }

            mediaElements.push(media);
        }

        return mediaElements.slice(0, 10);
    }

    private async parseSingleMedia(shortcodeMedia: ShortCodeMedia): Promise<Media | undefined> {
        let type: MediaType;
        let url: string | undefined;

        type = shortcodeMedia.video_url ? 'video' : 'photo';

        url = shortcodeMedia.video_url 
            ? shortcodeMedia.video_url 
            : shortcodeMedia.display_resources?.at(0)?.src;

        if (!url) {
            return;
        }

        const response = await axios.get(url, {
            responseType: 'stream'
        });

        const size = parseInt(response.headers["content-length"]) / this.KILOBYTE_SIZE / this.KILOBYTE_SIZE;

        if (size > this.MAX_FILE_SIZE) {
            return;
        }

        return {
            type: type,
            media: {
                source: response.data
            }
        };
    }
}