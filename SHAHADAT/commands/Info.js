module.exports.config = {
 name: "info",
 version: "1.2.6",
 hasPermssion: 0,
 credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
 description: "Bot information command",
 commandCategory: "For users",
 hide: true,
 usages: "",
 cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
 const { threadID } = event;
 const request = require("request");
 const fs = require("fs-extra");
 const moment = require("moment-timezone");

 const { configPath } = global.client;
 delete require.cache[require.resolve(configPath)];
 const config = require(configPath);

 const { commands } = global.client;
 const threadSetting = (await Threads.getData(String(threadID))).data || {};
 const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : config.PREFIX;

 const uptime = process.uptime();
 const hours = Math.floor(uptime / 3600);
 const minutes = Math.floor((uptime % 3600) / 60);
 const seconds = Math.floor(uptime % 60);

 const totalUsers = global.data.allUserID.length;
 const totalThreads = global.data.allThreadID.length;

 const msg = `
─┄┅═════❁🌺❁═════┅┄─
🌟 BOT INFORMATION 🌟
─┄┅═════❁🌺❁═════┅┄─
Bot Name : Habib Chat Bot
Prefix : ${config.PREFIX}
Thread Prefix : ${prefix}
Modules : ${commands.size}
Ping : ${Date.now() - event.timestamp}ms

─┄┅═════❁🌺❁═════┅┄─
🌟 OWNER INFORMATION 🌟
─┄┅═════❁🌺❁═════┅┄─
Name : Sk habib
Facebook : facebook.com/100079043707149
Messenger : m.me/100079043707149
WhatsApp : wa.me/+91956405****

─┄┅═════❁🌺❁═════┅┄─
🌟 ACTIVITIES 🌟
─┄┅═════❁🌺❁═════┅┄─
Active Time : ${hours}h ${minutes}m ${seconds}s
Groups : ${totalThreads}
Total Users : ${totalUsers}

─┄┅═════❁🌺❁═════┅┄─
Thanks for using 𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐁𝐨𝐭
─┄┅═════❁🌺❁═════┅┄─
`;

 // Imgur Images
 const imgLinks = [
 "https://i.imgur.com/bVeei2n.jpeg"
 ];

 const imgLink = imgLinks[Math.floor(Math.random() * imgLinks.length)];

 const callback = () => {
 api.sendMessage({
 body: msg,
 attachment: fs.createReadStream(__dirname + "/cache/info.jpg")
 }, threadID, () => fs.unlinkSync(__dirname + "/cache/info.jpg"));
 };

 return request(encodeURI(imgLink))
 .pipe(fs.createWriteStream(__dirname + "/cache/info.jpg"))
 .on("close", callback);
};
