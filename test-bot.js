// test-bot.js
const token = "วาง_TOKEN_ของคุณที่นี่_เพื่อทดสอบ";
const serverId = "1450845027113898100";

fetch(`https://discord.com/api/guilds/${serverId}`, {
    headers: { Authorization: `Bot ${token}` }
})
.then(res => res.json())
.then(data => {
    if (data.code === 0) console.log("❌ ล้มเหลว:", data.message);
    else console.log("✅ สำเร็จ! บอทมองเห็นเซิร์ฟเวอร์:", data.name);
})
.catch(err => console.error("Error:", err));
