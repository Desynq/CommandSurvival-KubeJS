// priority: 2147483646



/**
 * @param {$MinecraftServer_} server
 * @returns {$Player_}
 */
function Desynq(server) {
	return server.players.toArray().find(player => player.username == 'Desynq');
}