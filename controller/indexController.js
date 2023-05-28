const { default: mongoose } = require("mongoose");
const Language = require("../schema/language");
const Topic = require("../schema/topic");
class IndexController {
    constructor() { }

    // sample api call 
    // {
    //     "topicPage": 2,
    //     "topicLimit": 10,
    //     "languagePage": 3,
    //     "languageLimit":5
    // }
    async getAllData(req, res) {
        try {
            const { topicPage, topicLimit, languagePage, languageLimit } = req.body;

            const topicQuery = {};
            const languageQuery = {};

            const topicPageNumber = parseInt(topicPage) || 1;
            const topicPageSize = parseInt(topicLimit) || 10;
            const topicSkip = (topicPageNumber - 1) * topicPageSize;

            const languagePageNumber = parseInt(languagePage) || 1;
            const languagePageSize = parseInt(languageLimit) || 10;
            const languageSkip = (languagePageNumber - 1) * languagePageSize;

            const topicCountPromise = Topic.countDocuments(topicQuery);
            const topicDataPromise = Topic.find(topicQuery).skip(topicSkip).limit(topicPageSize);

            const languageCountPromise = Language.countDocuments(languageQuery);
            const languageDataPromise = Language.find(languageQuery).skip(languageSkip).limit(languagePageSize);

            const [
                topicTotalCount,
                topicData,
                languageTotalCount,
                languageData
            ] = await Promise.all([
                topicCountPromise,
                topicDataPromise,
                languageCountPromise,
                languageDataPromise
            ]);

            const topicTotalPages = Math.ceil(topicTotalCount / topicPageSize);
            const languageTotalPages = Math.ceil(languageTotalCount / languagePageSize);

            res.json({
                topics: {
                    data: topicData,
                    total: topicTotalCount,
                    page: topicPageNumber,
                    pages: topicTotalPages
                },
                languages: {
                    data: languageData,
                    total: languageTotalCount,
                    page: languagePageNumber,
                    pages: languageTotalPages
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }


}

module.exports = new IndexController();
