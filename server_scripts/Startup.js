// priority: 1000







(function () {
	/** @type {boolean} */
	let hasLoaded = false;

	ServerEvents.tick(event => {
		const { server } = event;
		if (hasLoaded) {
			return;
		}
		hasLoaded = true;

		let playerMoney = new PlayerMoney(Desynq(server));
		playerMoney.add(15);
		Desynq(server).tell(playerMoney.get());
	});
})();