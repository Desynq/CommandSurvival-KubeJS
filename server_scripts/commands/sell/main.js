// priority: 0


/**
 * [cost, percentageLoss, exponentialGroup]
 * ex: $100.00 (10000) with 20% (0.2) loss after 100 (100) items
 * 
 * - Omitting percentageLoss and exponentialGroup removes any diminishing returns from selling the item
 * @typedef {Object<string, number[1] | number[3]} SellableItems
 */
const SellableItems = {
	"minecraft:netherrack": [Money.FromDollar(0.01)],
	"minecraft:diamond": [Money.FromDollar(100.00), 0.2, 100],
	"minecraft:sugar_cane": [Money.FromDollar(0.40), 0.5, 1000],
	"minecraft:iron_ingot": [Money.FromDollar(4.00), 0.2, 200],
	"minecraft:gold_ingot": [Money.FromDollar(5.00)],
	"minecraft:carrot": [Money.FromDollar(0.05), 0.5, 2000],
	"minecraft:baked_potato": [Money.FromDollar(0.10), 0.2, 1500],
	"minecraft:tropical_fish": [Money.FromDollar(2.00), 0.25, 100],
	"minecraft:cobbled_deepslate": [Money.FromDollar(0.01)],
}



/**
 * @param {$CommandContext_<$CommandSourceStack_>} context
 * @param {$SuggestionsBuilder_} builder
 */

function suggestSellableItem(context, builder) {
	const { source, source: { player } } = context;

	const items = Object.keys(SellableItems);
	for (let item of items) {
		builder.suggest(`"${item}"`);
	}
	return builder.buildFuture();
}

/**
 * @param {$CommandContext_<$CommandSourceStack_>} context
 * @param {$SuggestionsBuilder_} builder
 */
function suggestAmount(context, builder) {
	const { source, source: { player } } = context;

	builder.suggest("1");
	builder.suggest("32");
	builder.suggest("64");
	return builder.buildFuture();
}




ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;

	const itemArgument = Commands.argument("item", Arguments.STRING.create(event))
		.suggests((context, builder) => suggestSellableItem(context, builder))
	;

	const amountArgument = Commands.argument("amount", Arguments.INTEGER.create(event))
		.suggests((context, builder) => suggestAmount(context, builder))
	;



	event.register(Commands.literal("sell")
		.then(Commands.literal("item")
			.then(itemArgument
				.then(amountArgument
					.executes(context => {
						new SellItem(context, false);
						return 1;
					})
				)
				.then(Commands.literal("all")
					.executes(context => {
						new SellItem(context, true);
						return 1;
					})
				)

				.then($Commands.literal("info")
					.executes(context => {
						new ViewSellableItem(context);
						return 1;
					})
				)
			)
		)
	);
});