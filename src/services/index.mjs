export const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `hello from ${process.env.TABLE_NAME}` }),
  };
};
