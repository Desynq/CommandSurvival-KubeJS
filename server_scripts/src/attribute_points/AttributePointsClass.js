// priority: 0

/*
server persistent data
{
	attribute_points: {
		<player_string_uuid>: {
			total_points: int,
			attributes: {
				string: int
			}
		}
	}
}
*/


const AttributePoints = (function ()
{
	Class.MAIN_KEY = "attribute_points";
	Class.TOTAL_POINTS_KEY = "total_points";
	Class.ATTRIBUTES_KEY = "attributes";

	Class.INITIAL_POINT_COST = 100;

	Class.prototype.server = undefined;
	Class.prototype.playerStringUUID = undefined;

	/**
	 * @param {Internal.MinecraftServer} server 
	 * @param {string} playerStringUUID
	 */
	function Class(server, playerStringUUID)
	{
		this.server = server;
		this.playerStringUUID = playerStringUUID;
	}

	Class.prototype.getPlayerCompound = function ()
	{
		return this.server.persistentData.getCompound(Class.MAIN_KEY).getCompound(this.playerStringUUID);
	}

	/**
	 * 
	 * @param {Internal.CompoundTag} compound 
	 */
	Class.prototype.updatePlayerCompound = function (compound)
	{
		const rootCompound = this.server.persistentData.getCompound(Class.MAIN_KEY);
		rootCompound.put(this.playerStringUUID, compound);
		this.server.persistentData.put(Class.MAIN_KEY, rootCompound);
	}

	Class.prototype.getTotalPoints = function ()
	{
		return this.server.persistentData.getCompound(Class.MAIN_KEY).getCompound(this.playerStringUUID).getInt(Class.TOTAL_POINTS_KEY);
	}

	Class.prototype.getSpentPoints = function ()
	{
		const attributesCompound = this.getPlayerCompound().getCompound(Class.ATTRIBUTES_KEY);

		let spentPoints = 0;
		attributesCompound.allKeys.forEach(key =>
		{
			spentPoints += attributesCompound.getInt(key);
		});
		return spentPoints;
	}

	Class.prototype.getSparePoints = function ()
	{
		return this.getTotalPoints() - this.getSpentPoints();
	}

	/**
	 * 
	 * @param {string} attributeName 
	 */
	Class.prototype.getPointsFromAttribute = function (attributeName)
	{
		return this.getPlayerCompound().getCompound(Class.ATTRIBUTES_KEY).getInt(attributeName);
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

	Class.prototype.getNextPointValue = function ()
	{
		return Class.INITIAL_POINT_COST * this.getTotalPoints();
	}

	/**
	 * 
	 * @param {number} amount 
	 */
	Class.prototype.buyPoints = function (amount)
	{
		const totalPoints = this.getTotalPoints();
	}

	Class.prototype.resetPoints = function ()
	{ }

	Class.prototype.spendPoints = function (amount, attributeName)
	{ }

	/**
	 * Apply the attribute modifiers from the attribute point system to the player
	 * - Should be called whenever the player spends an attribute point, resets their attribute points, or respawns/rejoins
	 */
	Class.prototype.applyAttributes = function ()
	{ }



	return Class;
}
)();