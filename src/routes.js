import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks');
            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;
            if (!title) {
                return res.writeHead(400).end('Missing Task title');
            }
            if (!description) {
                return res.writeHead(400).end('Missing Task description');
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: Date.now(),
                updated_at: Date.now()
            };

            database.insert('tasks', task);

            return res.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body
            const task = {};

            if (title) {
                task.title = title;
            }

            if (description) {
                task.description = description;
            }

            try {
                database.update('tasks', id, {
                    ...task,
                    updated_at: Date.now()
                });
    
                return res.writeHead(204).end();
            } catch (error) {
                return res.writeHead(400).end(error);
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            try {
                database.delete('tasks', id);
                return res.writeHead(204).end();
            } catch (error) {
                return res.writeHead(400).end(error);
            }
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params;

            try {
                database.complete('tasks', id);
                return res.writeHead(204).end();
            } catch (error) {
                return res.writeHead(400).end(error);
            }
        }
    },
];