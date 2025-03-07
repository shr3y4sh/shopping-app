const mongodb = require('mongodb');

const MongodbClient = mongodb.MongoClient;

const uri =
	'mongodb+srv://marshall:Sqnd1eS83jXaJqAQ@nodecluster.eh4s9.mongodb.net/?retryWrites=true&w=majority&appName=nodeCluster';

let _db;

exports.mongoConnect = async (callback) => {
	try {
		const client = await MongodbClient.connect(uri);
		_db = client.db('shop');

		callback();
	} catch (err) {
		console.log(err);
		throw err;
	}
};

exports.getDb = () => {
	if (_db) {
		return _db;
	}

	throw new Error('No Database Found!');
};
