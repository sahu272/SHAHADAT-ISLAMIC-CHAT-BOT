module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "Jahid Hasan Rajib",
  description: "Notify the Bot or the person leaving the group with a random gif/photo/video",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

  const path = join(__dirname, "SHAHADAT", "leaveGif", "randomgif");
  if (existsSync(path)) mkdirSync(path, { recursive: true });	

  const path2 = join(__dirname, "SHAHADAT", "leaveGif", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}

module.exports.run = async function({ api, event, Users, Threads }) {
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
  const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
  const { join } =  global.nodemodule["path"];
  const { threadID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dellhi").format("DD/MM/YYYY || HH:mm:s");
  const hours = moment.tz("Asia/Dellhi").format("HH");
  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
  const type = (event.author == event.logMessageData.leftParticipantFbId) ? "leave" : "managed";
  const path = join(__dirname, "events", "123.mp4");
  const pathGif = join(path, `${threadID}123.mp4`);
  var msg, formPush

  if (existsSync(path)) mkdirSync(path, { recursive: true });

(typeof data.customLeave == "undefined") ? msg = "•—»✨ {name} ✨«—•\n ╭•┄┅═══❁🌺❁═══┅┄•╮ \n         ｢ 𝗔𝗟𝗟𝗔𝗛𝗔𝗙𝗘𝗭 ｣     \n ╰•┄┅═══❁🌺❁═══┅┄•╯ \n  •—»✨       {type}  ✨«—•\n\n•—»✨ বড্ড ভুল করলে ✨«—•  \n\n•—»✨ {name} ✨«—•\n\nইসলামিক গ্রুপ থেকে বের হয়ে \n\n যে এই সুন্দর  ইসলামিক গ্রুপ ছেরে চলে গেছে তার অনুসরণ তুমরা করো নাহ__//💙🥺-!! {session} || {time}" : msg = data.customLeave;
  msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, type).replace(/\{session}/g, hours <= 10 ? "leave time" : 
    hours > 10 && hours <= 12 ? "__" :
    hours > 12 && hours <= 18 ? "__" : "__").replace(/\{time}/g, time);  

  const randomPath = readdirSync(join(__dirname, "SHAHADAT", "leaveGif", "randomgif"));

  if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif) }
  else if (randomPath.length != 0) {
    const pathRandom = join(__dirname, "SHAHADAT", "leaveGif", "randomgif",`${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
    formPush = { body: msg, attachment: createReadStream(pathRandom) }
  }
  else formPush = { body: msg }

  return api.sendMessage(formPush, threadID);
                            }
