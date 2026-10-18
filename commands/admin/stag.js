'use strict';

const { quotedSticker, stickerHash } = require('../../utils/stag');

module.exports = {
    name: 'stag',
    aliases: ['specialtag', 'tagsticker'],
    description: 'Register a sticker that silently mentions group members when posted',
    category: 'admin',

    async execute({ sock, msg, from, args, reply, isGroup, isAdmin, isOwner, database }) {
        if (!isGroup) return reply('❌ .stag can only be used inside a group.');
        if (!isAdmin && !isOwner) return reply('❌ Only group admins can configure a special tag sticker.');

        const action = String(args?.[0] || '').toLowerCase();
        if (['off', 'disable', 'clear', 'remove'].includes(action)) {
            database.setStagSticker(from, null);
            return reply('✅ Special tag sticker disabled for this group.');
        }

        const target = quotedSticker(msg);
        if (!target) {
            return reply('🫥 Reply to a sticker with `.stag` to register it.\nUse `.stag off` to disable it.');
        }
        const hash = stickerHash(target.stickerMessage);
        if (!hash) return reply('❌ That sticker has no reusable fingerprint. Try sending or saving the sticker again.');
        database.setStagSticker(from, hash);
        return reply('✅ Special tag sticker saved.\nWhen this sticker is posted, group members will be mentioned silently on the sticker itself.\nUse `.stag off` to disable it.');
    },
};
