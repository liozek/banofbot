/**
 * Telegam bot
 *
 * @module bot
 * @license MIT
 */

/** Dependencies */
const Telegram = require('node-telegram-bot-api');
const config = require('../config');
const path = require('path');

let bot;
if (config.should_use_webhooks) {
  const options = {
    webHook: {
      port: 5000,
      key: path.join(config.ssl_key_path),
      cert: path.join(config.ssl_certificate_path),
    },
  };

  bot = new Telegram(config.token, options);
  bot.setWebHook(
    `${config.webhook_callback_url}${config.token}`,
    path.join(config.ssl_certificate_path))
    .then(() => { console.info('Telegram webhook is active'); })
    .catch(/** todo: handle error */);
} else {
  bot = new Telegram(config.token, {
    polling: true,
  });
  bot.setWebHook({ url: '' });
  console.info('Telegram is using polling');
}

bot.on('polling_error', () => {
  this.bot.stopPolling({ cancel: true })
    .then(() => {
      setTimeout(() => {
        console.log('Restart polling on error');
        bot.startPolling();
      }, 1 * 1000);
    })
});

/** Exports */
module.exports = bot;
