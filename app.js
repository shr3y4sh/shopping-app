const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const rootDir = path.dirname(require.main.filename);
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const errorRoute = require('./controllers/error');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorRoute.get404);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
