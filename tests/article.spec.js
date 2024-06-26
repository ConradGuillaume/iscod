const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.model");
const User = require("../api/users/users.model");

jest.mock("../config", () => ({
  secretJwtToken: "test",
}));

describe("Tester API articles", () => {
  let token;
  const USER_ID = "fakeUserId";
  const ARTICLE_ID = "fakeArticleId";
  const MOCK_ARTICLE = {
    _id: ARTICLE_ID,
    title: "Test Article",
    content: "This is a test article.",
    user: USER_ID,
    status: "draft",
  };
  const MOCK_ARTICLE_CREATED = {
    _id: "newArticleId",
    title: "Created Article",
    content: "This is a created article.",
    user: USER_ID,
    status: "published",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID, role: "admin" }, config.secretJwtToken);
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOne");
    mockingoose(Article).toReturn([MOCK_ARTICLE], "find"); 
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOneAndUpdate");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOneAndDelete");
    mockingoose(User).toReturn({ _id: USER_ID, role: "admin" }, "findOne");
  });

  test("[Articles] Get All", async () => {
    const res = await request(app)
      .get("/api/articles")
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const updatedArticle = {
      ...MOCK_ARTICLE,
      title: "Updated Title",
    };
    mockingoose(Article).toReturn(updatedArticle, "findOneAndUpdate");

    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send(updatedArticle)
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updatedArticle.title);
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
