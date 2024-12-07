import { SNSClient } from "@aws-sdk/client-sns";
import { AWS_BUCKET_REGION, AWS_PUBLIC_KEY,AWS_SESSION_TOKEN,AWS_SECRET_KEY} from "./config.js";

export const client = new SNSClient({ 
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        sessionToken: AWS_SESSION_TOKEN,
    },

});

