export class RegexService {
    getReelsInfoFromUrl(url: string): string | undefined {
        const reelRegex = /^https:\/\/(?:www\.)?instagram\.com\/reels?\/([a-zA-Z0-9_-]+)\/?/;
        const postRegex = /^https:\/\/(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?(?:\?.*)?$/;

        let id: string | undefined = this.getId(url, reelRegex);
        id = id ? id : this.getId(url, postRegex)
        
        return id;
    }
    
    private getId(url: string, regex: RegExp): string | undefined {
        const check = url.match(regex);

        let id: string | undefined;

        if (check) {
            id = check.at(-1);
        }

        return id;
    }
}

