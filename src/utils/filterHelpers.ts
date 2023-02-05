import { Player } from "lavaclient";

export async function toggleNightcore(player: Player): Promise<void> {
    await clearFilters(player);
    player.filterStatus.nightcore = !player.filterStatus.nightcore;

    player.filters.timescale = player.filterStatus.nightcore ?
        { speed: 1.125, pitch: 1.125, rate: 1 } : undefined;
    await player.setFilters();
}

export async function toggleDaycore(player: Player): Promise<void> {
    await clearFilters(player);
    player.filterStatus.daycore = !player.filterStatus.daycore;

    player.filters.lowPass = player.filterStatus.daycore ?
        { smoothing: 20.0 } : undefined;
    await player.setFilters();
}

export async function toggleKaraoke(player: Player): Promise<void> {
    await clearFilters(player);
    player.filterStatus.karaoke = !player.filterStatus.karaoke;

    player.filters.karaoke = player.filterStatus.karaoke ?
        {
            level: 1.0,
            monoLevel: 1.0,
            filterBand: 220.0,
            filterWidth: 100.0
        } : undefined;
    await player.setFilters();
}

export async function toggleVaporWave(player: Player): Promise<void> {
    await clearFilters(player);
    player.filterStatus.vaporwave = !player.filterStatus.vaporwave;

    player.filters.timescale = player.filterStatus.vaporwave ?
        {
            pitch: 0.5,
            rate: 1.0,
            speed: 1.0
        } : undefined;

    player.filters.tremolo = player.filterStatus.vaporwave ?
        {
            depth: 0.3,
            frequency: 14
        } : undefined;

    player.filters.equalizer = player.filterStatus.vaporwave ?
        [
            { band: 1, gain: 0.3 },
            { band: 0, gain: 0.3 }
        ] : undefined;
    await player.setFilters();
}

export async function clearFilters(player: Player): Promise<void> {
    player.filterStatus = {
        nightcore: false,
        daycore: false,
        karaoke: false,
        vaporwave: false
    };
    await player.setFilters({});
}