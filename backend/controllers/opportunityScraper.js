import axios from "axios";
import * as cheerio from "cheerio";
import Opportunity from "../models/Opportunity.js";

export const scrapeInternshala = async () => {
  try {
    const url = "https://internshala.com/internships/computer-science-internship/";

    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    const scraped = [];

    const internships = $(".individual_internship");

    for (let i = 0; i < internships.length; i++) {
      const el = internships[i];

      const title = $(el).find(".job-title-href").text().trim();
      const company = $(el).find(".company-name").text().trim();
      const stipend = $(el).find(".stipend").text().trim();
      const duration = $(el).find(".duration").text().trim();

      const relativeLink = $(el).find(".job-title-href").attr("href");
      const link = relativeLink
        ? "https://internshala.com" + relativeLink
        : null;

      if (!title || !link) continue;

      let skills = [];

      try {
        // 🔥 FETCH DETAIL PAGE
        const detailRes = await axios.get(link, {
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        const $$ = cheerio.load(detailRes.data);

        // ✅ CORRECT SKILL SELECTOR
        $$(".round_tabs_container .round_tabs").each((i, skillEl) => {
          const skill = $$(skillEl).text().trim();
          if (skill) skills.push(skill.toLowerCase());
        });

      } catch (err) {
        console.log("⚠️ Failed to fetch details:", link);
      }

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
        tags: skills.length ? skills : [title.toLowerCase()], // 🔥 smart fallback
        status: "active",
        postedBy: "000000000000000000000001"
      });

      // ⚠️ IMPORTANT: avoid rate limiting
      await new Promise(res => setTimeout(res, 800));
    }

    // 🧹 REMOVE OLD SCRAPED DATA
    console.log("🧹 Removing old scraped internships...");
    await Opportunity.deleteMany({
      postedBy: "000000000000000000000001"
    });

    // 🚀 INSERT NEW DATA (FASTER)
    await Opportunity.insertMany(scraped);

    console.log("✅ Scraping with skills completed");

  } catch (err) {
    console.error("Scraping error:", err);
  }
};