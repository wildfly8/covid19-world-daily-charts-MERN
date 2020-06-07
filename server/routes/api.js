var express = require('express');
var router = express.Router();

router.get('/hello', (req, res) => {
  res.send({express: 'Hello from Express!!'});
});

// router.get('/hello', async (req, res) => {
//   try {
//       const allSales = await Sales.find();
//       res.json(allSales);
//   } catch (error) {
//       res.status(500).json({message: error.message})
//   }
// });

module.exports = router;
