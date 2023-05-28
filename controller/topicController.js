const { default: mongoose } = require("mongoose");
const Topic = require("../schema/topic");

class TopicController {
    constructor() { }

    async getTopic(req, res) {
        try {
            const { codeName, name, } = req.query;
            const { page, limit } = req.query;
            console.log(codeName, name, page, limit);

            let query = {};

            if (codeName) {
                query.codeName = { $regex: codeName, $options: 'i' };
            }

            if (name) {
                query.name = { $regex: name, $options: 'i' };
            }

            const pageNumber = parseInt(page) || 1;
            const pageSize = parseInt(limit) || 10;
            const skip = (pageNumber - 1) * pageSize;

            const countPromise = Topic.countDocuments(query);
            const dataPromise = Topic.find(query).skip(skip).limit(pageSize);

            const [totalCount, topicData] = await Promise.all([countPromise, dataPromise]);

            const totalPages = Math.ceil(totalCount / pageSize);

            res.json({
                data: topicData,
                total: totalCount,
                page: pageNumber,
                pages: totalPages
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getTopicId(req, res) {
        try {
            // const { codeName, name } = res.query
            const { id } = req.params
            const topicData = await Topic.find({ _id: id });

            res.json(topicData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = new TopicController();
