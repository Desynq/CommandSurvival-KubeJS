// priority: 1


function Money() {}

/**
 * 
 * @param {number} number 
 * @returns {number}
 */
Money.FromDollar = function (number) {
	return number * 100;
}

/**
 * @param {number} number
 * @returns {number}
 */
Money.ToDollar = function (number) {
	return number / 100;
}

/**
 * Converts the inputted number to "x.xx" format
 * @param {number} number
 * @returns {string}
 */
Money.ToDollarString = function (number) {
	return `$${Money.ToDollar(number).toFixed(2)}`;
}







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