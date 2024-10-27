// priority: 0



BuyCommand.pricedItems = {
	"minecraft:leather": Money.FromDollar(24.99),
	"unbreaking_3_book": Money.FromDollar(749.99),
	"minecraft:experience_bottle": Money.FromDollar(7.49)
}



/** @type {$CommandRegistryEventJS_} */
BuyCommand.prototype.event = undefined;

/** @type {$Commands_} */
BuyCommand.prototype.Commands = undefined;

/** @type {$ArgumentTypeWrappers_} */
BuyCommand.prototype.Arguments = undefined;

/**
 * /buy <item> <amount: int | "inspect">
 * 
 * @param {$CommandRegistryEventJS_} event
 */
function BuyCommand(event)
{
	this.event = event;
	this.Commands = this.event.commands;
	this.Arguments = this.event.arguments;

	this.register();
}



/**
 * @param {$CommandContext_<$CommandSourceStack_>} context
 * @param {$SuggestionsBuilder_} builder
 */
BuyCommand.prototype.suggestItem = function (context, builder)
{
	const items = Object.keys(BuyCommand.pricedItems);
	for (let item of items)
	{
		builder.suggest(`"${item}"`);
	}
	return builder.buildFuture();
}

/**
 * @param {$CommandContext_<$CommandSourceStack_>} context
 * @param {$SuggestionsBuilder_} builder
 */
BuyCommand.prototype.suggestAmount = function (context, builder)
{
	builder.suggest("0");
	builder.suggest("1");
	builder.suggest("32");
	builder.suggest("64");
	return builder.buildFuture();
}



BuyCommand.prototype.register = function ()
{
	const itemArgument = (this.Commands.argument("item", this.Arguments.STRING.create(this.event))
		.suggests((context, builder) => this.suggestItem(context, builder))
	);

	const amountArgument = (this.Commands.argument("amount", this.Arguments.INTEGER.create(this.event))
		.suggests((context, builder) => this.suggestAmount(context, builder))
	);



	this.event.register(this.Commands.literal("buy")
		.then(itemArgument
			.then(amountArgument
				.executes(context => this.buy(context))
			)
		)
	);
}

/**
 * @param {$CommandContext_<$CommandSourceStack_>} context 
 */
BuyCommand.prototype.buy = function (context)
{
	const player = context.source.player;

	const item = this.Arguments.STRING.getResult(context, "item");
	const items = Object.keys(BuyCommand.pricedItems);
	if (items.indexOf(item) === -1)
	{
		player.tell(Text.red("Bro is trying to buy something that doesn't exist :pensive:"));
		return 1;
	}

	const amount = this.Arguments.INTEGER.getResult(context, "amount");
	if (amount < 0)
	{
		player.tell(Text.red("You want to buy a negative amount? Try using /sell you idiot."));
		return 1;
	}

	const price = BuyCommand.pricedItems[item];
	if (amount == 0)
	{
		player.tell(Text.yellow(`This item costs: $${Money.ToDollarString(price)}`));
		return 1;
	}

	const cost = price * amount;

	let money = PlayerMoney.get(player.server, player.username);
	if (money < cost)
	{
		player.tell(Text.red("Come back when you're richer you broke ass ni-"));
		return 1;
	}

	money -= cost;
	PlayerMoney.set(player.server, player.username, money);
	switch (item)
	{
		case "unbreaking_3_book":
			player.server.runCommandSilent(`give ${player.username} minecraft:enchanted_book{StoredEnchantments:[{id:"minecraft:unbreaking",lvl:3}]} ${amount}`);
			break;
		default:
			player.server.runCommandSilent(`give ${player.username} ${item} ${amount}`);
	}
	player.tell(Text.green(`Bought ${amount} ${item} for ${Money.ToDollarString(cost)}`));
	return 1;
}




ServerEvents.commandRegistry(event => new BuyCommand(event));