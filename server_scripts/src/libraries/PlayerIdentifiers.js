// priority: 2147483647

/*
{
	player_string_uuids: [
		string_uuid
	]
}
*/

const PlayerIdentifiers = (function ()
{
	function Class()
	{ }


	Class.PLAYER_STRING_UUIDS_KEY = "player_string_uuids";
	Class.STRING_TAG_TYPE = 9;


	/**
	 * @param {Internal.MinecraftServer} server 
	 * @param {string} username 
	 */
	Class.PutStringUUID = function (server, stringUUID)
	{
		let listTag = server.persistentData.getList(this.PLAYER_STRING_UUIDS_KEY, $Tag.TAG_STRING);
		let stringTag = $StringTag.valueOf(stringUUID);
		if (listTag.contains(stringTag))
		{
			return;
		}

		listTag.addTag(listTag.size(), stringTag);
		server.persistentData.put(this.PLAYER_STRING_UUIDS_KEY, listTag);
	}



	return Class;
}
)();