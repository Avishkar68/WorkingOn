import dotenv from "dotenv";
dotenv.config();

console.log("SUPABASE_JWT_SECRET exists:", !!process.env.SUPABASE_JWT_SECRET);
if (process.env.SUPABASE_JWT_SECRET) {
  console.log("Secret length:", process.env.SUPABASE_JWT_SECRET.length);
  try {
    const decoded = Buffer.from(process.env.SUPABASE_JWT_SECRET, "base64");
    console.log("Decoded buffer length:", decoded.length);
  } catch (err) {
    console.error("Decoding error:", err.message);
  }
}
