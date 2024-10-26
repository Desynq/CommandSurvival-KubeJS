// priority: 1



/** @type {$CommandRegistryEventJS_} */
LevelCommand.prototype.event = undefined;

/** @type {$Commands_} */
LevelCommand.prototype.Commands = undefined;

/** @type {$ArgumentTypeWrappers_} */
LevelCommand.prototype.Arguments = undefined;

/**
 * /buy <item> <amount: int | "inspect">
 * 
 * @param {$CommandRegistryEventJS_} event
 */
function LevelCommand(event)
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
LevelCommand.prototype.suggestAmount = function (context, builder)
{
	return builder.buildFuture();
}



LevelCommand.prototype.register = function ()
{
	// const itemArgument = (this.Commands.argument("item", this.Arguments.STRING.create(this.event))
	// 	.suggests((context, builder) => this.suggestItem(context, builder))
	// );

	// const amountArgument = (this.Commands.argument("amount", this.Arguments.INTEGER.create(this.event))
	// 	.suggests((context, builder) => this.suggestAmount(context, builder))
	// );



	// this.event.register(this.Commands.literal("buy")
	// 	.then(itemArgument
	// 		.then(amountArgument
	// 			.executes(context => this.buy(context))
	// 		)
	// 	)
	// );
}

/**
 * @param {$CommandContext_<$CommandSourceStack_>} context 
 */
LevelCommand.prototype.buyPoints = function (context)
{
}




ServerEvents.commandRegistry(event => new LevelCommand(event));