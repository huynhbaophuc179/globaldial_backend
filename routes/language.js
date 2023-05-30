var express = require('express');
var router = express.Router();
const LanguageController = require("../controller/languageController")

router.get('/', LanguageController.getLanguage)
router.get('/:id', LanguageController.getLanguageId)


module.exports = router;
