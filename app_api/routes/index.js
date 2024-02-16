var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/blogs');

router.get('/blogs', ctrlLocations.locationsListByDistance);
router.post('/blogs', ctrlLocations.locationsCreate);
router.get('/blogs/:blogid', ctrlLocations.locationsReadOne);
router.put('/blogs/:blogid', ctrlLocations.locationsUpdateOne);
router.delete('/blogs/:blogid', ctrlLocations.locationsDeleteOne);

module.exports = router;