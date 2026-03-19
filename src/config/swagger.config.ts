import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Artiste Meetup API", version: "1.0.0" },
    servers: [{ url: "http://localhost:5000/api/v1" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    "./src/routes/*.ts",
    "./src/modules/**/*.route.ts",
    "./src/modules/**/*.dto.ts",
  ],
};

export default swaggerJSDoc(options);
