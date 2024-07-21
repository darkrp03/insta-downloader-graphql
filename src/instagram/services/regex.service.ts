export class RegexService {
    static getReelsInfoFromUrl(url: string): string | undefined {
        const reelRegex = /^https:\/\/(?:www\.)?instagram\.com\/reels?\/([a-zA-Z0-9_-]+)\/?/;
        
        return this.getRegexValue(url, reelRegex);
    }
    
    static getPostInfoFromUrl(url: string): string | undefined {
        const postRegex = /^https:\/\/(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?/;
    
        return this.getRegexValue(url, postRegex);
    }

    private static getRegexValue(url: string, regex: RegExp): string | undefined {
        const check = url.match(regex);

        let id: string | undefined;

        if (check) {
            id = check.at(-1);
        }

        return id;
    }
}

