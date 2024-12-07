import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY, AWS_SESSION_TOKEN } from './config.js';

const client = new DynamoDBClient({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        sessionToken: AWS_SESSION_TOKEN,
    },
});

const dynamoDb = DynamoDBDocumentClient.from(client);

export async function sessionLogin(sessionData) {
    const params = {
        TableName: 'alumnos-session',
        Item: sessionData,
        ReturnValues: "ALL_OLD"
    };

    try {
        return await dynamoDb.send(new PutCommand(params));
    } catch (error) {
        throw new Error('Error al guardar la sesión en DynamoDB');
    }
}

export async function sessionLogout(sessionData) {

    const updateParams = {
        TableName: 'alumnos-session',
        Key: {
            id: sessionData.id, 
        },
        UpdateExpression: 'SET active = :newActive',
        ExpressionAttributeValues: {
            ':newActive': false,
        },
        ReturnValues: 'ALL_NEW',
    };
    try {
        const result = await dynamoDb.send(new UpdateCommand(updateParams));
    } catch (error) {
        throw new Error('Error al actualizar la sesión en DynamoDB');
    }
}

export async function getSessionString(sessionString) {
    const params = {
        TableName: 'alumnos-session',
        IndexName: 'sessionString-index',
        KeyConditionExpression: 'sessionString = :sessionString',
        FilterExpression: 'active = :active',
        ExpressionAttributeValues: {
            ':sessionString': { S: sessionString },
            ':active': { BOOL: true },
        }
    };

    try {
        const session = await dynamoDb.send(new QueryCommand(params));
        return session.Items.length > 0 ? session.Items[0] : null;
    } catch (error) {
        throw new Error('Error al obtener la sesión en DynamoDB');
    }
}