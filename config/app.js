module.exports = {
    'app': {
        title:'Todo App',
        port: 8080,
        //production, development
        env: 'development'
    },
    'security': {
        salt: 'bjmkh7hkg09iopJklgYJB6',
        cookie: 'bjmkh7hkg09sdfiopJklgYsdfJB6',
        session: 'bjmssdfkh7hkg09iopJsdfklgYJB6'
    },
    'database': {
        'mongodb':{
            url: 'mongodb://admin:ZAQ!2wsxCDE#@ds115110.mlab.com:15110/mcek-app',
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
    },
    'priority': {
        low: 1,
        medium: 2,
        high: 3
    }
};

