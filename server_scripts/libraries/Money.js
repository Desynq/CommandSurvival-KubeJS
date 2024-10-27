// priority: 1


function Money() { }

/**
 * 
 * @param {number} number 
 * @returns {number}
 */
Money.FromDollar = function (number)
{
	return number * 100;
}

/**
 * @param {number} number
 * @returns {number}
 */
Money.ToDollar = function (number)
{
	return number / 100;
}

/**
 * Converts the inputted number to "x.xx" format
 * @param {number} number
 * @returns {string}
 */
Money.ToDollarString = function (number)
{
	return `$${Money.ToDollar(number).toFixed(2)}`;
}




const PlayerMoney = {};

/**
 * @param {$MinecraftServer_} server 
 * @param {string} username 
 * @returns 
 */
PlayerMoney.get = function (server, username)
{
	return server.persistentData.getCompound("player_money").getLong(username);
}

/**
 * @param {$MinecraftServer_} server 
 * @param {string} username 
 * @param {number} amount 
 */
PlayerMoney.set = function (server, username, amount)
{
	let compoundTag = server.persistentData.getCompound("player_money");
	if (compoundTag.empty)
	{
		server.persistentData.put("player_money", new $CompoundTag());
		compoundTag = server.persistentData.getCompound("player_money");
	}

	compoundTag.putLong(username, amount);
}

/**
 * @param {$MinecraftServer_} server 
 * @param {string} username 
 * @param {number} amount 
 */
PlayerMoney.add = function (server, username, amount)
{
	const currentMoney = PlayerMoney.get(server, username);
	PlayerMoney.set(server, username, currentMoney + amount);
}