const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
const uuid = require('uuid')
const ErrorResponse = require('../utils/errorResponse');

const s3 = new AWS.S3();
new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})

const imageUpload = async (file) => {

    const params = {
        Bucket: 'quzibily',
        Key: `${uuid.v4()}${file.mimetype}${file.name}`, // type is not required
        Body: file.data,
        ACL: 'public-read',
    }

    let location = '';
    try {
        const { Location, Key } = await s3.upload(params).promise();
        console.log({ Location })
        location = Location;
    } catch (error) {
        console.log({ error })
        throw new ErrorResponse(`Error s3 upload ${error.name}`, 500)
    }

    // Save the Location (url) to your database and Key if needs be.
    // As good developers, we should return the url and let other function do the saving to database etc

    return location;

    // To delete, see: https://gist.github.com/SylarRuby/b3b1430ca633bc5ffec29bbcdac2bd52
}

module.exports = { imageUpload }
