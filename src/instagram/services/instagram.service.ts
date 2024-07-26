import "reflect-metadata";
import { InstagramPost, ShortCodeMedia } from "../interfaces/instagram";
import { injectable } from "inversify";
import { GraphqlService } from "./graphql.service";

@injectable()
export class InstagramService {
    private readonly token: string;

    constructor() {
        const token = process.env.SCRAPE_TOKEN

        if (!token) {
            throw new Error('Empty scrape token!');;
        }

        this.token = token;
    }

    async getReelUrl(id: string): Promise<string | undefined> {
        const instagramResponse = await this.getMediaData(id);
        const post = instagramResponse.data.xdt_shortcode_media;

        return post.video_url;
    }
    
    private async getMediaData(id: string): Promise<InstagramPost> {
        const instagramUrl = 'https://www.instagram.com/api/graphql'
        const encodedScraperToken = encodeURIComponent(this.token);

        const url = `http://api.scrape.do?token=${encodedScraperToken}&url=${instagramUrl}&customHeaders=true`;
        const response = await fetch(url, {
            method: 'POST',
            headers: GraphqlService.getHeaders(),
            body: GraphqlService.getGraphqlBody(id)
        });

        if (!response.body) {
            throw new Error('Cannot to load the response body!');
        }

        const data = await response.json();

        return data;
    }
}