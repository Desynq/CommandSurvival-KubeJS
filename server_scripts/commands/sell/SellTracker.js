// priority: 2

const SellTracker = {}

/**
 * @param {$MinecraftServer_} server
 * @param {string} item
 * @returns {number}
 */
SellTracker.getSold = function (server, item)
{
	return server.persistentData.getCompound('items_sold').getInt(item);
}

/**
 * @param {$MinecraftServer_} server
 * @param {string} item 
 * @param {number} newAmount 
 */
SellTracker.updateSold = function (server, item, newAmount)
{
	let compoundTag = server.persistentData.getCompound('items_sold');

	if (compoundTag.empty)
	{
		server.persistentData.put('items_sold', new $CompoundTag());
		compoundTag = server.persistentData.getCompound('items_sold');
	}

	compoundTag.putInt(item, newAmount);
}

/**
 * @param {$MinecraftServer_} server
 * @param {string} item 
 * @param {number} amount 
 */
SellTracker.addSold = function (server, item, amount)
{
	let currentAmount = SellTracker.getSold(server, item);
	SellTracker.updateSold(server, item, currentAmount + amount);
}