export const config = {
  nocodb: {
    apiUrl: process.env.NEXT_PUBLIC_NOCODB_API_URL || 'https://app.nocodb.com',
    apiKey: process.env.NEXT_PUBLIC_NOCODB_API_KEY || '',
    tableId: process.env.NEXT_PUBLIC_NOCODB_TABLE_ID || '',
  }
}; 