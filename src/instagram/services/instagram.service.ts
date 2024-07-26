import "reflect-metadata";
import { InstagramPost1, ShortCodeMedia } from "../interfaces/instagram";
import { injectable } from "inversify";
import { GraphqlService } from "./graphql.service";
import fs from "fs"

@injectable()
export class InstagramService {
    private readonly token: string;

    constructor() {
        this.token = process.env.SCRAPE_TOKEN as string;
    }

    async getMedia(id: string): Promise<string | undefined> {
        const instagramResponse = await this.getMediaData(id);
        const post = instagramResponse.data.xdt_shortcode_media;

        return this.parseVideo(post);
    }
    
    private async getMediaData(id: string): Promise<InstagramPost1> {
        const instagramUrl = 'https://www.instagram.com/api/graphql'
        const encodedInstagramUrl = encodeURIComponent(`https://www.instagram.com/p/${id}/?__a=1&__d=dis`);
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

        // fs.writeFileSync('test.txt', JSON.stringify(await response.text()))

        const data = await response.json();

        return data;
    }

    private parseVideo(media: ShortCodeMedia): string | undefined {
        const videoUrl = media.video_url;

        return videoUrl;
    }
}