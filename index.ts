import axios from 'axios'
import * as cheerio from 'cheerio'
import { Article } from './types'
import urls from './assets/urls'

const scrapeArticle = async (url: string): Promise<Article | undefined> => {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const article: Article = {
      url,
      author: $('.autor').text().trim(),
      date: $('.published').text().trim(),
      title: $('h1.entry-title').text().trim(),
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

    return article
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error scraping the article:', error.message)
    } else {
      console.error('An unknown error occurred')
    }
  }
}

const fetchArticles = async () => {
  const articles = await Promise.all(urls.map(scrapeArticle))
  console.log(articles)
}

fetchArticles()
