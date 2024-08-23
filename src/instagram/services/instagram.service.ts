import "reflect-metadata";
import axios from "axios";
import { InstagramPost } from "../interfaces/instagram";
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
        const body = GraphqlService.getGraphqlBody(id)

        const response = await axios.post(url, body, {
            headers: GraphqlService.getHeaders()
        });

        if (!response.data) {
            throw new Error('Cannot to load the response body!');
        }

        return response.data;
    }
}