export function getDuration(ms: number): string {
    const date: Date = new Date(ms);
    let str: string = "";
    str += date.getUTCDate() - 1 + " days, ";
    str += date.getUTCHours() + " hours, ";
    str += date.getUTCMinutes() + " minutes, ";
    str += date.getUTCSeconds() + " seconds, ";
    str += date.getUTCMilliseconds() + " millis";
    return str;
}