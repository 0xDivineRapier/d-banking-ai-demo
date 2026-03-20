
/**
 * D-Banking SNAP BI Middleware Logic
 * Strictly compliant with Bank Indonesia (BI) SNAP Standards
 */

export interface SNAPHeaders {
  'X-TIMESTAMP': string;
  'X-SIGNATURE': string;
  'X-PARTNER-ID': string;
  'X-EXTERNAL-ID': string;
  'CHANNEL-ID': string;
  'X-CLIENT-ID'?: string;
  'Authorization'?: string;
}

export interface SNAPResponse {
  responseCode: string;
  responseMessage: string;
  additionalInfo?: Record<string, any>;
}

// Official SNAP BI Error Codes Mapping
export const SNAP_ERROR_CODES = {
  SUCCESS: { responseCode: '2000000', responseMessage: 'Successful', httpStatus: 200 },
  INVALID_SIGNATURE: { responseCode: '4017300', responseMessage: 'Unauthorized. Invalid Signature', httpStatus: 401 },
  INVALID_TOKEN: { responseCode: '4017301', responseMessage: 'Unauthorized. Invalid Token', httpStatus: 401 },
  BAD_REQUEST: { responseCode: '4007300', responseMessage: 'Bad Request. Invalid Mandatory Field', httpStatus: 400 },
  CONFLICT: { responseCode: '4097300', responseMessage: 'Conflict. Duplicate External ID', httpStatus: 409 },
  NOT_FOUND: { responseCode: '4047300', responseMessage: 'Not Found', httpStatus: 404 },
  INTERNAL_ERROR: { responseCode: '5007300', responseMessage: 'Internal Server Error', httpStatus: 500 }
};

/**
 * Utility to generate SNAP Symmetric String To Sign
 */
export const generateSymmetricStringToSign = (
  method: string,
  url: string,
  token: string,
  body: string,
  timestamp: string
): string => {
  // Minify body and SHA256 Hash it
  // Note: In real Node environments, you'd use crypto.createHash('sha256')
  return `${method.toUpperCase()}:${url}:${token}:${body}:${timestamp}`;
};

/**
 * Utility to generate SNAP Asymmetric String To Sign (Token Request)
 */
export const generateAsymmetricStringToSign = (clientId: string, timestamp: string): string => {
  return `${clientId}|${timestamp}`;
};

export const nodeMiddlewareCode = `
import crypto from 'crypto';

/**
 * SNAP BI Symmetric Middleware (For Transactions)
 * Handles HMAC-SHA512 Verification
 */
export const snapSymmetricMiddleware = async (req, res, next) => {
  const { 
    'x-timestamp': timestamp, 
    'x-signature': signature,
    'x-partner-id': partnerId,
    'x-external-id': externalId,
    'channel-id': channelId,
    'authorization': auth
  } = req.headers;

  // 1. Mandatory Header Validation
  if (!timestamp || !signature || !partnerId || !externalId || !channelId || !auth) {
    return res.status(400).json({
      responseCode: '4007300',
      responseMessage: 'Bad Request. Mandatory header missing'
    });
  }

  // 2. Timestamp Window Check (Standard BI SNAP: 5 minutes)
  const reqTime = new Date(timestamp).getTime();
  const now = Date.now();
  if (Math.abs(now - reqTime) > 300000) {
    return res.status(401).json({
      responseCode: '4017302',
      responseMessage: 'Unauthorized. Invalid Timestamp'
    });
  }

  // 3. Verify Signature
  const accessToken = auth.split(' ')[1];
  const bodyHash = crypto.createHash('sha256')
    .update(JSON.stringify(req.body))
    .digest('hex').toLowerCase();
    
  const stringToSign = \`\${req.method}:\${req.originalUrl}:\${accessToken}:\${bodyHash}:\${timestamp}\`;
  
  const hmac = crypto.createHmac('sha512', process.env.CLIENT_SECRET)
    .update(stringToSign)
    .digest('base64');

  if (hmac !== signature) {
    return res.status(401).json({
      responseCode: '4017300',
      responseMessage: 'Unauthorized. Invalid Signature'
    });
  }

  // 4. Idempotency Check (Check externalId in DB)
  const isDuplicate = await db.transactions.findFirst({ where: { x_external_id: externalId } });
  if (isDuplicate) {
    return res.status(409).json({
      responseCode: '4097300',
      responseMessage: 'Conflict. Duplicate External ID'
    });
  }

  next();
};
`;
