const db = require('../utils/db');

module.exports = {
    all: _ => db.load('select * from Users'),
    add: entity => db.add(entity, 'Users'),
    singleByUserName: async username => {
        //console.log(username);
        const rows = await db.load(`select * from Users where username = '${username}'`) 
        //console.log(rows[0]);
        if(rows.length > 0)
            return rows[0];

        return null;
    }
}