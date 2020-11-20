app = require('../app');
const OrderController = require('../controllers/order.js');
const bodyParser = require('body-parser');
const cors = require('cors');
orderController = new OrderController();
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());


app.post('/order/*', orderController.postOrder);
app.get('/order/*', orderController.getOrder);