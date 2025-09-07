module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.2",
  credits: "Islamick Cyber Chat | Modified by Shahadat SAHU",
  description: "Notification of bots or people entering groups with random gif/photo/video",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "pidusage": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];

  const path = join(__dirname, "SHAHADAT", "joinvideo");
  if (!existsSync(path)) mkdirSync(path, { recursive: true });

  const path2 = join(__dirname, "SHAHADAT", "joinGif", "randomgif");
  if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

  return;
};

module.exports.run = async function ({ api, event }) {
  const { join } = global.nodemodule["path"];
  const { threadID } = event;
  const fs = require("fs");
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(
      `[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || ""}`,
      threadID,
      api.getCurrentUserID()
    );

    return api.sendMessage(
      "",
      threadID,
      () =>
        api.sendMessage(
          {
            body: `╭•┄┅═══❁🌺❁═══┅┄•╮
   আসসালামু আলাইকুম-!!🖤💫
╰•┄┅═══❁🌺❁═══┅┄•╯

________________________
𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡 𝐟𝐨𝐫 𝐚dd𝐢𝐧𝐠 𝐦𝐞 𝐭𝐨 𝐲𝐨𝐮𝐫 𝐢-𝐠𝐫𝐨𝐮𝐩-🖤🤗

𝐈 𝐰𝐢𝐥𝐥 𝐚𝐥𝐰𝐚𝐲𝐬 𝐬𝐞𝐫𝐯𝐞 𝐲𝐨𝐮 𝐢𝐧𝐚𝐡𝐚𝐥𝐥𝐚𝐡 🌺❤️
________________________

𝐓𝐨 𝐯𝐢𝐞𝐰 𝐚𝐧𝐲 𝐜𝐨𝐦𝐦𝐚𝐧𝐝:
${global.config.PREFIX}help
${global.config.PREFIX}menu

𝐁𝐎𝐓 𝐍𝐀𝐌𝐄 : ${global.config.BOTNAME || "CYBER BOT"}
\n\n⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`,
            attachment: fs.createReadStream(__dirname + "/SHAHADAT/sahu.mp4")
          },
          threadID
        )
    );
  }

  else {
    try {
      const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
      let { threadName, participantIDs } = await api.getThreadInfo(threadID);

      const threadData = global.data.threadData.get(parseInt(threadID)) || {};
      const path = join(__dirname, "SHAHADAT", "joinvideo");

      var mentions = [],
        nameArray = [],
        memLength = [],
        i = 0;

      for (let p of event.logMessageData.addedParticipants) {
        const userName = p.fullName;
        nameArray.push(userName);
        mentions.push({ tag: userName, id: p.userFbId });
        memLength.push(participantIDs.length - i++);
      }
      memLength.sort((a, b) => a - b);

      let msg =
        typeof threadData.customJoin == "undefined"
          ? ` ╭•┄┅═══❁🌺❁═══┅┄•╮
   আসসালামু আলাইকুম-!!🖤
╰•┄┅═══❁🌺❁═══┅┄•╯

✨🆆🅴🅻🅻 🅲🅾🅼🅴✨

❥𝐍𝐄𝐖~  ~🇲‌🇪‌🇲‌🇧‌🇪‌🇷‌~
[ {name} ]

༆-✿ আপনাকে আমাদের࿐
{threadName}

🌺✨!!—এর পক্ষ-থেকে-!!✨🌺

❤️🫰_ভালোবাস_অভিরাম_🫰❤️

༆-✿আপনি_এই_গ্রুপের {soThanhVien} নং মেম্বার࿐

╭•┄┅═══❁🌺❁═══┅┄•╮
🌸𝐇𝐚𝐛𝐢𝐛 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐁𝐨𝐭🌸
╰•┄┅═══❁🌺❁═══┅┄•╯`
          : threadData.customJoin;

      msg = msg
        .replace(/\{name}/g, nameArray.join(", "))
        .replace(/\{type}/g, memLength.length > 1 ? "Friends" : "Friend")
        .replace(/\{soThanhVien}/g, memLength.join(", "))
        .replace(/\{threadName}/g, threadName);

      if (!existsSync(path)) mkdirSync(path, { recursive: true });

      const randomPath = readdirSync(join(__dirname, "SHAHADAT", "joinGif", "randomgif"));

      let formPush;
      if (randomPath.length != 0) {
        const pathRandom = join(
          __dirname,
          "SHAHADAT",
          "joinGif",
          "randomgif",
          `${randomPath[Math.floor(Math.random() * randomPath.length)]}`
        );
        formPush = { body: msg, attachment: createReadStream(pathRandom), mentions };
      } else formPush = { body: msg, mentions };

      return api.sendMessage(formPush, threadID);
    } catch (e) {
      return console.log(e);
    }
  }
};
