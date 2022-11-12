import fastify from 'fastify'

import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider
} from 'fastify-type-provider-zod'
import { z } from 'zod'

(async () => {
  const app = fastify({ logger: true })

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.get('/', async (request, reply) => {
    return { message: 'Hello World' }
  })

  try {
    const address = await app.listen({ host: '0.0.0.0', port: 3333 })
    console.log(`HTTP server running at ${address}`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
})()
