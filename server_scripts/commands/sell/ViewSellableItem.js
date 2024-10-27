// priority: 1



/**
 * 
 * @param {$CommandContext_<$CommandSourceStack_>} context 
 */
function ViewSellableItem(context)
{
	this.server = context.source.server;
	this.executor = context.source.player;
	this.itemName = $ArgumentTypeWrappers.STRING.getResult(context, "item");

	this.viewItem();
}

ViewSellableItem.prototype.server = undefined;
ViewSellableItem.prototype.executor = undefined;
/** @type {string} */
ViewSellableItem.prototype.itemName = undefined;



ViewSellableItem.prototype.viewItem = function ()
{
	const basePrice = SellableItems[this.itemName][0];
	const currentPrice = SellItem.getRealItemValue(this.server, this.itemName);

	const dashedLine = '-'.repeat(32);
	this.executor.tell(ConcatString(
		`${dashedLine}\n`,
		`Item: ${this.itemName}\n`,
		`Base Price: ${Money.ToDollarString(basePrice)}\n`,
		`Current Price: ${Money.ToDollarString(currentPrice)}\n`,
		`${dashedLine}`
	));
}