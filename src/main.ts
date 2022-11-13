import fastify from 'fastify'
import cors from '@fastify/cors'

import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider
} from 'fastify-type-provider-zod'

import { z } from 'zod'

const GITHUB_API_URL = 'https://api.github.com'

;(async () => {
  const app = fastify({ logger: true })

  await app.register(cors)

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.get('/', async (request, reply) => {
    return { message: 'Hello World' }
  })

  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/users',
    {
      schema: {
        querystring: z.object({
          since: z.string()
        })
      }
    },
    async (request, reply) => {
      const { since } = request.query

      const response = await fetch(`${GITHUB_API_URL}/users?since=${since}&per_page=20`)

      const users = await response.json();

      return users
  })

  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/users/:username/details',
    {
      schema: {
        params: z.object({
          username: z.string()
        })
      }
    },
    async (request, reply) => {
      const { username } = request.params;

      const response = await fetch(`${GITHUB_API_URL}/users/${username}`)

      const user = await response.json()

      return user
    }
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/users/:username/repos',
    {
      schema: {
        params: z.object({
          username: z.string()
        })
      }
    },
    async (request, reply) => {
      const { username }= request.params

      const response = await fetch(`${GITHUB_API_URL}/users/${username}/repos`)

      const repos = await response.json()

      return repos
    }
  )

  try {
    const address = await app.listen({
      host: '0.0.0.0',
      port: Number(process.env.PORT ?? 3333)
    })
    
    console.log(`HTTP server running at ${address}`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
})()
