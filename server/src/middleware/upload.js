const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "..", "uploads", "products");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    cb(null, `${unique}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new Error("Chỉ chấp nhận file ảnh (jpeg, png, webp, gif, avif)"));
  }

  cb(null, true);
}

const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // Tối đa 3MB mỗi ảnh.
    files: 6, // Tối đa 6 ảnh mỗi lần upload.
  },
});

module.exports = { uploadProductImages, uploadDir };
