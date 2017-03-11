const CordlrPlugin = require('cordlr-plugin')

const request = require('request')

class GiphyPlugin extends CordlrPlugin {
  constructor (bot, config) {
    super(bot, config)

    this.name = 'Giphy'
    this.description = 'Randomly generates memes and stickers'

    this.embedFooter = this.embedFooter('Giphy Cordlr Plugin - Powered by Giphy')

    this.commands = {
      'giphy': {
        'usage': '<tag>',
        'function': 'getRandomGiphy',
        'description': 'Retrieves a random Giphy GIF'
      }
    }

    this.resolveConfiguration()
  }

  resolveConfiguration () {
    if (!this.config.giphy) {
      this.config.giphy = {}
    }

    if (!this.config.giphy.apikey) {
      this.config.giphy.apikey = 'dc6zaTOxFJmzC'
    }
  }

  getRandomGiphy (message, args, flags) {
    const apiUrl = 'http://api.giphy.com/v1/gifs/random?api_key=' + this.config.giphy.apikey
    let requestUrl = apiUrl
    let embedTitle = 'Here is your random Giphy'

    if (args[0]) {
      requestUrl += '&tag=' + encodeURI(args[0])
      embedTitle += ' we found under the tag **' + args[0] + '**'
    }

    if (requestUrl) {
      request(requestUrl, (error, response, body) => {
        if (error) {
          this.sendInfo(message, 'Sorry but Giphy is not answering my phone calls', 'Giphy Request failed', this.embedFooter, 'error')
          return false
        }

        const bodyParsed = JSON.parse(body)
        if (bodyParsed.data) {
          if (!bodyParsed.data.fixed_height_downsampled_url) {
            this.sendInfo(message, 'We could not find any GIF related to this.', 'Giphy no GIF found', this.embedFooter, 'error')
          }

          this.sendEmbed(message, {
            title: embedTitle,
            image: this.embedImage(bodyParsed.data.fixed_height_downsampled_url),
            footer: this.embedFooter
          })
        }
      })
    }
  }
}

module.exports = GiphyPlugin