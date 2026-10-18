/**
 * Anti-Delete — privately recovers deleted messages
 * Recovers text, images, videos, audio, documents and stickers to the owner DM
 * Usage: .antidelete (group toggle or account-wide master toggle in DM)
 */
'use strict';

const database = require('../../utils/database');

module.exports = {
    name:        'antidelete',
    aliases:     ['ad', 'antirevoke'],
    category:    'moderation',
    description: 'Privately recover deleted messages in groups or personal DMs',
    usage:       '.antidelete',

    async execute({ sock, from, msg, isGroup, isAdmin, isOwner, phoneNumber, reply }) {
        if (isGroup && !isAdmin && !isOwner) return reply(`❌ _Only group admins can use this command._`);

        if (!isGroup) {
            const current = database.getAntiDeleteGlobal(phoneNumber);
            const next = !current;
            database.setAntiDeleteGlobal(phoneNumber, next);
            // Keep the older personal flag aligned for deployments that
            // already used the previous DM-only implementation.
            database.setAntiDeletePersonal(phoneNumber, next);
            return reply(
                `🗑️ *𝗔𝗡𝗧𝗜-𝗗𝗘𝗟𝗘𝗧𝗘 · 𝗔𝗖𝗖𝗢𝗨𝗡𝗧 𝗪𝗜𝗗𝗘* ⛧\n\n` +
                (next
                    ? `✅ *ON* — deleted messages from every group and personal chat will be recovered privately to the owner DM.`
                    : `🔴 *OFF* — account-wide antidelete recovery has been disabled.`) +
                `\n\n> _𝘚𝘶𝘬𝘶𝘯𝘢 𝘔𝘋 · 𝘈𝘤𝘤𝘰𝘶𝘯𝘵 𝘙𝘦𝘤𝘰𝘷𝘦𝘳𝘺_`
            );
        }

        const grp     = database.getGroup(from);
        const current = !!grp.antidelete;
        const next    = !current;
        database.setGroup(from, 'antidelete', next);

        await reply(
            `🗑️ *𝗔𝗡𝗧𝗜-𝗗𝗘𝗟𝗘𝗧𝗘* ⛧\n\n` +
            (next
                ? `✅ *ON* — deleted messages from this group will be recovered privately to the owner DM.\n_𝘛𝘦𝘹𝘵, 𝘪𝘮𝘢𝘨𝘦𝘴, 𝘷𝘪𝘥𝘦𝘰𝘴, 𝘢𝘶𝘥𝘪𝘰 𝘢𝘯𝘥 𝘥𝘰𝘤𝘴 𝘢𝘳𝘦 𝘢𝘭𝘭 𝘤𝘰𝘷𝘦𝘳𝘦𝘥._`
                : `🔴 *OFF* — _𝘈𝘯𝘵𝘪-𝘋𝘦𝘭𝘦𝘵𝘦 𝘩𝘢𝘴 𝘣𝘦𝘦𝘯 𝘥𝘪𝘴𝘢𝘣𝘭𝘦𝘥._`) +
            `\n\n> _𝘚𝘶𝘬𝘶𝘯𝘢 𝘔𝘋 · 𝘒𝘪𝘯𝘨 𝘰𝘧 𝘊𝘶𝘳𝘴𝘦𝘴_`
        );
    }
};
