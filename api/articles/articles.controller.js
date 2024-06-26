const articlesService = require("./articles.service");
const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");

class ArticlesController {
  async getAll(req, res, next) {
    try {
      const articles = await articlesService.getAll();
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const article = await articlesService.get(id);
      if (!article) {
        throw new NotFoundError();
      }
      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      console.log("Creating article with data:", req.body);
      const article = await articlesService.create(req.body, req.user._id); // Utiliser l'ID de l'utilisateur connecté
      console.log("Article created:", article);
      req.io.emit("article:create", article); // Émission d'un événement socket.io
      res.status(201).json(article);
    } catch (err) {
      console.error("Error creating article:", err);
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new UnauthorizedError(
          "You are not authorized to update articles"
        );
      }

      const id = req.params.id;
      const data = req.body;
      const article = await articlesService.update(id, data);
      req.io.emit("article:update", article); // Émission d'un événement socket.io
      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new UnauthorizedError(
          "You are not authorized to delete articles"
        );
      }

      const id = req.params.id;
      await articlesService.delete(id);
      req.io.emit("article:delete", { id }); // Émission d'un événement socket.io
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
