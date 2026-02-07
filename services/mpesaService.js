import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = "https://sandbox.safaricom.co.ke"; // change to live URL later

// get access token
export const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await axios.get(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  );

  return response.data.access_token;
};

// initiate STK Push
export const initiateSTKPush = async (
  phone,
  amount,
  accountReference,
  transactionDesc
) => {
  const token = await getAccessToken();

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: Buffer.from(
      process.env.MPESA_SHORTCODE +
        process.env.MPESA_PASSKEY +
        new Date()
          .toISOString()
          .replace(/[^0-9]/g, "")
          .slice(0, 14)
    ).toString("base64"),
    Timestamp: new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14),
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  };

  const response = await axios.post(
    `${baseUrl}/mpesa/stkpush/v1/processrequest`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
