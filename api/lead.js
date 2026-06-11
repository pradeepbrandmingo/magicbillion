export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  const formData = req.body;
  console.log("Lead Received:", formData);

  // Google Apps Script Web App URL
  // Is URL ko securely set karne ke liye environment variable GOOGLE_SHEET_WEBAPP_URL ka use karein.
  // Ya fir temporary testing ke liye niche "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE" ko replace kar sakte hain.
  const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL || "https://script.google.com/macros/s/AKfycbzo4rJgyPvDKPSiSgjxx4opYT-4OAt8ifGncol8wpR9gyTcN_ToerB7Dxsm2OCihvmt/exec";

  if (webAppUrl && webAppUrl !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
    try {
      const response = await fetch(webAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.error("Failed to forward data to Google Sheet:", response.statusText);
      } else {
        console.log("Successfully sent to Google Sheet!");
      }
    } catch (error) {
      console.error("Error sending to Google Sheet:", error);
    }
  } else {
    console.warn("GOOGLE_SHEET_WEBAPP_URL is not configured. Google Sheets saving skipped.");
  }

  return res.status(200).json({
    success: true,
    message: "Lead received successfully",
    data: formData,
  });
}
