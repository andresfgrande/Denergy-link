const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

// parse application/json
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const jobRunID = req.body.id;
  const data = req.body.data;

  try {
    const response = await axios.get('https://api.preciodelaluz.org/v1/prices/now?zone=PCB');
    const pricePerMWh = response.data.price;

    // Convert price from €/MWh to €/kWh
    let pricePerkWh = pricePerMWh / 1000;
  
    const resp = {
      jobRunID: jobRunID,
      data: { result: pricePerkWh },
      result: pricePerkWh,
      statusCode: 200
    };
    return res.status(200).json(resp);
  } catch (error) {
    const resp = {
      jobRunID: jobRunID,
      status: 'errored',
      error: error,
      statusCode: 500
    };
    return res.status(500).json(resp);
  }
});

const PORT = process.env.PORT || 9339;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

