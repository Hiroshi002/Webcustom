import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const SERVER_ID = "1450845027113898100";
const ROLE_1 = "1450845498712784926";
const ROLE_2 = "1450846015530864661";

const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }: any) {
      const discordId = profile?.id;
      const botToken = process.env.DISCORD_BOT_TOKEN;

      try {
        const res = await fetch(
          `https://discord.com/api/guilds/${SERVER_ID}/members/${discordId}`,
          {
            headers: { Authorization: `Bot ${botToken?.trim()}` },
          }
        );

        if (!res.ok) {
          // ตรงนี้แหละครับที่จะบอกเราว่าพังเพราะอะไร
          const errorMsg = await res.json();
          console.error("❌ DISCORD API REJECTED:", res.status, errorMsg);
          return false;
        }

        const member = await res.json();
        return member.roles.includes(ROLE_1) || member.roles.includes(ROLE_2);
      } catch (err) {
        console.error("❌ FETCH FAILED:", err);
        return false;
      }
    },


    async jwt({ token, user, account }: any) {
      // เก็บสถานะว่าผ่านการเช็คยศแล้วลงใน Token
      if (user) {
        token.isAdmin = true;
      }
      return token;
    },

    async session({ session, token }: any) {
      session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
