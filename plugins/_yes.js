let fs = require('fs')
let handler = m => m

handler.all = async function (m, { conn, isBlocked }) {

    if (isBlocked || m.fromMe || m.chat.endsWith('broadcast')) return
    let set = db.data.settings[this.user.jid]
    let { isBanned } = db.data.chats[m.chat]
    let { banned } = db.data.users[m.sender]

    // ketika ditag 
    if (m.isGroup) {
        if (m.mentionedJid.includes(this.user.jid)) {
            await this.sendFile(m.chat, 'https://i.ibb.co/FKWb5dc/tmp.webp', 'stiker.webp', '', m, 0, { asSticker: true })
           // m.reply('masih makan jan di tag')
        }
    }

    // ketika ada yang invite/kirim link grup di chat pribadi
    if ((m.mtype === 'groupInviteMessage' || m.text.startsWith('https://chat') || m.text.startsWith('Buka tautan ini')) && !m.isBaileys && !m.isGroup) {
        this.sendButton(m.chat, `┌「 *Undang Bot ke Grup* 」
├ terima kasih sudah meng add bot ke grup silahkan ketik !enable welcome
└────

https://github.com/yogiprasetya-09/
`.trim(), '© by yogi prasetya', 'Owner', ',owner', m)
    }

    // salam
    let reg = /(ass?alam|اَلسَّلاَمُ عَلَيْكُمْ|السلام عليکم)/i
    let isSalam = reg.exec(m.text)
    if (isSalam && !m.fromMe) {
        m.reply(`وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ\n_wa\'alaikumussalam wr.wb._`)
    }

    // backup db
    if (set.backup) {
        if (new Date() * 1 - set.backupTime > 1000 * 60 * 60) {
            let d = new Date
            let date = d.toLocaleDateString('id', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
            await global.db.write()
            this.reply(global.owner[0] + '@s.whatsapp.net', `Database: ${date}`, null)
            this.sendFile(global.owner[0] + '@s.whatsapp.net', fs.readFileSync('./database.json'), 'database.json', '', 0, 0, { mimetype: 'application/json' })
            set.backupTime = new Date() * 1
        }
    }

    // update status
    if (set.autoupdatestatus) {
        if (new Date() * 1 - set.status > 1000) {
            let _uptime = process.uptime() * 1000
            let uptime = conn.clockString(_uptime)
            await this.setStatus(`Aktif selama ${uptime} | Mode: ${set.self ? 'Private' : set.group ? 'Hanya Grup' : 'Publik'} | stikerinbot oleh ariffb`).catch(_ => _)
            set.status = new Date() * 1
        }
    }

}

module.exports = handler 