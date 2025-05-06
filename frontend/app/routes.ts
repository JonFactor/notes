import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "./routes/Home.tsx"),
  route("/loading", "./routes/loading.tsx"),
  route("/generate", "./routes/generate.tsx"),
  route("/card", "./routes/card.tsx"),
  route("/quiz", "./routes/quiz.tsx"),
  route("/review", "./routes/review.tsx"),
] satisfies RouteConfig;
