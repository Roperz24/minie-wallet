import express from "express"
import cors from "cors"
import helmet from "helmet"
import { ApolloServer } from "apollo-server-express"
import { env } from "@/config/env"
import { typeDefs } from "@/graphql/schema"
import { resolvers } from "@/graphql/resolvers"
import authRoutes from "@/routes/auth"
import walletRoutes from "@/routes/wallets"

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/wallets", walletRoutes)

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization?.slice(7)
      let userId: string | undefined

      if (token) {
        try {
          const decoded = require("@/utils/jwt").JwtService.decodeToken(token)
          userId = decoded?.userId
        } catch {}
      }

      return { userId }
    },
  })

  await server.start()
  server.applyMiddleware({ app })

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`)
    console.log(`GraphQL available at http://localhost:${env.PORT}${server.graphqlPath}`)
  })
}

startServer().catch(console.error)
