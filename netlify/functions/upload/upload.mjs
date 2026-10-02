import busboy from 'busboy';

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

export async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, message: 'Method not allowed.' }),
      };
    }

    if (!APPS_SCRIPT_URL) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, message: 'GOOGLE_APPS_SCRIPT_URL is not configured.' }),
      };
    }

    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, message: 'Invalid Content-Type header.' }),
      };
    }

    const bodyBuffer = Buffer.from(event.body, 'base64');
    const bb = busboy({ headers: { 'content-type': contentType } });

    const files = [];
    const fields = {};

    return new Promise((resolve) => {
      bb.on('field', (fieldname, value) => {
        fields[fieldname] = value;
      });

      bb.on('file', (fieldname, file, info) => {
        const { filename, mimeType } = info;
        const chunks = [];

        file.on('data', (chunk) => chunks.push(chunk));
        file.on('end', () => {
          const buffer = Buffer.concat(chunks);
          files.push({
            name: filename || `upload_${Date.now()}`,
            mimeType,
            data: buffer.toString('base64'),
          });
        });
        file.on('error', (err) => {
          console.error('File stream error:', err.message);
        });
      });

      bb.on('finish', async () => {
        try {
          const payload = {
            uploaderName: fields.uploaderName || 'Anonymous',
            files,
          };

          const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          const result = await response.json();

          if (result.success) {
            resolve({
              statusCode: 200,
              headers: { 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ success: true, message: 'Files uploaded successfully!', fileIds: result.fileIds }),
            });
          } else {
            console.error('Apps Script error:', result.error);
            resolve({
              statusCode: 500,
              headers: { 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ success: false, message: 'File upload failed.', error: result.error }),
            });
          }
        } catch (err) {
          console.error('Error forwarding to Apps Script:', err.message);
          resolve({
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: false, message: 'File upload failed.', error: err.message }),
          });
        }
      });

      bb.on('error', (err) => {
        console.error('Busboy error:', err.message);
        resolve({
          statusCode: 500,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ success: false, message: 'Error parsing upload.', error: err.message }),
        });
      });

      bb.end(bodyBuffer);
    });
  } catch (error) {
    console.error('Unexpected server error:', error.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, message: 'Unexpected server error.', error: error.message }),
    };
  }
}
