import fs from "fs";

const dbConfig = {
  connectionString:
    "postgres://candidate:62I8anq3cFq5GYh2u4Lh@rc1b-r21uoagjy1t7k77h.mdb.yandexcloud.net:6432/db1",
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("/home/luber/.postgresql/root.crt").toString(),
  },
};

export default dbConfig;
