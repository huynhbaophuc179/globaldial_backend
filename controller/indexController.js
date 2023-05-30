const { default: mongoose } = require("mongoose");
const Language = require("../schema/language");
const Topic = require("../schema/topic");

class IndexController {
    constructor() { }
    async getAllData(req, res) {
        try {
            const { topicCodeName, topicName, languageCodeName, languageName } = req.query;

            console.log(topicCodeName, topicName, languageCodeName, languageName);

            const topicQuery = {};
            const languageQuery = {};

            if (topicCodeName) {
                topicQuery.codeName = { $regex: topicCodeName, $options: 'i' };
            }

            if (topicName) {
                topicQuery.name = { $regex: topicName, $options: 'i' };
            }

            if (languageCodeName) {
                languageQuery.codeName = { $regex: languageCodeName, $options: 'i' };
            }

            if (languageName) {
                languageQuery.name = { $regex: languageName, $options: 'i' };
            }

            const topicDataPromise = Topic.find(topicQuery);
            const languageDataPromise = Language.find(languageQuery);

            const [topicData, languageData] = await Promise.all([topicDataPromise, languageDataPromise]);

            res.json({
                topics: {
                    data: topicData,
                    total: topicData.length,
                },
                languages: {
                    data: languageData,
                    total: languageData.length,
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

}

module.exports = new IndexController();
