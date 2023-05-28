const { default: mongoose } = require("mongoose");
const Language = require("../schema/language");

class LanguageController {
    constructor() { }



    async getLanguage(req, res) {
        try {
            const { codeName, name } = req.query;
            const { page, limit } = req.body;
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

            const countPromise = Language.countDocuments(query);
            const dataPromise = Language.find(query).skip(skip).limit(pageSize);

            const [totalCount, languageData] = await Promise.all([countPromise, dataPromise]);

            const totalPages = Math.ceil(totalCount / pageSize);

            res.json({
                data: languageData,
                total: totalCount,
                page: pageNumber,
                pages: totalPages
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }


    async getLanguageId(req, res) {
        try {
            // const { codeName, name } = res.query
            const { id } = req.params
            const languageData = await Language.find({ _id: id });

            res.json(languageData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = new LanguageController();
