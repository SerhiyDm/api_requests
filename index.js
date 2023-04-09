const axios = require("axios");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
const server = express();
require("dotenv").config();

const { PORT = 3001, BASE_URL, HOST } = process.env;
const createPath = (index) => path.resolve(__dirname, "view", `${index}.ejs`);
axios.defaults.baseURL = BASE_URL;

server.use(logger("short"));
server.use(cors());
server.use(express.static("styles"));
server.use(express.json());

server.use("/back", async (req, res, next) => {
  try {
    res.redirect("/");
  } catch (e) {
    next(e);
  }
});
server.use("/:breed", async (req, res, next) => {
  const { breed } = req.params;
  try {
    const {
      data: { message },
    } = await axios.get(`${BASE_URL}breed/${breed}/images/random/40`);
    res.render(createPath("photos"), { message, breed, HOST });
  } catch (e) {
    next(e);
  }
});

server.get("/", async (req, res, next) => {
  try {
    const {
      data: { message },
    } = await axios.get("breeds/list/all").catch();
    breedsList = Object.entries(message);
    res.render(createPath("page"), { breedsList, HOST });
  } catch (e) {
    next(e);
  }
});

server.use((req, res) => {
  const message = "Not found";
  res.status(404).render(createPath("error_page"), { message });
});
server.use((err, req, res, next) => {
  const { message } = err;
  res.status(500).render(createPath("error_page"), { message });
});
server.listen(PORT, console.log("Server running"));
