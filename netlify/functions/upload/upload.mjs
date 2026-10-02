import { google } from 'googleapis';
import { createWriteStream, unlinkSync, createReadStream } from 'fs';
import { join } from 'path';
import busboy from 'busboy';

// Google Auth setup
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

if (!FOLDER_ID) {
  console.error('ERROR: GOOGLE_DRIVE_FOLDER_ID environment variable is not set');
}

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

    console.log('Processing file upload...');
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    console.log('Received Content-Type:', contentType);

    if (!contentType || !contentType.includes('multipart/form-data')) {
      console.error('Invalid Content-Type:', contentType);
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, message: 'Invalid Content-Type header.' }),
      };
    }

    const bodyBuffer = Buffer.from(event.body, 'base64');

    // busboy v1 API: called as a function, file event info is an object
    const bb = busboy({ headers: { 'content-type': contentType } });
    const fileIds = [];
    const uploadPromises = [];

    return new Promise((resolve, reject) => {
      bb.on('file', (fieldname, file, info) => {
        const { filename, mimeType } = info;
        console.log(`Processing file: ${filename}`);

        const uploadPromise = new Promise((res, rej) => {
          const safeName = filename || `upload_${Date.now()}`;
          const tempFilePath = join('/tmp', safeName);
          const writeStream = createWriteStream(tempFilePath);

          file.pipe(writeStream);

          // Wait for the write stream to finish flushing before uploading
          writeStream.on('finish', async () => {
            try {
              const fileMetadata = { name: safeName, parents: [FOLDER_ID] };
              const media = { mimeType, body: createReadStream(tempFilePath) };

              const response = await drive.files.create({
                resource: fileMetadata,
                media,
                fields: 'id',
              });

              fileIds.push(response.data.id);
              console.log(`Uploaded file ID: ${response.data.id}`);
              unlinkSync(tempFilePath);
              res();
            } catch (error) {
              console.error('Error during file upload:', error.message);
              try { unlinkSync(tempFilePath); } catch (_) {}
              rej(error);
            }
          });

          writeStream.on('error', (error) => {
            console.error('Write stream error:', error.message);
            rej(error);
          });

          file.on('error', (error) => {
            console.error('File stream error:', error.message);
            rej(error);
          });
        });

        uploadPromises.push(uploadPromise);
      });

      bb.on('finish', async () => {
        try {
          await Promise.all(uploadPromises);
          resolve({
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
              success: true,
              message: 'Files uploaded successfully!',
              fileIds,
            }),
          });
        } catch (error) {
          console.error('Error completing upload:', error.message);
          resolve({
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
              success: false,
              message: 'File upload failed.',
              error: error.message,
            }),
          });
        }
      });

      bb.on('error', (error) => {
        console.error('Busboy error:', error.message);
        resolve({
          statusCode: 500,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({
            success: false,
            message: 'Error parsing upload.',
            error: error.message,
          }),
        });
      });

      bb.end(bodyBuffer);
    });
  } catch (error) {
    console.error('Unexpected server error:', error.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Unexpected server error.',
        error: error.message,
      }),
    };
  }
}
