const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const coursesCard = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const User = require('./models/user')



const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
})
app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', "views")

app.use (async (req, res, next) => {
    try {
        req.user = await User.findById('5ef0f896eec5c736e0ebdfcb')
        next()
    } catch (e) {
        console.log(e)
    }

})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use("/add", addRoutes)
app.use("/courses", coursesRoutes)
app.use("/card", coursesCard)
app.use('/orders', ordersRoutes)

const PORT = process.env.PORT || 3000


async function start() {
    try {
        const url = `mongodb+srv://Niga9L:nZ90JfXTL5TINbhu@cluster0-csbuk.mongodb.net/shop`
        await mongoose.connect(url, {useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false})
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'lyaginvanya@gmail.com',
                name: 'Niga9L',
                cart: {items: []}
            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }

}

start()


