import axios from 'axios'
import * as cheerio from 'cheerio'
import { Article } from './types'

async function scrapeArticle(): Promise<void> {
  try {
    const url =
      'https://anccom.sociales.uba.ar/2024/04/22/los-trabajadores-de-telam-presentan-su-propio-proyecto-legislativo/'
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
        .map((_, p) => $(p).text().trim())
        .get()
        .join('\n\n'),
      images: $('.entry-content img')
        .map((_, img) => $(img).attr('src'))
        .get()
    }

    console.log(JSON.stringify(article, null, 2))
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error scraping the article:', error.message)
    } else {
      console.error('An unknown error occurred')
    }
  }
}

scrapeArticle()
