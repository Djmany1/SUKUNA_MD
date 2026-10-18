'use strict';

const { quotedSticker, stickerHash } = require('../../utils/stag');

module.exports = {
    name: 'stag',
    aliases: ['specialtag', 'tagsticker'],
    description: 'Register a sticker that silently mentions group members when posted',
    category: 'admin',

    async execute({ msg, args, reply, isOwner, phoneNumber, database }) {
        if (!isOwner) return reply('❌ Only the bot owner can configure the special tag sticker.');

        const action = String(args?.[0] || '').toLowerCase();
        if (['off', 'disable', 'clear', 'remove'].includes(action)) {
            database.setStagSticker(phoneNumber, null);
            return reply('✅ Special tag sticker disabled across all groups.');
        }

        const target = quotedSticker(msg);
        if (!target) {
            return reply('🫥 Reply to a sticker with `.stag` to register it.\nUse `.stag off` to disable it.');
        }
        const hash = stickerHash(target.stickerMessage);
        if (!hash) return reply('❌ That sticker has no reusable fingerprint. Try sending or saving the sticker again.');
        database.setStagSticker(phoneNumber, hash);
        return reply('✅ Special tag sticker saved for this bot.\nWhen this sticker is posted in any group, that group’s members will be mentioned silently on the sticker itself.\nUse `.stag off` to disable it everywhere.');
    },
};
