const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const coursesCard = require('./routes/card')
const authRoutes = require('./routes/auth')
const ordersRoutes = require('./routes/orders')
const profileRoutes = require('./routes/profile')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')
const keys = require('./keys/index')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers')
})

const store = new MongoStore({
    collection: 'session',
    uri: keys.MONGODB_URL
})

app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', "views")

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SECRET_VALUE,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use("/add", addRoutes)
app.use("/courses", coursesRoutes)
app.use("/card", coursesCard)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3000


async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URL, {useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false})
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }

}

start()


