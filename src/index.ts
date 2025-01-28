import axios from 'axios'
import * as cheerio from 'cheerio'
import { News } from './types'
import urls from './data/urls'
import { formatNewsDate, imageName, portalFromUrl, stringToSlug } from './utils'

const scrapeNews = async (url: string): Promise<News | undefined> => {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const currentTitle = $('h1.entry-title').text().trim()
    const centralImage = $('.entry-content img')
      .map((_, img) => $(img).attr('src'))
      .get()[0]

    const news: News = {
      url,
      portal: portalFromUrl(url),
      title: currentTitle,
      slug: stringToSlug(currentTitle),
      date: formatNewsDate($('.published').text().trim()),
      photographer: $('.fotografo').text().trim().replace('Fotografía: ', ''),
      description: $('.et_pb_text_inner').first().text().trim(),
      content: $('.entry-content p, .entry-content img')
        .slice(1)
        .map((_, element) => {
          if ($(element).is('p')) {
            const text = $(element).html()?.trim() ?? ''
            const strongs = $(element).find('strong')
            const brs = $(element).find('br')
            const styles = $(element).find('[style]')

            let paragraphText = text

            strongs.each((_, strong) => {
              const strongText = $(strong).text().trim()

              paragraphText = paragraphText.replace(
                strongText,
                `<strong>${strongText}</strong>`
              )
            })

            brs.each((_, br) => {
              paragraphText = paragraphText.replace('<br>', '<br/>')
            })

            styles.each((_, style) => {
              const styleText = $(style).attr('style') ?? ''
              paragraphText = paragraphText.replace(` style="${styleText}"`, '')
            })

            return `<p>${paragraphText}</p>`
          } else if (
            $(element).is('img') &&
            !$(element).closest('.et_pb_gallery_item').length &&
            $(element).attr('src') !== centralImage
          ) {
            const src = $(element).attr('src') ?? ''
            return `<Image alt="${imageName(src)}" loading="lazy" src="${src}" />`
          }
        })
        .get()
        .join(''),
      centralImage,
      sliderImages: $('.et_pb_gallery_item img')
        .map((_, img) => $(img).attr('src')?.replace('-400x284', ''))
        .get()
    }

    return news
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error scraping the news:', error.message)
    } else {
      console.error('An unknown error occurred')
    }
  }
}

const fetchNews = async () => {
  const news = await Promise.all(urls.map(scrapeNews))
  console.log(news)
}

fetchNews()
