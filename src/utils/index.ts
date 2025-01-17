export const stringToSlug = (str: string): string => {
  const from = 'áàäâãéèëêẽíìïîĩóòöôõúùüûũñç'
  const to = 'aaaaaeeeeeiiiiiooooouuuuunc'
  const mapping: { [key: string]: string } = {}

  for (let i = 0; i < from.length; i++) {
    mapping[from.charAt(i)] = to.charAt(i)
  }

  return str
    .toLowerCase()
    .split('')
    .map((char) => mapping[char] || char)
    .join('')
    .split(' ')
    .join('-')
    .split('')
    .filter((char) => 'abcdefghijklmnopqrstuvwxyz0123456789-'.includes(char))
    .join('')
}

export const portalFromUrl = (url: string): string => {
  const portal = url.split('/')[2].split('.')[0]

  if (portal === 'anccom') return 'ANCCom'

  return portal
}

export const formatNewsDate = (date: string): string => {
  const months: { [key: string]: number } = {
    Ene: 0,
    Feb: 1,
    Mar: 2,
    Abr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Ago: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dic: 11
  }

  const [month, day, year] = date.split(' ')

  const formattedDate = new Date(
    parseInt(year, 10),
    months[month],
    parseInt(day.replace(',', ''), 10)
  )

  return formattedDate.toISOString().split('T')[0]
}
