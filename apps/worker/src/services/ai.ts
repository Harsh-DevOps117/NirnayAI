import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const analyzeMobSFReport = async (staticReport: any, dynamicReport: any): Promise<any> => {
  // 1. Extract critical information to prevent token overflow
  const extractedData = {
    appName: staticReport.app_name,
    packageName: staticReport.package_name,
    permissions: staticReport.permissions,
    trackers: staticReport.trackers?.trackers,
    malwareAnalysis: staticReport.malware_analyzer,
    vulnerabilities: staticReport.manifest_analysis,
    networkActivity: dynamicReport?.network_events,
    apiHooks: dynamicReport?.frida_api_hooks
  };

  // 2. Build the prompt
  const prompt = `
    You are an elite Cyber Fraud Investigator specialized in mobile banking malware and reverse engineering. Your job is to analyze raw static analysis metadata extracted from an Android APK by MobSF and translate it into a structured, executive-grade fraud risk report.

    CRITICAL INSTRUCTIONS:
    1. You must output your response EXACTLY as a single, valid JSON object. Do not include any conversational filler text.
    2. Translate raw technical jargon into clear, human-behavioral risks. For example, if you see the combination of 'RECEIVE_SMS' permission along with background 'INTERNET' access, infer that the app is designed to intercept and exfiltrate banking OTPs.
    3. If you see hardcoded URLs or external domains, evaluate them as potential Command & Control (C2) servers or phishing portals.
    4. Derive a definitive 'risk_score' integer between 0 and 100 based on the severity of the indicators (e.g., Overlay behavior or SMS interception = Critical risk > 85. Basic over-permissioning = Medium risk 40-70).

    EXACT OUTPUT SCHEMA REQUIRED:
    {
      "executive_summary": "string (A clear, 3-sentence paragraph summarizing the app's hidden intent, masquerading behavior, and threat level to bank customers)",
      "risk_score": integer (0 to 100),
      "threat_classification": "string (e.g., 'Critical / Financial Trojan', 'Low Risk / Adware', 'Clean')",
      "malicious_capabilities": [
        {
          "capability": "string (The concise title of the threat vector, e.g., 'OTP Interception', 'Overlay Attack Pattern', 'C2 Data Exfiltration')",
          "proof": "string (Clear explanation of the permissions, strings, or URLs found in the data that prove this capability exists)"
        }
      ],
      "actionable_recommendations_for_bank": [
        "string (Immediate step 1 for security teams)",
        "string (Immediate step 2 for security teams)",
        "string (Immediate step 3 for security teams)"
      ]
    }

    Input Data to Analyze:
    ${JSON.stringify(extractedData, null, 2)}
  `;

  // 3. Call OpenAI
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile", // Groq's high-performance model
    messages: [
      { role: "system", content: "You are a cyber security expert. You always respond in raw JSON format." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2
  });


  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return JSON.parse(content);
};
