// priority: 0


const sellableItems = {
	"minecraft:netherrack": 1
}



/**
 * @param {$CommandContext_<$CommandSourceStack_>} context
 * @param {$SuggestionsBuilder_} builder
 */

function suggestItem(context, builder) {
	const { source, source: { player } } = context;

	const items = Object.keys(sellableItems);
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
		.suggests((context, builder) => suggestItem(context, builder))
	;

	const amountArgument = Commands.argument("amount", Arguments.INTEGER.create(event))
		.suggests((context, builder) => suggestAmount(context, builder))
	;



	event.register(Commands.literal("sell")
		.then(Commands.literal("item")
			.then(itemArgument
				.then(amountArgument
					.executes(context => sellItem(context, false))
				)
				.then(Commands.literal("all")
					.executes(context => sellItem(context, true))
				)
			)
		)
	);




	/**
	 * 
	 * @param {$CommandContext_<$CommandSourceStack_>} context 
	 * @param {boolean} all
	 * @returns {1}
	 */
	function sellItem(context, all) {
		const { source, source: { player } } = context;

		const item = Arguments.STRING.getResult(context, "item");
		const items = Object.keys(sellableItems);
		if (items.indexOf(item) === -1) {
			player.tell(Text.red("Sell an actual item next time."));
			return 1;
		}

		let amount;
		if (all) {
			amount = 2147483647;
		}
		else {
			amount = Arguments.INTEGER.getResult(context, "amount");
			if (amount < 0) {
				player.tell(Text.red("Sell an actual quantity next time."));
				return 1;
			}
		}

		const amountSold = player.runCommandSilent(`clear ${player.username} ${item} ${amount}`);
		const itemValue = sellableItems[item];
		const totalValue = amountSold * itemValue;
		new PlayerMoney(player).add(totalValue);

		const output =
			`${'-'.repeat(32)}\n` +
			`Individual Value: $${(itemValue / 100).toFixed(2)}\n` +
			`Sold: ${amountSold}\n` +
			`Total Value: $${(totalValue / 100).toFixed(2)}\n` +
			`${'-'.repeat(32)}`
		;

		player.tell(output);
		return 1;
	}
});