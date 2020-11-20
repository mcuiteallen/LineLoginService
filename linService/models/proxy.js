const request = require('request');  

module.exports = class proxyHttp {
    getHttp(inParam, res, callback, STATUS) {
        let code = STATUS.OK
        if(inParam.authorization && inParam.url){
            let tmpToken = inParam.authorization.split(' ');
            const buf = Buffer.from(tmpToken[1], 'base64');
            const authString = buf.toString();
            const basicauth = authString.split(':');
            console.info(basicauth);
            // An object of options to indicate where to post to
            let options = {
                uri: inParam.url,
                method: 'GET',
                auth : {
                    user: basicauth[0],
                    pass: basicauth[1]
                }       
            };
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(JSON.stringify(body));
                    callback(res, code, JSON.parse(JSON.stringify(body)));
                    return ;
                }else{
                    callback(res, code, JSON.stringify(error));
                    return ;
                }
            });    
        }
        return ;
    };    
    postHttp(data, res, callback, STATUS, result) {
        //console.log(JSON.stringify(data));
        //console.log(JSON.stringify(data.request.authorization));
        let code = STATUS.OK
        if(data.request){
            if(data.request.authorization && data.request.url && data.request.content){
                let tmpToken = data.request.authorization.split(' ');
                const buf = Buffer.from(tmpToken[1], 'base64');
                const authString = buf.toString();
                const basicauth = authString.split(':');
                console.info(basicauth);
                // An object of options to indicate where to post to
                let options = {
                    uri: data.request.url,
                    method: 'POST',
                    auth : {
                        user: basicauth[0],
                        pass: basicauth[1]
                    },
                    json: data.request.content           
                };
                //console.log(JSON.stringify(options));
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(JSON.stringify(body));
                        callback(res, code, JSON.stringify(body));
                        return ;
                    }else{
                        console.log(JSON.stringify(error));
                        callback(res, code, JSON.stringify(error));
                        return ;
                    }
                }); 
                   
            }
        }
        return ;
    };    
}