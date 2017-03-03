module.exports = {
    'app': {
        title:'App Name',
        port: 8080,
        //production, development
        env: 'production'
    },
    'security': {
        salt: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        cookie: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        session: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    },
    'database': {
        'mongodb':{
            url: 'mongodb://user:pass@ds113000.mlab.com:13000/your-app',
            'options':{ 
                server:{ 
                    socketOptions: { 
                        keepAlive: 300000, 
                        connectTimeoutMS: 30000 
                    } 
                }, 
                replset:{ 
                    socketOptions: { 
                        keepAlive: 300000, 
                        connectTimeoutMS : 30000 
                    } 
                } 
            }
        }
    }
};

