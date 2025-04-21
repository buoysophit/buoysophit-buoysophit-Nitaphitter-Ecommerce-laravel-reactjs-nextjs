export function extractEndpoint(url: string): string | null {
    try {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/').filter(part => part !== '');

        if (parts.length > 0) {
            return `/${parts.join('/')}`;
        } else {
            return '#';
        }
    } catch (error) {
        // URL parsing error
        console.error('Error parsing URL:', error);
        return '#';
    }
}
