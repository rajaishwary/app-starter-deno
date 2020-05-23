import { Client } from "https://deno.land/x/postgres@v0.4.1/mod.ts";

class Database {
	constructor() {
		this.connect();
	}

	async connect() {
		const config = 'postgres://postgres:postgres@localhost:5432/app-starter-deno';
		this.client = new Client(config);

		await this.client.connect();
	}
}

export default new Database().client;
