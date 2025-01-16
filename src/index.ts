import axios from 'axios'
import * as cheerio from 'cheerio'
import { News } from './types'
import urls from './data/urls'
import { formatNewsDate, portalFromUrl, stringToSlug } from './utils'

const scrapeNews = async (url: string): Promise<News | undefined> => {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const currentTitle = $('h1.entry-title').text().trim()

    const news: News = {
      url,
      portal: portalFromUrl(url),
      date: formatNewsDate($('.published').text().trim()),
      title: currentTitle,
      slug: stringToSlug(currentTitle),
      description: $('.et_pb_text_inner').first().text().trim(),
      content: $('.entry-content p')
        .slice(1)
        .map((_, p) => {
          const text = $(p).text().trim()
          const strongs = $(p).find('strong')
          const links = $(p).find('a')

          let paragraphText = text

          strongs.each((_, strong) => {
            const strongText = $(strong).text().trim()

            paragraphText = paragraphText.replace(
              strongText,
              `<strong>${strongText}</strong>`
            )
          })

          links.each((_, a) => {
            const linkText = $(a).text().trim()
            const href = $(a).attr('href')

            if (linkText && href) {
              paragraphText = paragraphText.replace(
                linkText,
                `<a href="${href}">${linkText}</a>`
              )
            }
          })

          return paragraphText
        })
        .get()
        .join('\n\n'),
      images: $('.entry-content img')
        .map((_, img) => $(img).attr('src'))
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
