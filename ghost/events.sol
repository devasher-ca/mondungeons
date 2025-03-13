struct Attributes {
	uint8 strength;
	uint8 dexterity;
	uint8 constitution;
	uint8 intelligence;
	uint8 wisdom;
	uint8 charisma;
}

enum ClassType { Warrior, Mage, Rogue }
enum Race { Human, Elf, Dwarf }

interface Events {
	event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
	event CharacterCreated(uint256 indexed tokenId, string name, uint8 classType, uint8 race, uint8 unassignedPoints, Attributes attributes);
	event AttributePointsAssigned(uint256 indexed tokenId, uint8 pointsUsed, uint8 unassignedPoints, uint8 strength, uint8 dexterity, uint8 constitution, uint8 intelligence, uint8 wisdom, uint8 charisma);
}
