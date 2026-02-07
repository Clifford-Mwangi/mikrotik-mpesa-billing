// middlewares/adminAuth.js
export default function adminAuth(req, res, next) {
  // simple token-based admin auth
  const token = req.headers["x-admin-token"] || req.query.adminToken;
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    console.warn("⚠️ ADMIN_TOKEN is not set in .env - admin endpoints are disabled");
    return res.status(403).json({ message: "Admin token not configured" });
  }

  if (!token || token !== expected) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}
