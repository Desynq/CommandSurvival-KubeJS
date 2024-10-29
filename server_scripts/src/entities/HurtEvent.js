EntityEvents.hurt(event => {
	const server = event.server;
	const entity = event.entity;
});



EntityEvents.hurt("minecraft:creeper", event => {
	/** @type {Internal.Creeper} */
	const creeper = event.entity;
	if (creeper.isOnFire && !creeper.ignited) {
		creeper.ignite();
	}
});