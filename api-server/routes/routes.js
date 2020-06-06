// load up our shiny new route for users
const userRoutes = require('./users');

const exec = require('child_process').execFile;
const filename = '海事数据中心功能调整排期.xlsx';

const appRouter = (app, fs) => {

    // we've added in a default route here that handles empty routes
    // at the base API url
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });
    
    app.get('/down', function(req, res){
    	exec('node', ['/node/report/main.js', '/node/data/' + filename, '/node/data/users.json'], function(err, data) { 
			console.log(err);
			console.log(data.toString());
			res.setHeader('Content-Type', 'application/octet-stream');
	        let dis = 'attachment;filename=' + filename;
	        console.log('dis', dis);
	        res.setHeader('Content-Disposition', encodeURI(dis)); 
	        fs.createReadStream('/node/data/' + filename).pipe(res);
//    	    res.setHeader('content-type', 'application/json');
//    		res.send({ret_code: file.filename});
		});
    });

    // run our user route module here to complete the wire up
    userRoutes(app, fs);
};

// this line is unchanged
module.exports = appRouter;