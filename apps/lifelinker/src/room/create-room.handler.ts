import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { drizzle } from 'drizzle-orm/d1';
import { Context } from "hono";
import { LifelinkerBindings } from "../bindings.type";
import { room } from "../schemas/room.schema";

const createRoomSchema = z.object({
  password: z.string().min(8).max(64),
})

const roomCreatedSchema = z.object({
  id: z.string(),
})

type createRoomRequest = z.infer<typeof createRoomSchema>

const createRoomRoute = createRoute({
  method: 'post',
  path: '/room',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createRoomSchema,
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: roomCreatedSchema,
        }
      },
      description: 'Room created successfully',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            ok: z.literal(false),
          })
        }
      },
      description: 'Could not complete',
    }
  }
})

async function createRoomHandler(context: Context) {
  const db = drizzle(context.env.DB)
  if (!db) {
    return context.json({ message: "Could not complete", ok: false }, 500)
  }
  const request = await context.req.json<createRoomRequest>();
  const id = crypto.randomUUID()
  // TODO: HASH THE PASSWORD
  const insertion = await db.insert(room).values({
    id,
    password: request.password,
  })
  if (insertion.error) {
    return context.json({ message: "Could not complete", ok: false }, 500)
  }
  return context.json({ id }, 201)
}

export function RegisterCreateRoomRoute(
  app: OpenAPIHono<LifelinkerBindings>
) {
  app.openapi(createRoomRoute, createRoomHandler)
}
