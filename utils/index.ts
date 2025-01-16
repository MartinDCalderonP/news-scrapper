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