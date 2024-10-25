// priority: 0

import { $MinecraftServer } from "packages/net/minecraft/server/$MinecraftServer";
import { $Player } from "packages/net/minecraft/world/entity/player/$Player";


PlayerEvents.tick(event => {
	const { player, server } = event;

	if (player.username == 'Desynq') {
		server.players.forEach(aPlayer => DesynqTickAPlayer(player, server, aPlayer))
	}




	if (player.stats.timeSinceDeath == 1) {
		player.foodLevel = player.persistentData.getFloat('food_level_last_tick');
		player.saturation = player.persistentData.getFloat('saturation_last_tick');
	}

	player.persistentData.putFloat('food_level_last_tick', player.foodLevel);
	player.persistentData.putFloat('saturation_last_tick', player.saturation);



	let lastX = player.persistentData.getDouble('last_x');
	let lastY = player.persistentData.getDouble('last_y');
	let lastZ = player.persistentData.getDouble('last_z');
	let lastYaw = player.persistentData.getFloat('last_yaw');
	let lastPitch = player.persistentData.getFloat('last_pitch');
	
	let hasMoved = player.x != lastX
		|| player.y != lastY
		|| player.z != lastZ
		|| player.yaw != lastYaw
		|| player.pitch != lastPitch;

	server.runCommandSilent(`scoreboard players set ${player.username} is_moving ${Number(hasMoved)}`);


	player.persistentData.putDouble('last_x', player.x);
	player.persistentData.putDouble('last_y', player.y);
	player.persistentData.putDouble('last_z', player.z);
	player.persistentData.putFloat('last_yaw', player.yaw);
	player.persistentData.putFloat('last_pitch', player.pitch);
});


/**
 * @param {$Player} player 
 * @param {$MinecraftServer} server 
 * @param {$Player} aPlayer 
 */
function DesynqTickAPlayer(player, server, aPlayer) {
	if (aPlayer.deathTime == 1) {
		player.heal(5);
	}
}