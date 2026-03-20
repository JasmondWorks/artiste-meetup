const config = {
  env: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 3000,

  debug: process.env.APP_DEBUG === "true",

  db: {
    url: process.env.MONGODB_URI || "mongodb://localhost:27017/artiste_meetup",
  },

  jwt: {
    accessSecret: process.env.ACCESS_SECRET || "access_secret",
    refreshSecret: process.env.REFRESH_SECRET || "refresh_secret",
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "1h",
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "1d",
  },

  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL || "admin@example.com",
    password: process.env.SUPER_ADMIN_PASSWORD || "admin123",
  },

  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
    from: process.env.EMAIL_FROM || "noreply@artiste-meetup.com",
  },
};

export default config;
