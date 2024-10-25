// priority: -10000000

(function () {
	let hasLoaded = false;

	ServerEvents.tick(event => {
		if (hasLoaded) {
			return;
		}

		StartupLogger.instances.forEach(logger => {
			event.server.players.toArray().find(player => player.username == 'Desynq').tell(logger.message);
		})
		hasLoaded = true;
	});
})();