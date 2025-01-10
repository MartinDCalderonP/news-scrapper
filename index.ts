import axios from 'axios'
import * as cheerio from 'cheerio'
import { Article } from './types'

const urls = [
  'https://anccom.sociales.uba.ar/2024/04/22/los-trabajadores-de-telam-presentan-su-propio-proyecto-legislativo/',
  'https://anccom.sociales.uba.ar/2024/05/19/y-el-polideportivo-donde-esta/',
  'https://anccom.sociales.uba.ar/2024/05/25/la-salud-tambien-para/',
  'https://anccom.sociales.uba.ar/2024/06/07/los-arboles-son-necesarios-para-vivir-en-la-ciudad/',
  'https://anccom.sociales.uba.ar/2024/07/09/los-mismos-conflictos-estan-sucediendo-en-todos-los-barrios/',
  'https://anccom.sociales.uba.ar/2024/08/07/bangladesh-se-queda-sin-primera-ministra-tras-las-protestas-juveniles/',
  'https://anccom.sociales.uba.ar/2024/08/22/denunciar-los-crimenes-de-guerra-de-israel-no-es-antisemitismo/',
  'https://anccom.sociales.uba.ar/2024/09/02/los-trabajadores-de-prensa-reclaman-un-salario-por-arriba-de-la-linea-de-pobreza/',
  'https://anccom.sociales.uba.ar/2024/09/12/la-musica-se-paga-o-se-apaga/',
  'https://anccom.sociales.uba.ar/2024/12/04/libertad-de-expresion-en-la-era-digital/',
  'https://anccom.sociales.uba.ar/2024/11/22/el-derecho-a-reparar/',
  'https://anccom.sociales.uba.ar/2024/12/17/ciudad-universitaria-se-convirtio-en-disney/'
]

const scrapeArticle = async (): Promise<void> => {
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
