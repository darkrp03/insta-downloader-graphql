import axios from "axios";
import fs from "fs";
import { InstagramGraphQLPost, ShortCodeMedia } from "../interfaces/instagram.graphql";
import { GraphqlService } from "./graphql.service";
import { RegexService } from "./regex.service";
import { Media } from "../../shared/interfaces/media";

export class InstagramService {
    private readonly token: string;
    private readonly graphQLService: GraphqlService;
    private readonly regexService: RegexService;

    constructor() {
        const token = process.env.SCRAPE_TOKEN

        if (!token) {
            throw new Error('Empty scrape token!');;
        }

        this.token = token;
        this.graphQLService = new GraphqlService();
        this.regexService = new RegexService();
    }

    async getMedia(url: string): Promise<Media[] | undefined> {
        const id = this.regexService.getReelsInfoFromUrl(url);

        if (!id) {
            return;
        }

        const instagramResponse = await this.getMediaData(id);
        const media = await this.parseAllMedia(instagramResponse);
   
        return media;
    }
    
    private async getMediaData(id: string): Promise<InstagramGraphQLPost> {
        const instagramUrl = 'https://www.instagram.com/api/graphql'
        const encodedScraperToken = encodeURIComponent(this.token);

        const url = `http://api.scrape.do?token=${encodedScraperToken}&url=${instagramUrl}&customHeaders=true`;
        const graphQLData = this.graphQLService.getGraphqlData(id);

        const response = await axios.post(url, graphQLData.body, {
            headers: graphQLData.headers
        });

        if (!response.data) {
            throw new Error('Cannot to load the response body!');
        }

        fs.writeFileSync('test.json', JSON.stringify(response.data))

        return response.data;
    }

    // private async getMediaDataFromJson(instagramUrl: string): Promise<string | undefined> {
    //     instagramUrl = instagramUrl.split('?')[0];

    //     if (!instagramUrl) {
    //         return;
    //     }

    //     instagramUrl = instagramUrl + '?__a=1&__d=dis';

    //     const encodedScraperToken = encodeURIComponent(this.token);
    //     const url = `http://api.scrape.do?token=${encodedScraperToken}&url=${instagramUrl}`;

    //     const response = await axios.get(url);

    //     if (!response.data) {
    //         throw new Error('Cannot to load the response body!');
    //     }

    //     const videoUrl: string = response.data;


    // }

    private async parseAllMedia(instagramResponse: InstagramGraphQLPost): Promise<Media[] | undefined> {
        const shortCodeMedia = instagramResponse.data.xdt_shortcode_media;
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
            responseType: 'arraybuffer'
        });

        return {
            type: type,
            media: {
                source: response.data
            }
        };
    }
}