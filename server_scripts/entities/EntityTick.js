// priority: 0

import { $MinecraftServer } from "packages/net/minecraft/server/$MinecraftServer";
import { $Entity } from "packages/net/minecraft/world/entity/$Entity";


ServerEvents.tick(event => {
	const { server } = event;

	let entities = server.entities.toArray();

	entities.forEach(entity => EntityTick(entity, server));
});

/**
 * 
 * @param {$Entity} entity 
 * @param {$MinecraftServer} server
 */
function EntityTick(entity, server) {
	if (entity.type == 'minecraft:zombie' && entity.team == null) {
		server.runCommandSilent(`team join zombies ${entity.stringUUID}`);
	}
}