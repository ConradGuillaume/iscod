const Article = require("./articles.model");

class ArticlesService {
  getAll() {
    return Article.find({});
  }

  get(id) {
    return Article.findById(id);
  }

  create(data, userId) {
    const article = new Article({
      ...data,
      user: userId,
    });
    return article.save();
  }

  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id) {
    return Article.deleteOne({ _id: id });
  }

  // Nouvelle méthode pour obtenir les articles d'un utilisateur spécifique
  getArticlesByUserId(userId) {
    return Article.find({ user: userId }).populate("user", "-password");
  }
}

module.exports = new ArticlesService();
