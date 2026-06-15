import {
  makeWASocket,
  useMultiFileAuthState,
  downloadMediaMessage,
  WAMessage,
} from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import axios from "axios";
import FormData from "form-data";
import Redis from "ioredis";

const API_URL = process.env.API_URL || "http://localhost:3000/api/v1";

const BOT_API_TOKEN = process.env.BOT_API_TOKEN || "bot-super-secret-token";

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: "silent" }) as any,
  });

  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const redisPublisher = new Redis(redisUrl, { maxRetriesPerRequest: null });

  redisPublisher.on("error", (error) => {
    console.error("Redis Connection Error:", error.message);
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log("Scan the QR code above to link your WhatsApp!");
      await redisPublisher.set("whatsapp_qr", qr);
      await redisPublisher.set("whatsapp_status", "waiting_for_scan");
    }

    if (connection === "close") {
      await redisPublisher.set("whatsapp_status", "disconnected");
      await redisPublisher.del("whatsapp_qr");
      const shouldReconnect =
        (lastDisconnect?.error as any)?.output?.statusCode !== 401;
      console.log(
        "Connection closed due to ",
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect,
      );
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("WhatsApp Bot is successfully connected!");
      await redisPublisher.set("whatsapp_status", "connected");
      await redisPublisher.del("whatsapp_qr");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    const msg = messages[0];
    if (!msg.message) return;

    const isDocument = !!(
      msg.message.documentMessage || msg.message.documentWithCaptionMessage
    );
    if (msg.key.fromMe && !isDocument) return;

    const sender = msg.key.remoteJid!;

    const documentMessage =
      msg.message.documentMessage ||
      msg.message.documentWithCaptionMessage?.message?.documentMessage;

    if (documentMessage) {
      const fileName = documentMessage.fileName || "unknown.apk";

      if (!fileName.endsWith(".apk")) {
        await sock.sendMessage(sender, {
          text: "❌ Please upload a valid Android .apk file.",
        });
        return;
      }

      try {
        const buffer = (await downloadMediaMessage(msg, "buffer", {}, {
          logger: pino({ level: "silent" }) as any,
          reuploadRequest: sock.updateMediaMessage,
        } as any)) as Buffer;

        const form = new FormData();
        form.append("apk", buffer, fileName);

        const response = await axios.post(`${API_URL}/scan/bot-upload`, form, {
          headers: {
            ...form.getHeaders(),
            "x-bot-token": BOT_API_TOKEN,
            "x-whatsapp-sender": sender,
          },
        });

        const scanData = response.data?.data || response.data;
        const { scanId, cached, report } = scanData;

        if (cached) {
          await sendReportToWhatsApp(sock, sender, report);
        } else {
          await sock.sendMessage(sender, {
            text: `✅ File uploaded successfully! Scan ID: ${scanId}. I will message you when the analysis is complete.`,
          });
        }
      } catch (error: any) {
        console.error("Error processing APK:", error);
        await sock.sendMessage(sender, {
          text: `❌ Error analyzing APK: ${error.response?.data?.message || error.message}`,
        });
      }
    } else if (msg.message.conversation) {
      await sock.sendMessage(sender, {
        text: "🤖 Hello! I am the NirnayAI Malware Analyst Bot. Send me any Android .apk file, and I will scan it for threats, malware, and malicious behaviors.",
      });
    }
  });

  const redisSubscriber = new Redis(redisUrl);

  redisSubscriber.subscribe("scan_completed", (err) => {
    if (err) console.error("Failed to subscribe to Redis", err);
  });

  redisSubscriber.on("message", async (channel, message) => {
    if (channel === "scan_completed") {
      try {
        const { scanId, sender, report } = JSON.parse(message);
        if (sender && report) {
          await sendReportToWhatsApp(sock, sender, report);
        }
      } catch (err) {
        console.error("Error handling scan_completed event", err);
      }
    }
  });
}

async function sendReportToWhatsApp(sock: any, jid: string, report: any) {
  const riskScore = report.risk_score ?? 0;
  
  let riskLevel = "LOW";
  let emoji = "🟢";
  if (riskScore >= 70) {
    riskLevel = "CRITICAL";
    emoji = "🔴";
  } else if (riskScore >= 40) {
    riskLevel = "ELEVATED";
    emoji = "🟡";
  }

  const vectors = (report.malicious_capabilities || []).map((c: any) => `• ${c.capability}`).join("\n") || "None identified";
  const mitigations = (report.actionable_recommendations_for_bank || []).map((r: any) => `• ${r}`).join("\n") || "None";
  
  const installVerdict = report.install_verdict || (riskScore < 50 ? "YES (Safe to Install)" : riskScore < 80 ? "CAUTION (Proceed Carefully)" : "NO (DO NOT INSTALL)");

  const text = `
*NirnayAI Malware Analysis Report*
${emoji} *Risk Level:* ${riskLevel}
*Risk Score:* ${riskScore}/100
*Verdict:* ${installVerdict}

*Threat Classification:*
${report.threat_classification || "Unknown"}

*Executive Summary:*
${report.executive_summary || "No summary provided."}

*Identified Threat Vectors:*
${vectors}

*Recommended Mitigations:*
${mitigations}
  `.trim();

  await sock.sendMessage(jid, { text });
}

connectToWhatsApp();
