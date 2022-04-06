const PhoneNumber = require('awesome-phonenumber')
async function handler(m) {
                let vcard = 'BEGIN:VCARD\n' // metadata of the contact card
                    + 'VERSION:3.0\n' 
                    + 'N:;My Owner;;;'
                    + 'FN:My Owner\n' // full name
                    + 'ORG:My Owner;\n' // the organization of the contact
                    + 'TEL;type=CELL;type=VOICE;waid=62895613293360:+62 895-6132-93360\n' // WhatsApp ID + phone number
                    + 'END:VCARD'
                conn.sendMessage(m.chat, { contacts: { displayName: 'My Owner', contacts: [{ vcard }] } }, { quoted: m })
}
handler.help = ['owner', 'creator']
handler.tags = ['info']

handler.command = /^(owner|creator)$/i

module.exports = handler
