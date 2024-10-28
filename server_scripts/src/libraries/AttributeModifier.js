// priority: 2147483646



const AttributeModifier = (function ()
{
	Class.prototype.entity = undefined;
	Class.prototype.attribute = undefined;
	Class.prototype.modifierUUID = undefined;
	Class.prototype.modifierName = undefined;

	/**
	 * @param {Internal.LivingEntity} entity 
	 * @param {Internal.Attribute} attribute 
	 * @param {Internal.UUID} modifierUUID 
	 * @param {string} modifierName
	*/
	function Class(entity, attribute, modifierUUID, modifierName)
	{
		this.entity = entity;
		this.attribute = attribute;
		this.modifierUUID = modifierUUID;
		this.modifierName = modifierName
	}

	Class.prototype.GetAttributeInstance = function ()
	{
		return this.entity.attributes.getInstance(this.attribute);
	}

	Class.prototype.HasModifier = function ()
	{
		return this.entity.attributes.hasModifier(this.attribute, this.modifierUUID);
	}

	Class.prototype.GetModifierValue = function ()
	{
		return this.HasModifier() ? this.entity.attributes.getModifierValue(this.attribute, this.modifierUUID) : 0;
	}

	Class.prototype.RemoveModifier = function ()
	{
		this.GetAttributeInstance().removeModifier(this.modifierUUID);
		return this;
	}

	/**
	 * @param {number} value 
	 * @param {Internal.AttributeModifier$Operation} operation 
	 */
	Class.prototype.AddPermanentModifier = function (value, operation)
	{
		const modifier = new $AttributeModifier(this.modifierUUID, this.modifierName, value, operation);
		this.GetAttributeInstance().addPermanentModifier(modifier);
		return this;
	}



	return Class;
}
)();