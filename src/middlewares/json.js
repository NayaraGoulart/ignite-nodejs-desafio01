export async function json(req, res) {
    const buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk);
    }

    try {
        if (req.headers['content-type'] === 'text/csv') {
            req.body = Buffer.concat(buffers).toString('utf-8');
        } else {
            req.body = JSON.parse(Buffer.concat(buffers).toString());
        }
    } catch {
        req.body = null;
    }

    res.setHeader('Content-type', 'application/json');
}