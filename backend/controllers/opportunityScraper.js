import axios from "axios";
import * as cheerio from "cheerio";
import Opportunity from "../models/Opportunity.js";

export const scrapeInternshala = async () => {
  try {
    const url = "https://internshala.com/internships/";
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const scraped = [];

    $(".individual_internship").each((i, el) => {
      const title = $(el).find(".job-title-href").text().trim();
      const company = $(el).find(".company-name").text().trim();
      const stipend = $(el).find(".stipend").text().trim();
      const duration = $(el).find(".duration").text().trim();
      const link =
        "https://internshala.com" +
        $(el).find(".job-title-href").attr("href");

      if (title && link) {
        scraped.push({
          title,
          description: `${title} at ${company}`,
          type: "internship",
          company,
          stipend,
          duration,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          link,
          registrationLink: link,
          tags: ["internship"],
          status: "active",
          postedBy: "000000000000000000000001"
        });
      }
    });

    // 🔥 REMOVE DUPLICATES
    for (const item of scraped) {
      const exists = await Opportunity.findOne({ link: item.link });

      if (!exists) {
        await Opportunity.create(item);
      }
    }

    console.log("✅ Scraping completed");

  } catch (err) {
    console.error("Scraping error:", err);
  }
};