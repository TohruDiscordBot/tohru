export function chunk(items: any[], size: number): any[][] {
    const chunks: any[][] = []
    items = [].concat(...items);

    while (items.length) {
        chunks.push(
            items.splice(0, size)
        );
    }

    return chunks;
}