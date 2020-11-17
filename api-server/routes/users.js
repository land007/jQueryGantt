const userRoutes = (app, fs) => {

    // variables
    const dataPath = './data/users.json';

    // helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/users/:userId', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // CREATE
    app.post('/users/:userId', (req, res) => {
    	console.log(req.body);

        readFile(data => {
//            const newUserId = Object.keys(data).length + 1;

            // add the new user
//            data[newUserId.toString()] = req.body;
            data.unshift(req.body);
            if(data.length > 20) {
            	data.pop();
            }
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`{"msg": "new user added"}`);
            });
        },
            true);
    });


    // UPDATE
    app.put('/users/:userId/:id', (req, res) => {

        readFile(data => {

            // add the new user
            const userId = parseInt(req.params["id"]);
            data[userId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`{"msg": "users id:${userId} updated"}`);
            });
        },
            true);
    });


    // DELETE
    app.delete('/users/:userId/:id', (req, res) => {

        readFile(data => {

            // add the new user
            const userId = parseInt(req.params["id"]);
//            delete data[userId];
            data.splice(userId, 1);
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`{"msg": "users id:${userId} removed"}`);
            });
        },
            true);
    });
};

module.exports = userRoutes;