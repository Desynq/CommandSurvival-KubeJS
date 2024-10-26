// priority: 0

/** @type {$Player_} */
AttributePoints.prototype.player = undefined;

function AttributePoints(player)
{
	this.player = player;
}

AttributePoints.prototype.getTotalPoints = function () { }

AttributePoints.prototype.getSparePoints = function () { }

AttributePoints.prototype.getPointsFromAttribute = function () { }

AttributePoints.prototype.buyPoints = function (amount) { }

AttributePoints.prototype.resetPoints = function () { }

AttributePoints.prototype.spendPoints = function (amount, attributeName) { }

/**
 * Apply the attribute modifiers from the attribute point system to the player
 * - Should be called whenever the player spends an attribute point, resets their attribute points, or respawns/rejoins
 */
AttributePoints.prototype.applyAttributes = function () { }