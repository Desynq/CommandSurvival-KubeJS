// priority: 1

/** @type {$CommandContext_<$CommandSourceStack_>} */
SellItem.prototype.context = undefined;

/** @type {$Player_} */
SellItem.prototype.player = undefined;

/** @type {$MinecraftServer_} */
SellItem.prototype.server = undefined;

/** @type {boolean} */
SellItem.prototype.sellAll = undefined;

/** @type {string} */
SellItem.prototype.item = undefined

/** @type {object<string, number[2]>} */
SellItem.prototype.sellableItems = undefined;

/** @type {string[]} */
SellItem.prototype.items = undefined;

/** @type {number} */
SellItem.prototype.amountToSell = undefined;

/** @type {number} */
SellItem.prototype.amountSold = undefined;

/** @type {number} */
SellItem.prototype.itemValue = undefined

/** @type {number} */
SellItem.prototype.totalValue = undefined;



function SellItem(context, sellAll)
{
	this.context = context;
	this.player = this.context.source.player;
	this.server = this.player.server;

	this.sellAll = sellAll;

	this.item = $ArgumentTypeWrappers.STRING.getResult(this.context, "item");
	this.items = Object.keys(SellableItems);


	if (this.items.indexOf(this.item) === -1)
	{
		this.player.tell(Text.red("Sell an actual item next time."));
		return;
	}

	if (this.sellAll)
	{
		this.amountToSell = 2147483647;
	}
	else
	{
		this.amountToSell = $ArgumentTypeWrappers.INTEGER.getResult(this.context, "amount");
		if (this.amount < 0)
		{
			this.player.tell(Text.red("Sell an actual quantity next time."));
			return;
		}
	}

	this.itemValue = SellItem.getRealItemValue(this.server, this.item);
	Desynq(this.server).tell(this.itemValue);

	this.amountSold = this.server.runCommandSilent(`clear ${this.player.username} ${this.item} ${this.amountToSell}`);
	if (!this.player.creative || !this.player.spectator) {
		SellTracker.addSold(this.server, this.item, this.amountSold);
	}

	this.totalValue = this.amountSold * this.itemValue;
	new PlayerMoney(this.player).add(this.totalValue);

	this.tellOutput();
}

/**
 * @param {$MinecraftServer_} server 
 * @param {string} item
 * @returns {number}
 */
SellItem.getRealItemValue = function (server, item)
{
	const itemEntry = SellableItems[item];
	const baseValue = itemEntry[0];
	const percentageLoss = itemEntry[1];
	const exponentialGroup = itemEntry[2];

	if (percentageLoss === undefined || exponentialGroup === undefined) {
		return baseValue;
	}

	let globalAmountSold = SellTracker.getSold(server, item);

	Desynq(server).tell(`${baseValue} ${percentageLoss} ${exponentialGroup} ${globalAmountSold}`);

	return Math.ceil(baseValue * ((1 - percentageLoss) ** (globalAmountSold / exponentialGroup)));
}

SellItem.prototype.tellOutput = function ()
{
	const output =
		`${'-'.repeat(32)}\n` +
		`Individual Value: $${(this.itemValue / 100).toFixed(2)}\n` +
		`Sold: ${this.amountSold}\n` +
		`Total Value: $${(this.totalValue / 100).toFixed(2)}\n` +
		`${'-'.repeat(32)}`
		;

	this.player.tell(output);
}

