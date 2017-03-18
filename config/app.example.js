module.exports = {
    'app': {
        title:'Todo App',
        port: 3000,
        //production, development
        env: 'development'
    },
    'security': {
        salt: '',
        cookie: '',
        session: ''
    },
    'database': {
        'mongodb':{
            url: 'mongodb://user:secret@ds115110.mlab.com:111111/app',
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
        low: 0,
        medium: 1,
        high: 2
    }
};

