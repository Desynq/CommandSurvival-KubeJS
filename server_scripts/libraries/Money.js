// priority: 1







/** @type {$Player_} */
PlayerMoney.prototype.player = null;

/** @type {$MinecraftServer_} */
PlayerMoney.prototype.server = null;

/**
 * Money is stored as a long where the last 2 digits are the cents
 * @param {$Player_} player
 * @constructor
 */
function PlayerMoney(player) {
	this.player = player;
	this.server = this.player.server;
}

PlayerMoney.prototype.get = function () {
	return this.server.persistentData.getCompound('player_money').getLong(this.player.username);
}

/**
 * @param {number} newMoney 
 */
PlayerMoney.prototype.set = function (newMoney) {
	let compoundTag = this.server.persistentData.getCompound('player_money');

	if (compoundTag.empty) {
		this.server.persistentData.put('player_money', new $CompoundTag());
		compoundTag = this.server.persistentData.getCompound('player_money');
	}

	compoundTag.putLong(this.player.username, newMoney);
}

PlayerMoney.prototype.add = function (moneyDiff) {
	let currentMoney = this.get();
	this.set(currentMoney + moneyDiff);
}