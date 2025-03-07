addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname === '/api/metadata') {
    const params = url.searchParams
    const tokenId = params.get('tokenId')
    const name = params.get('name')
    const classId = params.get('class')
    const raceId = params.get('race')
    const level = params.get('level')
    const str = params.get('str')
    const dex = params.get('dex')
    const con = params.get('con')
    const int = params.get('int')
    const wis = params.get('wis')
    const cha = params.get('cha')

    const races = ['Human', 'Elf', 'Dwarf']
    const classes = ['Warrior', 'Mage', 'Rogue']

    const raceName = races[raceId] || 'Unknown'
    const className = classes[classId] || 'Unknown'

    const imageUrl = `https://yourusername.github.io/nft-images/${raceName}-${className}.png`

    const metadata = {
      name: name,
      description: `A Level ${level} ${raceName} ${className} from Mondungeons`,
      image: imageUrl,
      attributes: [
        { trait_type: 'Race', value: raceName },
        { trait_type: 'Class', value: className },
        { trait_type: 'Level', value: parseInt(level) },
        { trait_type: 'Strength', value: parseInt(str) },
        { trait_type: 'Dexterity', value: parseInt(dex) },
        { trait_type: 'Constitution', value: parseInt(con) },
        { trait_type: 'Intelligence', value: parseInt(int) },
        { trait_type: 'Wisdom', value: parseInt(wis) },
        { trait_type: 'Charisma', value: parseInt(cha) },
      ],
    }

    return new Response(JSON.stringify(metadata), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response('Not Found', { status: 404 })
}
