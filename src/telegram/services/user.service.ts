import "reflect-metadata";
import AWS from "aws-sdk";
import { User } from "../models/user";
import { injectable } from "inversify";

@injectable()
export class UserService {
    private readonly dynamodb: AWS.DynamoDB.DocumentClient;

    constructor() {
        this.dynamodb = new AWS.DynamoDB.DocumentClient();
    }

    async getUser(id: number): Promise<User | undefined> {
        const tableName = process.env.AWS_TABLE;
        
        if (!tableName) {
            throw new Error('Empty AWS_TABLE env!');
        }

        const key = { 
            id: id
        };

        const params = {
            TableName: tableName,
            Key: key
        };

        const user = await this.dynamodb.get(params).promise();

        return user.Item as User | undefined;
    }

    async addUser(user: User) {
        const tableName = process.env.AWS_TABLE; 

        if (!tableName) {
            throw new Error('Empty AWS_TABLE env!');
        }

        const params = {
            TableName: tableName,
            Item: user
        };

        await this.dynamodb.put(params).promise()
    }

    async updateUser(user: User) {
        const tableName = process.env.AWS_TABLE; 

        if (!tableName) {
            throw new Error('Empty AWS_TABLE env!');
        }

        const params = {
            TableName: tableName,
            Key: {
                'id': user.id
            },
            UpdateExpression: 'set lang = :x',
            ExpressionAttributeValues: {
                ":x": user.lang
            }
        }

        await this.dynamodb.update(params).promise();
    }
}