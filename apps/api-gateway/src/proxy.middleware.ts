import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {

  use(req: any, res: any, next: () => void) {

    const proxy = createProxyMiddleware({
      target: process.env.AUTH_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: {
        '^/auth': '/auth',
      },
    });

    return proxy(req, res, next);
  }

}