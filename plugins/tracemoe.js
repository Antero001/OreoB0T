const { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys-md')
const uploadFile = require('../lib/uploadFile')
const uploadImage = require('../lib/uploadImage')
let fetch = require('node-fetch')

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'Tidak ada media yang ditemukan'
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
  let link = await (isTele ? uploadImage : uploadFile)(media)
  const response = await fetch(`https://api.trace.moe/search?anilistInfo&url=${link}`)
if (response.status !== 200) throw { status: response.status, message: response.statusText, data: await response.text() }
json = await response.json()
hasil = json.result[0]
itumemeg = `
*メ Tittle Native :* ${hasil.anilist.title.native}
*メ Tittle Romaji :* ${hasil.anilist.title.romaji}
*メ Tittle English :* ${hasil.anilist.title.english}

*メ Synonyms :* ${hasil.anilist.synonyms}
*メ Adult :* ${hasil.anilist.isAdult}
*メ File Name :* ${hasil.filename}
*メ Episode :* ${hasil.episode}
*メ Similarity :* ${hasil.similarity}



*NOTE*:
If the video does not match what is in your photo, please click the link below 
`

m.reply('wait bang lagi nyari')

let message = await prepareWAMessageMedia({ video: {url: `${hasil.video}` }}, { upload: conn.waUploadToServer })
     const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
     templateMessage: {
         hydratedTemplate: {
           videoMessage: message.videoMessage,
           hydratedContentText: itumemeg.trim(),
           hydratedFooterText: 'by yogi prasetya',
           hydratedButtons: [{
             urlButton: {
               displayText: 'trace.moe',
               url: `https://trace.moe/?url=${link}`
             }

           },
               {
             quickReplyButton: {
               displayText: 'Owner',
               id: '.owner',
             }

           }]
         }
       }
     }), { userJid: m.sender, quoted: m });
    //conn.reply(m.chat, text.trim(), m)
    return await conn.relayMessage(
         m.chat,
         template.message,
         { messageId: template.key.id }
     )
}
handler.help = ['whatanime <reply image>']
handler.tags = ['nsfw']
handler.command = /^(anime|whatanime)$/i

module.exports = handler