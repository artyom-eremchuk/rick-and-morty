"use strict";
import dbConfig from "./db-config.js";
import pg from "pg";
import { v4 as uuidv4 } from "uuid";

let baseUrl = "https://rickandmortyapi.com/api/character";
const client = new pg.Client(dbConfig);

client
  .connect()
  .then(() => console.log("Connected successfully"))
  .catch((error) => console.log(error));

await client
  .query(`DROP DATABASE IF EXISTS artyom_eremchuk;`)
  .catch((error) => console.log(error));

await client
  .query(
    `CREATE TABLE IF NOT EXISTS artyom_eremchuk (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256),
    data JSONB
  );`
  )
  .catch((error) => console.log(error));

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

async function insertRows(characters) {
  for (const character of characters) {
    await client
      .query(
        `INSERT INTO artyom_eremchuk(id, name, data) VALUES($1, $2, $3) RETURNING *`,
        [uuidv4(), character.name, character]
      )
      .catch((error) => console.log(error));
  }
}

async function fillDatabase() {
  try {
    while (baseUrl) {
      const response = await fetchData(baseUrl);
      await insertRows(response.results);
      baseUrl = response.info.next;
    }

    console.log("Database filled");
    client.end();
  } catch (error) {
    console.log(error);
  }
}

fillDatabase();
