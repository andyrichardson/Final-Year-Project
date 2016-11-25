const config = {
    jwt: {
        secret: '1234',
        expiry: {
            num: 10,
            unit: 'days'
        }
    },
    database: {
        user: 'neo4j',
        pass: 'password',
        server: 'http://fyp-neo4j:7474'
    },
    encryption: {
        saltRounds: 10
    }
};

module.exports = config;
