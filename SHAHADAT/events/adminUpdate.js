module.exports.config = {
  name: "adminUpdate",
  eventType: ["log:thread-admins","log:thread-name", "log:user-nickname", "log:thread-call","log:thread-icon", "log:thread-color", "log:link-status", "log:magic-words", "log:thread-approval-mode", "log:thread-poll"],
  version: "1.0.1",
  credits: "Shaon Ahmed",
  description: "Update group information quickly",
    envConfig: {
        autoUnsend: true,
        sendNoti: true,
        timeToUnsend: 10
    }
};

module.exports.run = async function ({ event, api, Threads, Users }) { 
    const { author, threadID, logMessageType, logMessageData } = event;
    const { setData, getData } = Threads;
    const fs = require("fs");
  var iconPath = __dirname + "/emoji.json";
  if (!fs.existsSync(iconPath)) fs.writeFileSync(iconPath, JSON.stringify({}));
  if (author == threadID) return;

    try {
        let dataThread = (await getData(threadID)).threadInfo;
        switch (logMessageType) {
            case "log:thread-admins": {
                if (logMessageData.ADMIN_EVENT == "add_admin") {
                    dataThread.adminIDs.push({ id: logMessageData.TARGET_ID })
                    if (global.configModule[this.config.name].sendNoti) api.sendMessage(`[⚜️] Đã cập nhật người dùng ${logMessageData.TARGET_ID} trở thành quản trị viên nhóm`, threadID, async (error, info) => {
                        if (global.configModule[this.config.name].autoUnsend) {
                            await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                            return api.unsendMessage(info.messageID);
                        } else return;
                    });
                }
                else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                    dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
                    if (global.configModule[this.config.name].sendNoti) api.sendMessage(`[⚜️] Đã cập nhật người dùng ${logMessageData.TARGET_ID} trở thành thành viên`, threadID, async (error, info) => {
                        if (global.configModule[this.config.name].autoUnsend) {
                            await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                            return api.unsendMessage(info.messageID);
                        } else return;
                    });
                }
                break;
            }

            case "log:thread-admins": {
                if (logMessageData.ADMIN_EVENT == "add_admin") {
                    dataThread.adminIDs.push({ id: logMessageData.TARGET_ID })
                    api.sendMessage(`🌸🌿আপনাকে গ্রুপে এডমিন দেয়া হয়েছে🌼🍀\n»🌸🌿ভিকটিম এর ইউজার কোর্ড এটা🌼🍂${logMessageData.TARGET_ID} 🌼🌿 এডমিন দেয়া কমপ্লিট🌸🍀`, threadID);
                }
                else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                    dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
                    api.sendMessage(`🌸🍀আপনাকে গ্রুপ এডমিন থেকে রিমুভ দেয়া হয়েছে🌸🌿\n»🌸☘️তার ইউজার কোর্ড এটা🌸🌿 ${logMessageData.TARGET_ID}`, threadID);
                }
                break;
            }

            case "log:user-nickname": {
                dataThread.nicknames[logMessageData.participant_id] = logMessageData.nickname;
                api.sendMessage(`🌸🍁আপনার নিক নাম🌸🍀\n» ${(logMessageData.nickname.length == 0) ? `🌸🍀চেঞ্জ করছেন ইনি🌼🍂👉 ${logMessageData.participant_id}` : `🌸নিজের নিক নাম নিজের চেঞ্জ করছেন সবাই দেখে নিন ${logMessageData.participant_id} 🤣😂🤣😂🤣😁😁: ${logMessageData.nickname}`}.`, threadID);
                break;
            }

            case "log:thread-name": {
                dataThread.threadName = event.logMessageData.name || null;
                api.sendMessage(`🌸🍀গ্রুপ নাম চেঞ্জ করছেন সবাই দেখে নিন🌸🍁\n» ${(dataThread.threadName) ? `🌸🍂নাম দিছেন এটা🌸☘️ ${dataThread.threadName}` : 'চেঞ্জ গ্রুপ নাম'}.`, threadID);
                break;
            }
            case "log:thread-icon": {
              let preIcon = JSON.parse(fs.readFileSync(iconPath));
              dataThread.threadIcon = event.logMessageData.thread_icon || "👍";
                if (global.configModule[this.config.name].sendNoti) api.sendMessage(`[🌸] গ্রুপ আপডেট কোর্ড [🍂]\n»  ${event.logMessageBody.replace("emoticon", "icon")}\n» Original Icons: ${preIcon[threadID] || "unclear"}`, threadID, async (error, info) => {
                  preIcon[threadID] = dataThread.threadIcon;
                  fs.writeFileSync(iconPath, JSON.stringify(preIcon));
                    if (global.configModule[this.config.name].autoUnsend) {
                        await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                        return api.unsendMessage(info.messageID);
                    } else return;
                });
                break;
               }

            case "log:thread-call": {
                if (logMessageData.event == "group_call_started") {
                    const name = await Users.getNameUser(logMessageData.caller_id);
                    api.sendMessage(`[🌸] গ্রুপ আপডেট [🍂]\n» ${name}  ${(logMessageData.video) ? 'ভিডিও ' : ''}কল.`, threadID);
                }
                else if (logMessageData.event == "group_call_ended") {
                    const callDuration = logMessageData.call_duration;

                    //Transform seconds to hours, minutes and seconds
                    let hours = Math.floor(callDuration / 3600);
                    let minutes = Math.floor((callDuration - (hours * 3600)) / 60);
                    let seconds = callDuration - (hours * 3600) - (minutes * 60);

                    //Add 0 if less than 10
                    if (hours < 10) hours = "0" + hours;
                    if (minutes < 10) minutes = "0" + minutes;
                    if (seconds < 10) seconds = "0" + seconds;

                    const timeFormat = `${hours}:${minutes}:${seconds}`;

                    api.sendMessage(`[🌸] আপডেট গ্রুপ [🌼]\n» ${(logMessageData.video) ? 'ভিডিও ' : ''}কল ইস নট.\n» কল নট: ${timeFormat}`, threadID);

                }
                else if (logMessageData.joining_user) {
                    const name = await Users.getNameUser(logMessageData.joining_user);
                    api.sendMessage(`[🌸] আপডেট গ্রুপ [🍀]\n» ${name} জয়েন্ট ইস ${(logMessageData.group_call_type == '1') ? 'ভিডিও ' : ''}কল.`, threadID);
                }
                break;
            }
        case "log:magic-words":
            {
                return api.sendMessage(`[🌸] Theme ${event.logMessageData.magic_word} added effects: ${event.logMessageData.theme_name}\n[🌸] Emoij: ${event.logMessageData.emoji_effect || "No emoji"}\n[🍂] Total ${event.logMessageData.new_magic_word_count} word effects added`, threadID)
            }
        case "log:thread-poll":
            {
                var str = event.logMessageData.question_json
                var obj = JSON.parse(str);
                if (event.logMessageData.event_type == "question_creation") {
                    return api.sendMessage(`${event.logMessageBody}`, threadID)
                }
                if (event.logMessageData.event_type == "update_vote") {
                    return api.sendMessage(`${event.logMessageBody}`, threadID)
                }
            }
        case "log:thread-approval-mode":
            {
                return api.sendMessage(event.logMessageBody, threadID)
            }
             case "log:thread-color": {
              dataThread.threadColor = event.logMessageData.thread_color || "🌤";
                if (global.configModule[this.config.name].sendNoti) api.sendMessage(`[🌸] আপডেট গ্রুপ [🍁]\n»  ${event.logMessageBody.replace("Topic", "color")}`, threadID, async (error, info) => {
                    if (global.configModule[this.config.name].autoUnsend) {
                        await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                        return api.unsendMessage(info.messageID);
                    } else return;
                });
                break;
            }
        }
        await setData(threadID, { threadInfo: dataThread });
    } catch (e) { console.log(e) };
    }
