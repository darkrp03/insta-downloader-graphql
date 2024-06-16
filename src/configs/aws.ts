import AWS from "aws-sdk";

export function loadAwsCredentials() {
    const awsAccessKey = process.env.AWS_ACCESS_KEY;
    const awsSecretKey = process.env.AWS_SECRET_KEY;

    if (!awsAccessKey || !awsSecretKey) {
        throw new Error('Empty aws credentials!');
    }

    AWS.config.update({
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
        region: 'us-east-1'
    });
}