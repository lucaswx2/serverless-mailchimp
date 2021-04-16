"use strict";
const axios = require("axios");
const md5 = require("md5");
const Joi = require("@hapi/joi");
const API_KEY = process.env.API_KEY;
const AUDIENCE_ID = process.env.AUDIENCE_ID;
const DATACENTER = process.env.DATACENTER;

function getRequest(data) {
  data.status_if_new = "subscribed";
  data.status = "subscribed";
  const subscriber_hash = md5(data.email_address.toLowerCase());

  const base64ApiKey = Buffer.from(
    `${process.env.BUFFER_HASH}:${API_KEY}`
  ).toString("base64");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${base64ApiKey}`,
  };

  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/${subscriber_hash}`;

  return {
    url,
    data,
    headers,
  };
}

function validator() {
  return Joi.object({
    email_address: Joi.string().email().required(),
    merge_fields: Joi.object({
      FNAME: Joi.string().required(),
      PHONE: Joi.string().required(),
    }),
  });
}

module.exports.default = async (event) => {
  const { error, value } = await validator().validate(JSON.parse(event.body), {
    abortEarly: true,
  });
  if (error) {
    return {
      statusCode: 422,
      body: error.message,
    };
  }
  const { url, data, headers } = getRequest(value);
  try {
    const response = await axios.put(url, data, { headers });
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response.status,
      body: JSON.stringify(error.response.data),
    };
  }
};
