// priority: 0

const CustomStats = (function () {
	Class.MAIN_KEY = "player_stats";
	Class.TOTAL_POINTS_KEY = "total_points";
	Class.STATS_KEY = "stats";

	Class.INITIAL_POINT_COST = Money.FromDollar(80.00);

	Class.prototype.server = undefined;
	Class.prototype.playerStringUUID = undefined;

	/**
	 * @param {Internal.MinecraftServer} server 
	 * @param {string} playerStringUUID
	 */
	function Class(server, playerStringUUID) {
		this.server = server;
		this.playerStringUUID = playerStringUUID;
	}

	Class.prototype.getPlayerCompound = function () {
		return this.server.persistentData.getCompound(Class.MAIN_KEY).getCompound(this.playerStringUUID);
	}

	Class.prototype.getStatsCompound = function () {
		return this.getPlayerCompound().getCompound(Class.STATS_KEY);
	}

	/**
	 * 
	 * @param {Internal.CompoundTag} compound 
	 */
	Class.prototype.updatePlayerCompound = function (compound) {
		const rootCompound = this.server.persistentData.getCompound(Class.MAIN_KEY);
		rootCompound.put(this.playerStringUUID, compound);
		this.server.persistentData.put(Class.MAIN_KEY, rootCompound);
	}

	/**
	 * 
	 * @param {Internal.CompoundTag} compound 
	 */
	Class.prototype.updateStatsCompound = function (compound) {
		const playerCompound = this.getPlayerCompound();
		playerCompound.put(Class.STATS_KEY, compound);
		this.updatePlayerCompound(playerCompound);
	}

	Class.prototype.getTotalPoints = function () {
		return this.server.persistentData.getCompound(Class.MAIN_KEY).getCompound(this.playerStringUUID).getInt(Class.TOTAL_POINTS_KEY);
	}

	Class.prototype.getSpentPoints = function () {
		const statsCompound = this.getStatsCompound();

		let spentPoints = 0;
		statsCompound.allKeys.forEach(key => {
			spentPoints += statsCompound.getInt(key);
		});
		return spentPoints;
	}

	Class.prototype.getSparePoints = function () {
		return this.getTotalPoints() - this.getSpentPoints();
	}

	/**
	 * 
	 * @param {StatId} statId 
	 */
	Class.prototype.getPointsFromStat = function (statId) {
		return this.getPlayerCompound().getCompound(Class.STATS_KEY).getInt(statId);
	}

	/**
	 * 
	 * @param {number} amount 
	 */
	Class.prototype.addPoints = function (amount) {
		let totalPoints = this.getTotalPoints();
		totalPoints += amount;

		const playerCompound = this.getPlayerCompound();
		playerCompound.putInt(Class.TOTAL_POINTS_KEY, totalPoints);
		this.updatePlayerCompound(playerCompound);
	}

	Class.prototype.getNextPointValue = function () {
		return Class.INITIAL_POINT_COST * this.getTotalPoints();
	}

	/**
	 * 
	 * @returns {"SUCCESS" | "NOT_ENOUGH_MONEY"}
	 */
	Class.prototype.buyPoint = function () {
		const cost = this.getNextPointValue();
		let money = PlayerMoney.get(this.server, this.playerStringUUID);
		if (money < cost) {
			return "NOT_ENOUGH_MONEY";
		}
		money -= cost;
		PlayerMoney.set(this.server, this.playerStringUUID, money);
		this.addPoints(1);
		return "SUCCESS";
	}

	Class.prototype.resetStats = function () {
		const playerCompound = this.getPlayerCompound();
		playerCompound.remove(Class.STATS_KEY);
		this.updatePlayerCompound(playerCompound);
		this.applyStats();
	}

	/**
	 * 
	 * @param {StatId} statId 
	 * @param {name} amount 
	 * @returns {"SUCCESS" | "NOT_ENOUGH_POINTS" | "AMOUNT_NOT_VALID" | "STAT_DOES_NOT_EXIST"}
	 */
	Class.prototype.spendPoints = function (statId, amount) {
		if (amount <= 0) {
			return "AMOUNT_NOT_VALID";
		}
		if (CustomStatData[statId] == null) {
			return "STAT_DOES_NOT_EXIST";
		}

		const sparePoints = this.getSparePoints();
		if (amount > sparePoints) {
			return "NOT_ENOUGH_POINTS";
		}

		const statsCompound = this.getStatsCompound();
		const newAmount = this.getPointsFromStat(statId) + amount;
		statsCompound.putInt(statId, newAmount);

		this.updateStatsCompound(statsCompound);
		this.applyStats();
		return "SUCCESS";
	}

	/**
	 * @description Apply the attribute modifiers from the attribute point system to the player
	 * - Should be called whenever the player spends an attribute point, resets their attribute points, or respawns/rejoins
	 */
	Class.prototype.applyStats = function () {
		const player = this.server.players.toArray().find(player => player.uuid.toString() == this.playerStringUUID);
		this.applyStrength(player);
		this.applyConstitution(player);
		this.applyPerception(player);
	}

	/**
	 * @param {Internal.Player} player
	 */
	Class.prototype.applyStrength = function (player) {
		const points = this.getPointsFromStat(String(CustomStatData.strength));
		const newValue = points * 0.025;

		const helper = new AttributeModifierHelper(player, $Attributes.ATTACK_DAMAGE, CustomStatData.strength.modifierUUID, CustomStatData.strength.modifierName);
		const oldValue = helper.getModifierValue();
		if (newValue != oldValue) {
			helper.removeModifier();
			helper.addModifier(newValue, "multiply_total");
		}
	}

	/**
	 * @param {Internal.Player} player
	 */
	Class.prototype.applyConstitution = function (player) {
		const points = this.getPointsFromStat(String(CustomStatData.constitution));
		const newValue = points;

		const helper = new AttributeModifierHelper(player, $Attributes.MAX_HEALTH, CustomStatData.constitution.modifierUUID, CustomStatData.constitution.modifierName);
		const oldValue = helper.getModifierValue();
		if (newValue != oldValue) {
			helper.removeModifier();
			helper.addModifier(newValue, "multiply_total");
			helper.updateHealth();
		}
	}

	/**
	 * @param {Internal.Player} player
	 */
	Class.prototype.applyPerception = function (player) {
		const points = this.getPointsFromStat(String(CustomStatData.perception));
		const newValue = points;

		const helper = new AttributeModifierHelper(player, $Attributes.MAX_HEALTH, CustomStatData.perception.modifierUUID, CustomStatData.perception.modifierName);
		const oldValue = helper.getModifierValue();
		if (newValue != oldValue) {
			helper.removeModifier();
			helper.addModifier(newValue, "multiply_total");
			helper.updateHealth();
		}
	}

	/**
	 * @param {Internal.Player} player 
	 * @param {number} amountPerPoint
	 * @param {Internal.Attribute} attribute 
	 * @param {StatId} statId 
	 * @param {Internal.AttributeModifier$Operation_}
	 * @param {boolean} updateHealth 
	 */
	Class.prototype.applyGenericAttribute = function (player, amountPerPoint, attribute, statId, operation, updateHealth) {}



	/**
	 * 
	 * @param {Internal.CommandContext<Internal.CommandSourceStack>} context 
	 */
	Class.buyPointCommand = function (context) {
		const server = context.source.server;
		const player = context.source.player;
		const customStats = new Class(server, player.uuid.toString());

		const moneyString = Money.ToDollarString(PlayerMoney.get(server, player));
		const cost = customStats.getNextPointValue();
		const result = customStats.buyPoint();
		switch (result) {
			case "NOT_ENOUGH_MONEY":
				player.tell(`Buying the next stat point costs ${cost}, you only have ${moneyString}.`);
				break;
			case "SUCCESS":
				player.tell(`Bought a stat point for ${Money.ToDollarString(cost)}.`);
				break;
		}
		return 1;
	}

	/**
	 * 
	 * @param {Internal.CommandContext<Internal.CommandSourceStack>} context 
	 */
	Class.resetPointsCommand = function (context) {
		const { server, player } = context.source;
		const stats = new Class(server, player.uuid.toString());

		stats.resetStats();
		player.tell("Successfully reset stats");
		return 1;
	}

	/**
	 * 
	 * @param {Internal.CommandContext<Internal.CommandSourceStack>} context 
	 */
	Class.spendPointsCommand = function (context) {
		const { server, player } = context.source;
		/** @type {string} */
		const statId = $Arguments.STRING.getResult(context, Class.STAT_ID_ARG_KEY);
		/** @type {number} */
		const amount = $Arguments.INTEGER.getResult(context, Class.AMOUNT_ARG_KEY);

		const stats = new Class(server, player.uuid.toString());

		const result = stats.spendPoints(statId, amount);
		switch (result) {
			case "AMOUNT_NOT_VALID":
				player.tell("Amount must be greater than or equal to 0");
				break;
			case "STAT_DOES_NOT_EXIST":
				player.tell("Stat does not exist.");
				break;
			case "NOT_ENOUGH_POINTS":
				player.tell("Not enough points.")
				break;
			case "SUCCESS":
				player.tell(`Added ${amount} point(s) to ${statId}`);
				break;
		}
		return 1;
	}

	/**
	 * @param {Internal.CommandContext<Internal.CommandSourceStack>} context
	 */
	Class.infoCommand = function (context) {
		const { server, player } = context.source;
		const stats = new Class(server, player.uuid.toString());

		const text = JsonIO.readString("kubejs/server_scripts/src/commands/stats/info.json");
		server.runCommandSilent(`tellraw ${player.username} ${text}`);
		return 1;
	}


	/**
	 * @param {Internal.CommandContext<Internal.CommandSourceStack>} context
	 * @param {Internal.SuggestionsBuilder} builder
	 */
	Class.suggestStatIds = function (context, builder) {
		for (let statId of Object.values(CustomStatData)) {
			builder.suggest(CustomStatData[statId]);
		}
		return builder.buildFuture();
	}


	Class.STAT_ID_ARG_KEY = "stat_id";
	Class.AMOUNT_ARG_KEY = "amount";
	/**
	 * 
	 * @param {Internal.CommandRegistryEventJS} event 
	 */
	Class.registerCommand = function (event) {
		const command = ($Commands.literal("stats")
			.then(
				$Commands.literal("buy")
					.executes(context => Class.buyPointCommand(context))
			)
			.then(
				$Commands.literal("reset")
					.executes(context => Class.resetPointsCommand(context))
			)
			// /stats spend <stat_id> <amount>
			.then(
				$Commands.literal("spend")
					.then(
						$Commands.argument(Class.STAT_ID_ARG_KEY, $Arguments.STRING.create(event))
							.suggests((context, builder) => Class.suggestStatIds(context, builder))
							.then(
								$Commands.argument(Class.AMOUNT_ARG_KEY, $Arguments.INTEGER.create(event))
									.executes(context => Class.spendPointsCommand(context))
							)
					)
			)
			.then(
				$Commands.literal("info")
					.executes(context => Class.infoCommand(context))
			)
		);
		event.register(command);
	}



	return Class;
}
)();