"use server";

import fs from "fs/promises";
import path from "path";

const CUSTOMERS_DIR = "E:/MData/customers";
const KENNIS_DIR = "E:/MData/Kennis";

export async function getRealCustomers() {
  try {
    const folders = await fs.readdir(CUSTOMERS_DIR, { withFileTypes: true });
    const customers = [];

    // Parse business data for potential mapping
    const businessDataContent = await fs.readFile(path.join(KENNIS_DIR, "Business_Data.md"), "utf-8").catch(() => "");
    
    for (const folder of folders) {
      if (!folder.isDirectory()) continue;
      const customerId = folder.name;
      const folderPath = path.join(CUSTOMERS_DIR, customerId);
      
      let lastModified = new Date();
      try {
        const stats = await fs.stat(folderPath);
        lastModified = stats.mtime;
      } catch (e) {}

      // Look for package.json or README.md to infer more info
      let description = "Project directory";
      let url = `http://${customerId.toLowerCase()}.com`; // Guess URL based on folder name
      
      try {
        const pkg = JSON.parse(await fs.readFile(path.join(folderPath, "package.json"), "utf-8"));
        description = pkg.description || pkg.name || description;
      } catch (e) {}

      customers.push({
        id: customerId,
        identity: {
          name: "Owner / Admin", // Generic since we don't have exact contacts in the folder
          email: `admin@${customerId.toLowerCase()}.com`,
          phone: "Unknown",
          company: customerId,
          title: "Project Owner",
          website: url
        },
        firmographics: {
          size: "Unknown",
          industry: "Web Development",
          revenue: "Unknown"
        },
        financial: {
          lastPaid: "N/A",
          nextPaymentDue: "N/A",
          mrr: 0,
          ltv: 0,
          plan: "Custom Project",
          status: "Active"
        },
        engagement: {
          emailOpenRate: "0%",
          websiteVisits: 0,
          recentSupportTickets: 0
        },
        productUsage: {
          loginFrequency: "N/A",
          timeInApp: "N/A",
          lastActive: lastModified.toLocaleDateString(),
          activeUsers: 1,
          activeUsersTrend: 0
        },
        feedback: {
          nps: 0,
          csat: "N/A",
          sentiment: "Unknown"
        },
        timeline: [
          { date: lastModified.toLocaleDateString(), event: "Last modified on disk" },
          { date: "Initial", event: "Project folder created" }
        ]
      });
    }
    
    return customers.length > 0 ? customers : null;
  } catch (error) {
    console.error("Error reading customers directory:", error);
    return null;
  }
}
