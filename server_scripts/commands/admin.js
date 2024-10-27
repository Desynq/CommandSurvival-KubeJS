// priority: 0



const AdminCommand = {};

/**
 * @param {$CommandContext_<$CommandSourceStack_>} context 
 */
AdminCommand.ItemsSoldChange = function (context)
{
	const executor = context.source.player;
	if (!executor.op)
	{
		return;
	}

	const server = context.source.server;
	const item = $ArgumentTypeWrappers.STRING.getResult(context, "item");
	const newAmount = $ArgumentTypeWrappers.INTEGER.getResult(context, "new_amount");

	SellTracker.updateSold(server, item, newAmount);
}

/**
 * @param {$CommandContext_<$CommandSourceStack_>} context 
 */
AdminCommand.AddMoneyToPlayer = function (context)
{
	const executor = context.source.player;
	if (!executor.op)
	{
		return;
	}

	/** @type {$Player_} */
	const username = $ArgumentTypeWrappers.STRING.getResult(context, "username");
	const amount = $ArgumentTypeWrappers.DOUBLE.getResult(context, "amount");

	const money = Money.FromDollar(amount);

	PlayerMoney.add(context.source.server, username, money);
	executor.tell(Text.gold(`Added ${Money.ToDollarString(money)} to ${username}`));
}

/**
 * @param {$CommandContext_<$CommandSourceStack_>} context
 */
AdminCommand.GetMoneyFromPlayer = function (context)
{
	const executor = context.source.player;
	if (!executor.op)
	{
		return;
	}
	const server = context.source.server;

	const username = $ArgumentTypeWrappers.STRING.getResult(context, "username");
	const money = PlayerMoney.get(server, username);
	
	executor.tell(Text.gold(`Player ${username} has ${Money.ToDollarString(money)}`));
}

ServerEvents.commandRegistry(event =>
{
	event.register($Commands.literal("admin")
		/**
		 * /admin items_solid change <item> <new_amount>
		 * 
		 */
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

		/**
		 * /admin money add <player> <amount>
		 * /admin money get <player>
		 * 
		 */
		.then($Commands.literal("money")
			.then($Commands.literal("add")
				.then($Commands.argument("username", $ArgumentTypeWrappers.STRING.create(event))
					.then($Commands.argument("amount", $ArgumentTypeWrappers.DOUBLE.create(event))
						.executes(context =>
						{
							AdminCommand.AddMoneyToPlayer(context);
							return 1;
						})
					)
				)
			)
			.then($Commands.literal("get")
				.then($Commands.argument("username", $ArgumentTypeWrappers.STRING.create(event))
					.executes(context => {
						AdminCommand.GetMoneyFromPlayer(context);
						return 1;
					})
				)
			)
		)


	);
});