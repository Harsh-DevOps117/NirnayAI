import axios from "axios";
import FormData from "form-data";

const MOBSF_URL = process.env.MOBSF_URL || "http://localhost:8000";
const MOBSF_API_KEY =
  process.env.MOBSF_API_KEY ||
  "a41a3dd0bc9afdcd2513856a9a70966f4e308be67fca69de9ea9614613f54835";

const mobsfClient = axios.create({
  baseURL: MOBSF_URL,
  headers: {
    Authorization: MOBSF_API_KEY,
  },
});

export const uploadToMobSF = async (
  fileBuffer: Buffer,
  filename: string,
): Promise<string> => {
  const form = new FormData();
  form.append("file", fileBuffer, filename);

  let retries = 0;
  const maxRetries = 20;

  while (retries < maxRetries) {
    try {
      const response = await mobsfClient.post("/api/v1/upload", form, {
        headers: {
          ...form.getHeaders(),
        },
      });
      return response.data.hash;
    } catch (error: any) {
      if (
        error.code === "ECONNREFUSED" ||
        (error.response && error.response.status >= 500)
      ) {
        retries++;
        console.log(
          `MobSF not ready yet (Attempt ${retries}/${maxRetries}). Waiting 5 seconds...`,
        );
        if (retries >= maxRetries) throw error;
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Failed to upload to MobSF after retries");
};

export const performStaticAnalysis = async (hash: string): Promise<any> => {
  const response = await mobsfClient.post(
    "/api/v1/scan",
    { hash },
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
  return response.data;
};

export const performDynamicAnalysis = async (hash: string): Promise<any> => {
  try {
    console.log(`Configuring device with MobSFy for ${hash}`);
    try {
      await mobsfClient.post(
        "/api/v1/android/mobsfy",
        { identifier: "android-sandbox-1:5555" },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      );
    } catch (e: any) {
      console.warn(
        `MobSFy init warning (might already be configured): ${e.message}`,
      );
    }

    console.log(`Starting Dynamic Analysis for ${hash}`);
    let analysisStarted = false;
    let retries = 0;
    const maxRetries = 3;

    while (!analysisStarted && retries < maxRetries) {
      try {
        await mobsfClient.post(
          "/api/v1/dynamic/start_analysis",
          { hash },
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          },
        );
        analysisStarted = true;
      } catch (e: any) {
        retries++;
        console.log(
          `Attempt ${retries}/${maxRetries} failed to start dynamic analysis. Retrying in 10s...`,
        );
        if (retries >= maxRetries) {
          throw e;
        }
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 60000));

    console.log(`Stopping Dynamic Analysis for ${hash}`);
    await mobsfClient.post(
      "/api/v1/dynamic/stop_analysis",
      { hash },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    const response = await mobsfClient.post(
      "/api/v1/dynamic/report_json",
      { hash },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    return response.data;
  } catch (error) {
    console.error(`Dynamic analysis failed for ${hash}:`, error);

    return null;
  }
};
