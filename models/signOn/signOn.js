//載入 sqlite3
const sqlite3 = require("sqlite3");

module.exports = class signOnModel {
  sign(body, res, roomId, userId, replyToken){       
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let dateNum = new Date().getDate();
    let hour = new Date().getHours();
    let minute = new Date().getMinutes();
    let second = new Date().getSeconds();
    let millisecond = new Date().getMilliseconds();
    let dbName = 'db' + year + month + dateNum;
    var client = new sqlite3.Database('./db/' + dbName + '.db');   
    client.serialize(function() {
      client.run("CREATE TABLE IF NOT EXISTS  signInfo ( id TEXT, roomId TEXT, userId TEXT, replyToken TEXT, time TEXT )", async (err) => {
        if (err) {
          signOnModel.SendLog('ERROR', err.message, 'sign');
        }else{
          let signData = await signOnModel.internalQueryDB('select * from signInfo where id = "' + roomId + userId + '"', dbName);
          if(signData == ''){
            let insertTime = '"' + year + '/' +  month + '/' +  dateNum + '-' +  hour + ':' + minute  + ':' + second  + ':' + millisecond + '"' ;
            let tmpValues = [roomId + userId, roomId, userId, replyToken, insertTime];
            let insertRes = await signOnModel.internalInsertDB(dbName, 'signInfo', '?,?,?,?,?', tmpValues);
            if(insertRes == 'OK'){
              res.json({
                Result: 'OK'
              });
            }else{
              res.json({
                error: 'ERROR INSERT'
              });
            }
          }else{
            res.json({
              Result: 'Already Sign'
            });
          }
        }
      });
      client.close(); 
    }); 
    //signOnModel.insertDB(body, res, roomId, userId, replyToken);
  }  
  getSignInfo(id, res){       
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let dateNum = new Date().getDate();
    let dbName = 'db' + year + month + dateNum;
    var client = new sqlite3.Database('./db/' + dbName + '.db');   
    client.serialize(function() {
      client.run("CREATE TABLE IF NOT EXISTS  signInfo ( id TEXT, roomId TEXT, userId TEXT, replyToken TEXT, time TEXT )", async (err) => {
        if (err) {
          signOnModel.SendLog('ERROR', err.message, 'sign');
        }else{
          let signData = await signOnModel.internalQueryDB('select * from signInfo where id = "' + id + '"', dbName);
          if(signData != ''){
            res.json({
              Result: signData
            });
          }else{
            res.json({
              error: 'Id not found'
            });
          }
        }  
      });
      client.close(); 
    }); 
    //signOnModel.insertDB(body, res, roomId, userId, replyToken);
  }   
  static internalQueryDB(sql, dbName){ 
    return new Promise( async (resolve, reject) => {
      var client = new sqlite3.Database('./db/' + dbName + '.db', (err) => {
        if (err) {
          reject(err.message);
        }
      });
      client.serialize(function() {        
        client.all(sql, function(err, rows) {
          if (err) {
            signOnModel.SendLog('ERROR', err.message, 'internalQueryDB');
            client.close();
            reject(err.message); 
          }else{
            client.close();
            resolve(rows);  
          }
        });
      });
    });
  };   
  static internalEditDB(dbName, sql){ 
    return new Promise( async (resolve, reject) => {
      var client = new sqlite3.Database('./db/' + dbName + '.db', (err) => {
        if (err) {
          reject(err.message);  
        }
      });
      client.serialize(function() {
          client.run(sql, (err) => {
            if (err) {
              signOnModel.SendLog('ERROR', err.message, 'internalEditDB');
              client.close();  
              reject(err.message);        
            }else{
              client.close();  
              resolve('OK');         
            }
          });
      }); 
    });  
  };   
  static internalInsertDB(dbName, tableName, valueText, values){ 
    return new Promise( async (resolve, reject) => {
      var client = new sqlite3.Database('./db/' + dbName + '.db');    
      client.serialize(function() {
          let insertSql = "INSERT INTO " + tableName + " VALUES (" + valueText + ")";
          client.run(insertSql,values, (err) => {
            client.close(); 
            if (err) {
              signOnModel.SendLog('ERROR', err.message, 'internalInsertDB');
              reject(err.message);             
            }else{
              resolve('OK');            
            }
          });
      }); 
    }); 
  };    
  static SendLog(status, message, fun){
    if(status == 'ERROR'){
      console.error('[ERROR] ' + message + ' Func: ' + fun);
    }else{
      console.log('[INFO] ' + message + ' Func: ' + fun);
    }
  };          
}

