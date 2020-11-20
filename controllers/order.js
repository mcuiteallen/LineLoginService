const OrderModel = require('../models/order/order.js');
orderModel = new OrderModel();
const SignOnModel = require('../models/signOn/signOn.js');
signOnModel = new SignOnModel();  

module.exports = class OrderController {
    postOrder (req, res, next) {
        let tmpPath = req.url.split('/');
        let fun = tmpPath[2].split('?');
        if(fun[0] == 'signOn'){
            OrderController.wrapBody(req, res);
        }else{
            res.json({
                error: 'Wrong Path!!' 
            });
        }        
    };   
    getOrder (req, res, next) {
        let tmpPath = req.url.split('/');
        if(tmpPath[2] == 'getSignInfo'){
            signOnModel.getSignInfo(tmpPath[3], res);
        }else if(tmpPath[2] == 'getAnnouncement'){
            orderModel.getAnnouncement(res);
        }else if(tmpPath[2] == 'getAllAnnouncement'){
            orderModel.getAllAnnouncement(res);
        }
        else{
            res.json({
                error: 'Wrong Path!!' 
            });
        }        
    };         
    static wrapBody (req, res){
        let body = req.body;
        let roomId = '';     
        let userId = '';
        let replyToken = '';
        if(body.source && body.source.roomId){
            roomId = body.source.roomId;       
        }else{
            let error = 'Wrong Parameter => roomId not found' ;
            OrderController.SendLog('ERROR', error, 'wrapBody');
            return res.json({
                error: error
            });         
        }    
        if(body.source.userId){
            userId = body.source.userId;       
        }else{
            let error = 'Wrong Parameter => userId not found' ;
            OrderController.SendLog('ERROR', error, 'wrapBody');
            return res.json({
                error: error
            });         
        }   
        if(body.replyToken){
            replyToken = body.replyToken;       
        }else{
            let error = 'Wrong Parameter => replyToken not found' ;
            OrderController.SendLog('ERROR', error, 'wrapBody');
            return res.json({
                error: error
            });         
        }            
        signOnModel.sign(body, res, roomId, userId, replyToken);
    };
    static SendLog(status, message, fun){
        if(status == 'ERROR'){
          console.error('[ERROR] ' + message + ' Func: ' + fun);
        }else{
          console.log('[INFO] ' + message + ' Func: ' + fun);
        }
      };             
}