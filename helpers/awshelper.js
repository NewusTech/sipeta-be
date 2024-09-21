const getKeyFromUrl = (url) => {
    const bucketUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    if (url.startsWith(bucketUrl)) {
        return url.replace(bucketUrl, '');
    }
    return null;
};

module.exports = {
    getKeyFromUrl
};
