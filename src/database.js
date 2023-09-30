import fs from 'node:fs/promises';

const dataBasePath = new URL('../db.json', import.meta.url);

export class Database {
    // o '#' torna a propriedade privada no Node
    #database = {};

    constructor() {
        // Inicializa o arquivo DB
        fs.readFile(dataBasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data);
        }).catch(() => {
            this.#persist();
        });
    }

    #persist() {
        fs.writeFile(dataBasePath, JSON.stringify(this.#database));
    }

    select(table) {
        let data = this.#database[table] ?? [];

        return data;
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }

        this.#persist();

        return data;
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id);

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1);
            this.#persist();
        } else {
            throw 'Task não encontrada';
        }
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table][rowIndex] = {...this.#database[table][rowIndex], ...data };
            this.#persist();
        } else {
            throw 'Task não encontrada';
        }
    }

    complete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table][rowIndex] = {
                ...this.#database[table][rowIndex],
                completed_at: Date.now(),
                updated_at: Date.now()
            };
            this.#persist();
        } else {
            throw 'Task não encontrada';
        }
    }
}