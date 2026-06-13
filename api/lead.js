export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const formData = req.body;

    console.log("Lead Received:", formData);

    const salesforceResponse = await fetch(
      "https://data-enterprise-7633--mbcopy.sandbox.my.salesforce-sites.com/services/apexrest/capture-lead",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );

    const salesforceResult = await salesforceResponse.json();

    console.log("Salesforce Response:", salesforceResult);

    return res.status(200).json({
      success: true,
      message: "Lead sent to Salesforce successfully",
      salesforce: salesforceResult,
    });
  } catch (error) {
    console.error("Salesforce Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send lead to Salesforce",
      error: error.message,
    });
  }
}
