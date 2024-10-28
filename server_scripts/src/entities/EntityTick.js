// priority: 0

ServerEvents.tick(event => {
	const { server } = event;

	let entities = server.entities.toArray();

	entities.forEach(entity => EntityTick(entity, server));
});

/**
 * 
 * @param {Internal.Entity} entity 
 * @param {Internal.MinecraftServer} server
 */
function EntityTick(entity, server) {
	if (entity.type == 'minecraft:zombie' && entity.team == null) {
		server.runCommandSilent(`team join zombies ${entity.stringUUID}`);
	}

	if (entity.level.dimension == "twilight_forest:twilight_forest")
	{
		TwilightForest();
	}

	function TwilightForest()
	{
		
	}

	if (entity.tags.toArray().indexOf("boss") !== 0)
	{
		const bossbarId = `boss:${entity.stringUUID}`;
		let bossbar = server.customBossEvents.get(bossbarId);
		if (bossbar == null)
		{
			
		}
	}
}