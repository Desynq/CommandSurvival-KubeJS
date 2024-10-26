// priority: 0



const AdminCommand = {};

/**
 * @param {$CommandContext_<$CommandSourceStack_>} context 
 */
AdminCommand.ItemsSoldChange = function (context)
{
	const server = context.source.server;
	const item = $ArgumentTypeWrappers.STRING.getResult(context, "item");
	const newAmount = $ArgumentTypeWrappers.INTEGER.getResult(context, "new_amount");

	SellTracker.updateSold(server, item, newAmount);
}

ServerEvents.commandRegistry(event => {
	event.register($Commands.literal("admin")
		.then($Commands.literal("items_sold")

			.then($Commands.literal("change")
				.then($Commands.argument("item", $ArgumentTypeWrappers.STRING.create(event))
					.suggests((context, builder) => suggestSellableItem(context, builder))
					.then($Commands.argument("new_amount", $ArgumentTypeWrappers.INTEGER.create(event))
						.executes(context =>
						{
							AdminCommand.ItemsSoldChange(context);
							return 1;
						})
					)
				)
			)
		)



		
	);
});