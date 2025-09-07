module.exports.config = {
 name: "help",
 version: "1.0.4",
 hasPermssion: 0,
 credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
 description: "Shows all commands with details",
 commandCategory: "system",
 usages: "[command name/page number]",
 cooldowns: 5,
 envConfig: {
 autoUnsend: true,
 delayUnsend: 20
 }
};

module.exports.languages = {
 "en": {
 "moduleInfo": `

╔═══════════════════════╗
║ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 ✨
╠═══════════════════════╣
║ 🔰 Name: %1
║ ♦️ Page: %2/%3
║ ⚧️ Total: %4
╠═══════════════════════╣
%5
╠═══════════════════════╣
║ 🌼 Prefix: %6
║ 🌸 Bot Name:𝐇𝐚𝐛𝐢𝐛 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐁𝐨𝐭
║ 🍁 Owner: 𝐒𝐊 𝐇𝐀𝐁𝐈𝐁
╚═══════════════════════╝
`
 }
};

// ৪টি ইমগুর লিংক অ্যারে
const imgLinks = [
 "https://i.imgur.com/bW3QHN5.jpeg"
];

module.exports.handleEvent = function ({ api, event, getText }) {
 const { commands } = global.client;
 const { threadID, messageID, body } = event;

 if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
 const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
 if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;

 const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
 const command = commands.get(splitBody[1].toLowerCase());
 const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
 const totalCommands = commands.size;
 const page = 1;

 let commandList = "";
 commands.forEach((cmd) => {
 if (cmd.config && cmd.config.name && cmd.config.description) {
 commandList += `║ ❏ ${cmd.config.name} - ${cmd.config.description}\n`;
 }
 });

 
 const imgLink = imgLinks[Math.floor(Math.random() * imgLinks.length)];
 const fs = require("fs-extra");
 const request = require("request");
 const imgPath = __dirname + "/cache/helppic.jpg";
 const callback = () => api.sendMessage({ body: getText("moduleInfo", command.config.name, page, Math.ceil(totalCommands / 10), totalCommands, commandList, prefix), attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);

 return request(imgLink).pipe(fs.createWriteStream(imgPath)).on("close", () => callback());
};

module.exports.run = function ({ api, event, args, getText }) {
 const request = require("request");
 const fs = require("fs-extra");
 const { commands } = global.client;
 const { threadID, messageID } = event;
 const command = commands.get((args[0] || "").toLowerCase());
 const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
 const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

 const imgLinks = [
 "https://i.imgur.com/bW3QHN5.jpeg"
 ];

 const imgPath = __dirname + "/cache/helppic.jpg";
 const imgLink = imgLinks[Math.floor(Math.random() * imgLinks.length)];

 if (!command) {
 const arrayInfo = [];
 const page = parseInt(args[0]) || 1;
 const numberOfOnePage = 20;
 let msg = "";

 for (var [name] of commands) {
 if (name && name.trim() !== "") arrayInfo.push(name.trim());
 }
 arrayInfo.sort();

 const totalPages = Math.ceil(arrayInfo.length / numberOfOnePage);
 const start = numberOfOnePage * (page - 1);
 const helpView = arrayInfo.slice(start, start + numberOfOnePage);

 for (let cmdName of helpView) {
 if (cmdName && cmdName.trim() !== "") {
 msg += `║ ❏ ${cmdName}\n`;
 }
 }

 const text = `
╔════════════════════════╗
║ 🌐 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 🌐
╠════════════════════════╣
║ ✴️ Page: ${page}/${totalPages}
║ 🔰 Total: ${arrayInfo.length}
╠════════════════════════╣
${msg}╠════════════════════════╣
║ 🌼 Prefix: ${prefix}
║ 🌸 Bot Name: 𝐇𝐚𝐛𝐢𝐛 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐁𝐨𝐭
║ 🌺 Owner Name: 𝐒𝐊 𝐇𝐀𝐁𝐈𝐁
╚═════════════════════════╝
`;

 const callback = () => api.sendMessage({ body: text, attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);
 return request(imgLink).pipe(fs.createWriteStream(imgPath)).on("close", () => callback());
 }

 const detail = getText("moduleInfo", command.config.name, "1", "1", "1", `║ ✪ ${command.config.name} - ${command.config.description}`, prefix);
 const callback = () => api.sendMessage({ body: detail, attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);
 return request(imgLink).pipe(fs.createWriteStream(imgPath)).on("close", () => callback());
};
