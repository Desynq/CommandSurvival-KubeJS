// priority: 0

/**
 * 
 * @param {Internal.Entity} entity 
 * @param {Internal.MinecraftServer} server
 */
// function EntityTick(entity, server) {
// 	if (entity.type == 'minecraft:zombie' && entity.team == null) {
// 		server.runCommandSilent(`team join zombies ${entity.stringUUID}`);
// 	}

// 	if (entity.level.dimension == "twilight_forest:twilight_forest")
// 	{
// 		TwilightForest();
// 	}

// 	function TwilightForest()
// 	{
		
// 	}

// 	if (entity.tags.toArray().indexOf("boss") !== 0)
// 	{
// 		let bossbarId = `boss:${entity.stringUUID}`;
// 		let bossbar = server.customBossEvents.get(bossbarId);
// 		if (bossbar == null)
// 		{
			
// 		}
// 	}
// }

const EntityTick = (function ()
{
	Class.prototype.server = undefined;
	Class.prototype.entity = undefined;
	Class.prototype.entityType = undefined;
	/**
	 * 
	 * @param {Internal.Entity} entity 
	 * @param {Internal.MinecraftServer} server 
	 */
	function Class(entity, server)
	{
		this.server = server;
		this.entity = entity;

		if (this.entity.living)
		{
			this.tickLivingEntity();
			return;
		}
		this.tickNonlivingEntity();
	}

	Class.prototype.tickLivingEntity = function ()
	{
		if (this.entity.type == "minecraft:zombie" && this.entity.team == null)
		{
			this.server.runCommandSilent(`team join zombies ${this.entity.uuid.toString()}`);
		}
	}

	Class.prototype.tickNonlivingEntity = function ()
	{
		if (this.entity.type == "minecraft:item")
		{
			this.tickItemEntity();
		}
	}

	Class.prototype.tickItemEntity = function ()
	{
		/** @type {Internal.ItemEntity} */
		this.entity;

		if (this.entity.item.id == "minecraft:netherrack" && this.entity.age > 100)
		{
			this.entity.remove("discarded");
		}
	}



	return Class;
})();







ServerEvents.tick(event =>
{
	const { server } = event;

	let entities = server.entities.toArray();

	entities.forEach(entity => new EntityTick(entity, server));
});