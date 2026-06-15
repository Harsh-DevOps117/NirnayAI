import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Loader2,
  MessageSquareText,
  X,
  XCircle,
} from "lucide-react";
import axios from "axios";

interface WhatsAppConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppConnectModal = ({
  isOpen,
  onClose,
}: WhatsAppConnectModalProps) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "loading" | "waiting_for_scan" | "connected" | "disconnected"
  >("loading");

  useEffect(() => {
    if (!isOpen) return;

    const fetchStatus = async () => {
      try {
        const response = await axios.get("/bot/status");
        const data = response.data.data;
        setStatus(data.status || "disconnected");
        setQrCode(data.qr || null);
      } catch (err) {
        console.error("Failed to fetch WhatsApp status", err);
        setStatus("disconnected");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <MessageSquareText className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Connect WhatsApp alerts
              </h2>
              <p className="text-sm text-slate-500">
                Send analysis reports to your phone.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex min-h-[270px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-5">
            {status === "loading" && (
              <div className="flex flex-col items-center text-center text-slate-500">
                <Loader2 className="mb-4 h-9 w-9 animate-spin text-emerald-700" />
                <p className="text-sm font-semibold text-slate-700">
                  Generating secure QR code
                </p>
                <p className="mt-1 text-sm">This refreshes automatically.</p>
              </div>
            )}

            {status === "connected" && (
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="mb-4 h-14 w-14 text-emerald-700" />
                <p className="text-lg font-semibold text-slate-950">
                  WhatsApp is connected
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  You can now send APK files to the bot and receive reports.
                </p>
              </div>
            )}

            {status === "waiting_for_scan" && qrCode && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <QRCodeSVG value={qrCode} size={220} level="M" includeMargin />
              </div>
            )}

            {status === "disconnected" && !qrCode && (
              <div className="flex flex-col items-center text-center">
                <XCircle className="mb-4 h-12 w-12 text-slate-400" />
                <p className="text-sm font-semibold text-slate-800">
                  Bot is currently offline
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try again after the WhatsApp service is running.
                </p>
              </div>
            )}
          </div>

          {status === "waiting_for_scan" && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-950">
                Connection steps
              </h3>
              <ol className="space-y-2 text-sm leading-6 text-slate-600">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                    1
                  </span>
                  Open WhatsApp on your phone.
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                    2
                  </span>
                  Go to Menu or Settings, then Linked Devices.
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                    3
                  </span>
                  Scan the QR code shown here.
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
