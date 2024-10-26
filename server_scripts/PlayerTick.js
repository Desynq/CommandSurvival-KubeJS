// priority: 0

PlayerEvents.tick(event => new PlayerTick(event));




/** @type {$Player_} */
PlayerTick.prototype.player = null;

/** @type {$MinecraftServer_} */
PlayerTick.prototype.server = null;

/** @type {PlayerMoney} */
PlayerTick.prototype.playerMoney = null;



/**
 * @param {$SimplePlayerEvent_} event 
 */
function PlayerTick(event) {
	this.player = event.player;
	this.server = event.server;
	
	this.playerMoney = new PlayerMoney(this.player);

	if (this.player.username == 'Desynq') {
		this.server.players.forEach(player => DesynqTickAPlayer(this.player, this.server, player))
	}



	if (this.player.stats.timeSinceDeath == 1) {
		this.restoreHungerFromLastLife();
	}




	this.checkMovement();

	this.updateInfoHUD();

	this.saveDataForNextTick();
}



PlayerTick.prototype.restoreHungerFromLastLife = function () {
	this.player.foodLevel = this.player.persistentData.getFloat('food_level_last_tick');
	this.player.saturation = this.player.persistentData.getFloat('saturation_last_tick');
}

PlayerTick.prototype.checkMovement = function () {
	let lastX = this.player.persistentData.getDouble('last_x');
	let lastY = this.player.persistentData.getDouble('last_y');
	let lastZ = this.player.persistentData.getDouble('last_z');
	let lastYaw = this.player.persistentData.getFloat('last_yaw');
	let lastPitch = this.player.persistentData.getFloat('last_pitch');

	let hasMoved = this.player.x != lastX
		|| this.player.y != lastY
		|| this.player.z != lastZ
		|| this.player.yaw != lastYaw
		|| this.player.pitch != lastPitch;

	this.server.runCommandSilent(`scoreboard players set ${this.player.username} is_moving ${Number(hasMoved)}`);
}

PlayerTick.prototype.updateInfoHUD = function () {
	this.player.paint({
		money: {
			type: "text",
			text: `$${(this.playerMoney.get() / 100).toFixed(2)}`,
			color: "green",
			shadow: true,
			alignX: "left",
			alignY: "top",
			x: 30,
			y: 10,
			scale: 1.5
		}
	});
}

PlayerTick.prototype.saveDataForNextTick = function () {
	this.player.persistentData.putFloat('food_level_last_tick', this.player.foodLevel);
	this.player.persistentData.putFloat('saturation_last_tick', this.player.saturation);

	this.player.persistentData.putDouble('last_x', this.player.x);
	this.player.persistentData.putDouble('last_y', this.player.y);
	this.player.persistentData.putDouble('last_z', this.player.z);
	this.player.persistentData.putFloat('last_yaw', this.player.yaw);
	this.player.persistentData.putFloat('last_pitch', this.player.pitch);
}







/**
 * @param {$Player} desynq 
 * @param {$MinecraftServer} server 
 * @param {$Player} player 
 */
function DesynqTickAPlayer(desynq, server, player) {
	if (player.deathTime == 1) {
		desynq.heal(5);
	}
}