import { Player } from "lavaclient";

export async function toggleNightcore(player: Player): Promise<boolean> {
    player.filterStatus.nightcore = !player.filterStatus.nightcore;

    player.filters.timescale = player.filterStatus.nightcore ?
        { speed: 1.125, pitch: 1.125, rate: 1 } : undefined;
    await player.setFilters();
    return player.filterStatus.nightcore;
}