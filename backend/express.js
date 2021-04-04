import express from 'express'
import bodyParser from 'body-parser'
import compress from 'compression'
import path from 'path'
import morgan from 'morgan'

import { notFound, errorHandler } from './lib/errorMiddleware.js'

import userRoutes from './routes/userRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

const app = express()

const __dirname = path.resolve()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compress())
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}
// app.use(cors())
// app.use(helmet())

app.get('/', (req, res) => {
  res.send('API is working')
})

// user routes
app.use('/api/users', userRoutes)
app.use('/api/upload', uploadRoutes)

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

/* Handling errors */
app.use(notFound)
app.use(errorHandler)

export default app
