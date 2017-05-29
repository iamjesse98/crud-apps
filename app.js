const express = require(`express`)
const path = require(`path`)
const bodyParser = require(`body-parser`)

const mongoose = require(`mongoose`)
mongoose.connect('mongodb://iamjesse:123456@ds155631.mlab.com:55631/nodekb')
let db = mongoose.connection

// check connection
db.once(`open`, () => {
	console.log('connected to mongo')
})

// check for db errors
db.on('error', (err) => {
	console.log(err)
})

// init app
const app = express()

// Bring the models
let Article = require('./models/articles')

// load view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// set public folder
app.use(express.static(path.join(__dirname, 'public')))

// home page
app.get('/', (req, res) => {
	Article.find({}, (err, articles) => {
		err && console.log(err)
		res.render('index', {
				title: 'articles',
				articles: articles
		})
	})
})

// get an article
app.get('/article/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		res.render('article', {
			article: article
		})
	})
})

// another route
app.get('/articles/add', (req, res) => {
	res.render('add_article', {
		title: 'Add an article'
	})
})

// add submit post method
app.post('/articles/add', (req, res) => {
	// console.log('submitted')
	let article = new Article()
	article.title = req.body.title
	article.author = req.body.author
	article.body = req.body.body
	article.save(err => {
		if(err){
			console.log(err)
			return
		}else{
			res.redirect('/')
		}
	})
})

// edit an article
app.get('/article/edit/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		res.render('edit_article', {
			title: 'Edit Article',
			article: article
		})
	})
})

app.post('/articles/edit/:id', (req, res) => {
	let article = {}
	article.title = req.body.title
	article.author = req.body.author
	article.body = req.body.body

	let query = {_id: req.params.id}

	Article.update(query, article, err => {
		if(err) {
			console.log(err)
			return
		} else {
			res.redirect('/')
		}
	})
})

// delete article
app.delete('/article/:id', (req, res) => {
	let query = {_id: req.params.id}
	Article.remove(query, err => {
		err && console.log(err)
		res.send('Success')
	})
})

// start server
app.listen(1444, () => {
	console.log('Project is running at port 1444...')
})