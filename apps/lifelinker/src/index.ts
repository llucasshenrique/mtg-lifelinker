import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { LifelinkerBindings } from './bindings.type';
import { RegisterCreateRoomRoute } from './room/create-room.handler';

const app = new OpenAPIHono<LifelinkerBindings>();

app.use(logger());
app.use('*', prettyJSON());
app.notFound((c) => c.json({ message: 'Not found', ok: false }));

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
})

RegisterCreateRoomRoute(app);

export default app
