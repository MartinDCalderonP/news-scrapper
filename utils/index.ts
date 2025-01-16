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
  const months: { [key: string]: string } = {
    Ene: 'enero',
    Feb: 'febrero',
    Mar: 'marzo',
    Abr: 'abril',
    May: 'mayo',
    Jun: 'junio',
    Jul: 'julio',
    Ago: 'agosto',
    Sep: 'septiembre',
    Oct: 'octubre',
    Nov: 'noviembre',
    Dic: 'diciembre'
  }

  const [month, day, year] = date.split(' ')
  const formattedDay = day.replace(',', '')

  return `${formattedDay.padStart(2, '0')} de ${months[month]} de ${year}`
}
