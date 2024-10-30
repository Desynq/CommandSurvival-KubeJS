// priority: 0


/**
 * @typedef {"strength" | "constitution" | "perception" | "agility" | "dexterity" | "endurance"} StatId
 */


const CustomStatData = {
	/**
	 * Attack Damage (+2.5% per point)
	 * - #### 
	 */
	strength: {
		modifierUUID: "70561290-4434-4c86-9b87-cbdeb8c6d6bf",
		modifierName: "strength_stat"
	},
	/**
	 * Max Health (+0.5 per point)
	 * - #### Prevent death once per life if 20+ points invested and >=30% of total points
	 */
	constitution: {
		modifierUUID: "b9919b8e-e0b0-444a-9581-ada3d1873716",
		modifierName: "constitution_stat"
	},
	/**
	 * Luck
	 * Bonus Loot
	 * Critical Bonus Damage (+2.5% per point)
	 * - #### Players within 16 blocks will glow if 20+ points invested and >=30% of total points
	 */
	perception: {},
	/**
		 * Movement Speed (+0.005 per point)
		 * Dodge Chance
		 */
	agility: {},
	/**
	 * Attack Speed
	 */
	dexterity: {},
	/**
	 * Knockback Resistance
	 * Lung Capacity
	 * Armor Toughness
	 */
	endurance: {},
};