// priority: 0

ServerEvents.tick(event => {
	const server = event.server;
	const overworld = server.getLevel("minecraft:overworld");

	if (server.gameRules.getBoolean($GameRules.RULE_DAYLIGHT) && overworld.getDayTime() % 24000 == 1)
	{
		everyDawn();
	}



	function everyDawn()
	{
		SellTracker.diminishAll(server, 0.01); // half lost every irl day
		server.players !== null && server.players.toArray().forEach(player => broadcastDawn(player));
	}

	/**
	 * @param {$Player_} player
	 */
	function broadcastDawn(player)
	{
		player.tell(ConcatString(
			"A new dawn rises.\n",
			"All items sold have diminished by 1.00%."
		));
	}
});