import { randomUUID } from 'node:crypto';

export function readCsvData(req, res) {
    const lines = req.body.split('\n').filter(line => line);
    const newColumnDelimiter = '|||'
    const data = lines.map(line => {
        line = line.replace(/","/g, `"${newColumnDelimiter}"`)
        const columns = line.split(newColumnDelimiter);
        return columns.map(column => column.replace(/"/g, ''));
    });

    const header = data[0];
    const [titleKey, descriptionKey] = header;

    if (titleKey === 'title' && descriptionKey === 'description') {
        req.body = data.slice(1).map(line => {
            const [title, description] = line;
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: Date.now(),
                updated_at: null
            };
            return task;
        }) || [];
    } else {
        throw 'Invalid header. It must have "title" and "description" properties.';
    }
}