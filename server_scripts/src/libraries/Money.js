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

Money.FromDollarWithCharm = function (number)
{
	return (number - 0.01) * 100;
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
 * Converts the inputted number to "$x.xx" format
 * @param {number} number
 * @returns {string}
 */
Money.ToDollarString = function (number)
{
	if (number < 0)
	{
		return `-$${Money.ToDollar(Math.abs(number)).toFixed(2)}`;
	}
	return `$${Money.ToDollar(number).toFixed(2)}`;
}




const PlayerMoney = {};

/**
 * @param {Internal.MinecraftServer} server 
 * @param {string} stringUUID 
 * @returns 
 */
PlayerMoney.get = function (server, stringUUID)
{
	return server.persistentData.getCompound("player_money").getLong(stringUUID);
}

/**
 * @param {Internal.MinecraftServer} server 
 * @param {string} stringUUID 
 * @param {number} amount 
 */
PlayerMoney.set = function (server, stringUUID, amount)
{
	let compoundTag = server.persistentData.getCompound("player_money");
	if (compoundTag.empty)
	{
		server.persistentData.put("player_money", new $CompoundTag());
		compoundTag = server.persistentData.getCompound("player_money");
	}

	compoundTag.putLong(stringUUID, amount);
}

/**
 * @param {Internal.MinecraftServer} server 
 * @param {string} stringUUID 
 * @param {number} amount 
 */
PlayerMoney.add = function (server, stringUUID, amount)
{
	const currentMoney = PlayerMoney.get(server, stringUUID);
	PlayerMoney.set(server, stringUUID, currentMoney + amount);
}