interface StringToSlugParams {
  string: string
}

type Mapping = {
  [key: string]: string
}

export const stringToSlug = ({ string }: StringToSlugParams): string => {
  const from = 'áàäâãéèëêẽíìïîĩóòöôõúùüûũñç'
  const to = 'aaaaaeeeeeiiiiiooooouuuuunc'
  const mapping: Mapping = {}

  from.split('').forEach((char, i) => {
    mapping[char] = to.charAt(i)
  })

  return string
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

interface PortalFromUrlParams {
  url: string
}

export const portalFromUrl = ({ url }: PortalFromUrlParams): string => {
  const portal = url.split('/')[2].split('.')[0]

  if (portal === 'anccom') return 'ANCCom'

  return portal
}

interface FormatNewsDateParams {
  date: string
}

type Months = {
  [key: string]: number
}

export const formatNewsDate = ({ date }: FormatNewsDateParams): string => {
  const months: Months = {
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

interface ImageNameParams {
  url: string
}

export const imageName = ({ url }: ImageNameParams): string => {
  return url.split('/').pop() ?? ''
}
