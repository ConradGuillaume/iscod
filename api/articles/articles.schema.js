const { Schema, model } = require("mongoose");

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Article", articleSchema);

/*async function test() {
  const articles = await Article.find().populate({
    path: "user",
    select: "-password",
    match: { name: /ben/i },
  });
  console.log(articles.filter((article) => article.user));
}

test();*/
