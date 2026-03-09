import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { ApiGatewayModule } from "./api-gateway.module";
import { createProxyMiddleware } from "http-proxy-middleware";
import { serviceMap } from "./service-map";
import { createKafkaTopics } from "@ecom/kafka/kafka-topics";

async function bootstrap() {

  console.log("Starting Gateway..."); 

  await createKafkaTopics();

  const app = await NestFactory.create(ApiGatewayModule);

  // 1️⃣ JWT middleware
  app.use((req: any, res, next) => {

    console.log("Incoming request:", req.method, req.url);

    const path = req.url.split("/")[1];

    if (path === "auth") {
      console.log("Auth route — skipping JWT validation");
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("❌ No Authorization header");
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const jwt = require("jsonwebtoken");

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("🟢 JWT verified at Gateway:", decoded);

      // ✅ Attach userId to headers
      req.headers["x-user-id"] = decoded.userId;

      next();

    } catch (err) {

      console.log("❌ Invalid token");

      return res.status(401).json({ error: "Invalid token" });
    }
  });


  // 2️⃣ Dynamic Proxy middleware
  app.use((req, res, next) => {

    const path = req.url.split("/")[1];

    const target = serviceMap[path];

    if (!target) {
      console.log("❌ No service found for:", path);
      return res.status(404).json({ error: "Service not found" });
    }

    console.log("Routing to service:", path);
    console.log("Target:", target);

    const proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
    });

    proxy(req, res, next);
  });

  const port = process.env.GATEWAY_PORT || 9900;

  // await app.listen(port);
  await app.listen(port, "0.0.0.0");

  console.log("Gateway running on port:", port);
}

bootstrap();