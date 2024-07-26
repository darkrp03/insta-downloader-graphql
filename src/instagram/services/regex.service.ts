export class RegexService {
    static getReelsInfoFromUrl(url: string): string | undefined {
        const reelRegex = /^https:\/\/(?:www\.)?instagram\.com\/reels?\/([a-zA-Z0-9_-]+)\/?/;
        
        return this.getRegexValue(url, reelRegex);
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

