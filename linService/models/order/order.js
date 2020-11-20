const request = require('request');   
const url_911 = 'http://911.ak-platform.com';
module.exports = class Order {
    getAnnouncement(res){
        let time = new Date().getTime();
        console.log(time);
        let url = url_911 + '/pub/SuperGateway.php?cmd=202%7C53627%7C891%7C0%7C' + time + '%7C!';
        let options = {
            uri: url,
            method: 'GET',    
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(JSON.stringify(body));
                let wholeData = body;
                let announcement = '';
                if(wholeData != ''){
                    let tmpdata = wholeData.split('001|');
                    let tmpAnnouncement = tmpdata[1].split('\n');
                    announcement = tmpAnnouncement[0];
                }
                console.log(announcement);
                res.json({
                    Result: announcement
                });                
            }else{
                res.json({
                    error: JSON.stringify(error)
                });
            }
        });         
    };
    getAllAnnouncement(res){
        let time = new Date().getTime();
        console.log(time);
        let url = url_911 + '/pub/SuperGateway.php?cmd=311%7C!%7C!&_=' + time;
        let options = {
            uri: url,
            method: 'GET',    
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(JSON.stringify(body));
                res.json({
                    Result: body
                });                
            }else{
                res.json({
                    error: JSON.stringify(error)
                });
            }
        });         
    };    
}
