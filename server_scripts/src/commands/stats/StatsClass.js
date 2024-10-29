// priority: 0


/**
 * @typedef {"attack_damage" | "attack_speed" | "max_health" | "movement_speed" | "luck" | "agility"} StatId
 */
const StatIds = Object.freeze({
	/**
	 * Attack Damage (+2.5% per point)
	 * - #### Ignore armor
	 */
	strength: "strength",
	/**
	 * Max Health (+0.5 per point)
	 * - #### Prevent death once per life if 20+ points invested and >=30% of total points
	 */
	constitution: "constitution",
	/**
	 * Luck
	 * Bonus Loot
	 * Critical Bonus Damage (+2.5% per point)
	 * - #### Players within 16 blocks will glow if 20+ points invested and >=30% of total points
	 */
	perception: "perception",
	/**
	 * Movement Speed (+0.005 per point)
	 * Dodge Chance
	 */
	agility: "agility",
	/**
	 * Attack Speed
	 */
	dexterity: "dexterity",
	/**
	 * Knockback Resistance
	 * Lung Capacity
	 * Armor Toughness
	 */
	endurance: "endurance",
});

const Stats = (function () {
	Class.MAIN_KEY = "attribute_points";
	Class.TOTAL_POINTS_KEY = "total_points";
	Class.STATS_KEY = "stats";

	Class.INITIAL_POINT_COST = 100;

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
		statsCompound.allKeys.forEach(key =>
		{
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
	Class.prototype.addPoints = function (amount)
	{
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
	 * @param {number} amount 
	 * @returns {"SUCCESS" | "NOT_ENOUGH_MONEY"}
	 */
	Class.prototype.buyPoints = function (amount) {
		const cost = this.getNextPointValue();
		let money = PlayerMoney.get(server, this.playerStringUUID);
		if (money < cost)
		{
			return "NOT_ENOUGH_MONEY";
		}
		money -= cost;
		PlayerMoney.set(server, this.playerStringUUID, money);
		this.addPoints(1);
		return "SUCCESS";
	}

	Class.prototype.resetStats = function () {
		const playerCompound = this.getPlayerCompound();
		playerCompound.remove(Class.STATS_KEY);
		this.updatePlayerCompound(playerCompound);
	}

	/**
	 * 
	 * @param {keyof StatId} statId 
	 * @param {name} amount 
	 * @returns {"SUCCESS" | "NOT_ENOUGH_POINTS"}
	 */
	Class.prototype.spendPoints = function (statId, amount) {
		const statsCompound = this.getStatsCompound();
		const sparePoints = this.getSparePoints();
		if (amount > sparePoints)
		{
			return "NOT_ENOUGH_POINTS";
		}

		const newAmount = this.getPointsFromStat(statId) + amount;
		statsCompound.putInt(statId, newAmount);

		this.updateStatsCompound(statsCompound);
		return "SUCCESS";
	}

	/**
	 * @description Apply the attribute modifiers from the attribute point system to the player
	 * - Should be called whenever the player spends an attribute point, resets their attribute points, or respawns/rejoins
	 */
	Class.prototype.applyStats = function () {

	}



	return Class;
}
)();