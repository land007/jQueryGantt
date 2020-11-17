const userRoutes = (app, fs) => {
    // variables
    const dataPath = './data/';
    const dataFile = 'users';
    const dataSuffix = '.json';

    // helper methods
//    const _readFile = (callback, returnJson = false, filePath = dataPath + dataFile + dataSuffix, encoding = 'utf8') => {
    const _readFile = (callback, returnJson = false, filePath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
//                throw err;
                fs.readFile(dataPath + dataFile + dataSuffix, encoding, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    let _data = returnJson ? JSON.parse(data) : data;
                    callback(_data);
                });
            } else {
                let _data = returnJson ? JSON.parse(data) : data;
                callback(_data);
            }
        });
    };

//    const _writeFile = (fileData, callback, filePath = dataPath + dataFile + dataSuffix, encoding = 'utf8') => {
    const _writeFile = (fileData, callback, filePath, encoding = 'utf8') => {
        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }
            callback();
        });
    };

    // READ
    app.get('/users/:userId', (req, res) => {
    	let userId = req.params["userId"];
    	_readFile(data => {
    		res.send(data);
    	},
                true, dataPath + userId + dataSuffix);
    });

    // CREATE
    app.post('/users/:userId', (req, res) => {
    	let userId = req.params["userId"];
    	console.log(req.body);
        _readFile(data => {
//            const newUserId = Object.keys(data).length + 1;
            // add the new user
//            data[newUserId.toString()] = req.body;
            data.unshift(req.body);
            if(data.length > 20) {
            	data.pop();
            }
            _writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`{"msg": "new user added"}`);
            }, dataPath + userId + dataSuffix);
        },
            true, dataPath + userId + dataSuffix);
    });

    // UPDATE
    app.put('/users/:userId/:id', (req, res) => {
    	let userId = req.params["userId"];
        _readFile(data => {
            // add the new user
            const userId = parseInt(req.params["id"]);
            data[userId] = req.body;
            _writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`{"msg": "users id:${userId} updated"}`);
            }, dataPath + userId + dataSuffix);
        },
            true, dataPath + userId + dataSuffix);
    });

    // DELETE
    app.delete('/users/:userId/:id', (req, res) => {
    	let userId = req.params["userId"];
        _readFile(data => {
            // add the new user
            const userId = parseInt(req.params["id"]);
//            delete data[userId];
            data.splice(userId, 1);
            _writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`{"msg": "users id:${userId} removed"}`);
            }, dataPath + userId + dataSuffix);
        },
            true, dataPath + userId + dataSuffix);
    });
};

module.exports = userRoutes;