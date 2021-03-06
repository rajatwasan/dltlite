let sqliteSync = require('../lib/sqlite-append-sync');

sqliteSync.connect('test/test.db');
sqliteSync.debug = true;

try {
    let result = sqliteSync.exec("CREATE TABLE COMPANYS(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT NOT NULL);");
} catch (e) {
    // if table exists, just ignore
}

sqliteSync.insert("COMPANYS", { NAME: "Synch Test" }, (result) => { });

sqliteSync.exec("BEGIN; DELETE FROM COMPANYS WHERE ID = 6; ROLLBACK;");

sqliteSync.exec('SELECT * FROM COMPANYS', (result) => {
	if (result.error) throw (result.error);
	console.log('Results from test-append-sync', result);
});

// poor developer's test
let testVal1 = "It ain't there";
let testVal2 = "It's there";
sqliteSync.insert("COMPANYS", { NAME: testVal2 });

let test = false;
sqliteSync.exec("SELECT * FROM COMPANYS WHERE NAME = ?", [testVal2], 
	(result) => {
    test = true ? (result.length > 0) : false;
    console.log('Test1 results:', result); 
});
if (!test) console.log('Test1 failed:', testVal1); 

let updated = sqliteSync.update('COMPANYS', 
	{ NAME: testVal2 }, 
	{ NAME: testVal1 });
if (updated != 0) {
	console.log('Test2 update failed:', updated + ' updated rows != 1');
} else console.log('Test2 update results:', updated);
	
let deleted = sqliteSync.delete("COMPANYS", { NAME: testVal2 });
if (deleted != 0) {
	console.log('Test3 delete failed:', deleted + ' deleted rows != 1');
} else console.log('Test3 delete results:', deleted);
	
test = false;
sqliteSync.exec("SELECT * FROM COMPANYS WHERE SUBSTR(NAME,0,2) = 'It'", 
	(result) => {
    test = true ? (result.length == 0) : false;
    console.log('Test4 results:', result);
});
if (!test) console.log('Test4 failed:', testVal2);

console.info('All tests complete. Final results. Bye.');
sqliteSync.exec('SELECT * FROM COMPANYS', (result) => {
	if (result.error) throw (result.error);
	console.log('Results from test-append-sync', result);
});
sqliteSync.close();