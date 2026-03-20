/**
 * Pre-generates the Swagger spec JSON so it can be imported directly by the app.
 *
 * @vercel/node bundles the codebase with ncc — individual .ts source files are
 * not present on the Vercel filesystem at runtime, so swagger-jsdoc's file-glob
 * reader finds nothing. Committing a pre-generated JSON and importing it means
 * the spec is bundled into the deployment and always available.
 *
 * Run whenever JSDoc annotations change:
 *   npm run generate-swagger
 */
import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Artiste Meetup API", version: "1.0.0" },
    // Relative URL works on localhost in dev AND the Vercel domain in production
    servers: [{ url: "/api/v1" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, "../routes/*.ts"),
    path.join(__dirname, "../modules/**/*.route.ts"),
    path.join(__dirname, "../modules/**/*.dto.ts"),
  ],
};

const spec = swaggerJSDoc(options);
const outputPath = path.join(__dirname, "../swagger-spec.json");

fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
console.log(`✓ Swagger spec written to ${outputPath}`);
