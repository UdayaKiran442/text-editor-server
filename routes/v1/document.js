const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");

const Document = require("../../models/document");

router.get("/", async (req, res) => {
  try {
    const docs = await Document.find();
    return res.status(StatusCodes.OK).json({
      success: true,
      docs,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/add-docs", async (req, res) => {
  try {
    const newDocument = new Document();
    newDocument.title = req.body.title;
    await newDocument.save();
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Document created succesfully",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/update-docs/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;
    const document = await Document.findById(id);
    if (!document) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Document not found",
      });
    }
    document.content = content;
    await document.save();
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Document updated succesfully",
      document,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    if (!document) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Document not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Document fetched succesfully",
      document,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
