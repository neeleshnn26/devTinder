const{ SendEmailCommand }=require("@aws-sdk/client-ses");
const  { sesClient }=require ("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => { 
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          toAddress,
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data:"<h1>This is email body</h1>",
          },
          Text: {
            Charset: "UTF-8",
            Data: "this is text format email",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Hello world from ses",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };

  const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
      "neeleshnainwal222@gmail.com",
      "neeleshnainwal2001@gmail.com",
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
  // snippet-end:[ses.JavaScript.email.sendEmailV3]
  module.exports= { run };