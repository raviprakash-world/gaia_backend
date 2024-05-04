const db = require("_helpers/db");
const mailConfig = require("mailServerConfig.json");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { DataTypes } = require("sequelize");
require("dotenv").config();

module.exports = async function () {
  try {
    const transactions = await db.Transaction.findAll();
    if (!transactions) {
      throw { message: "transactions not found" };
    }

    const filesOlderThanFourDays = [];

    for (let i = 0; i < transactions.length; i++) {
      // console.log("ReleaseDate", transactions[i].ReleaseDate);

      if (!transactions[i].ReleaseDate) {
        // convert the date string to a JavaScript Date object
        const trapDateArr = transactions[i].TrapDate.split("-");
        const trapDateObj = new Date(
          `${trapDateArr[2]}-${trapDateArr[1]}-${trapDateArr[0]}`
        );

        // calculate the number of milliseconds in 4 days

        // get today's date as a JavaScript Date object
        const today = new Date();

        // calculate the difference in milliseconds between today's date and the trap date
        const diffInMilliseconds = today.getTime() - trapDateObj.getTime();

        // check if the difference is greater than or equal to RELEASE_NOTIFICATION_INTERVAL_IN_MILLISECONDS
        if (
          diffInMilliseconds >=
          parseInt(process.env.RELEASE_NOTIFICATION_INTERVAL_IN_MILLISECONDS)
        ) {
          // more than 4 days after the trap date
          filesOlderThanFourDays.push(transactions[i].FileNo);
          // console.log(filesOlderThanFourDays);

          // await createNotification(transactions[i]);
        }
      }
    }
    console.log("Files older than four days: ", typeof filesOlderThanFourDays);

    for (let i = 0; i < filesOlderThanFourDays.length; i++) {
      await createNotification(filesOlderThanFourDays[i]);
    }
    if (filesOlderThanFourDays.length > 0) {
      await sendEmail(filesOlderThanFourDays);
    }
    // return filesOlderThanFourDays;

    return;
  } catch (e) {
    console.error("Notification Error: ", e);
  }
};

async function createNotification(FileNo) {
  const notificationCheck = await db.Notification.findAll({
    where: {
      fileNo: FileNo,
    },
  });

  if (notificationCheck.length === 0) {
    // sendEmail();
    const notification = await db.Notification.create({
      fileNo: `${FileNo}`,
      notificationDate: `${new Date()}`,
      notificationType: "email",
      status: true,
    });
  }
  return;
}

async function sendEmail(FileNo) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const milliseconds = parseInt(
          process.env.RELEASE_NOTIFICATION_INTERVAL_IN_MILLISECONDS
        );
        const days = milliseconds / (24 * 60 * 60 * 1000);
        const transporter = nodemailer.createTransport(mailConfig);
        const filePath = path.join(__dirname, `/emailTemplate.html`);
        const htmlContent = fs.readFileSync(filePath, "utf-8");
        const injectedHtml = htmlContent
          .replace("{{{FileNo}}}", FileNo)
          .replace("{{{FileNo}}}", FileNo)
          .replace("{{{Days}}}", days);

        // console.log(injectedHtml);

        const mailOptions = {
          from: process.env.FROM_FOR_RELEASE_OF_ANIMAL_INVENTORY_EMAIL,
          to: process.env.TO_FOR_RELEASE_OF_ANIMAL_INVENTORY_EMAIL,
          cc: process.env.CC_FOR_RELEASE_OF_ANIMAL_INVENTORY_EMAIL,
          subject: `URGENT: Pending Release of Animal`,
          html: injectedHtml,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            reject(error);
          } else {
            console.log("Email sent:", info.messageId);
            resolve();
          }
        });
      } catch (error) {
        console.error("Error sending email:", error);
        reject(error);
      }
    }, 5000); // Adjust the delay time (in milliseconds) between each email
  });
}
