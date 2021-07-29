/* eslint-disable prefer-const */
/* eslint-disable quotes */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable object-curly-spacing */
"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const mqtt = require("async-mqtt");

const cors = require("cors")({ origin: true });

const dialogflow = require("@google-cloud/dialogflow");

exports.dialogflowGateway = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const { queryInput, sessionId } = request.body;

    const sessionClient = new dialogflow.SessionsClient();

    const sessionPath = sessionClient.projectAgentSessionPath(
      "srsergio-iot",
      sessionId,
    );

    const responses = await sessionClient.detectIntent({
      session: sessionPath,
      queryInput,
    });
    console.log("Detected intent");
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log("  No intent matched.");
    }

    response.send(result);
  });
});

// eslint-disable-next-line spaced-comment
//const { Card, Suggestion } = require("dialogflow-fulfillment");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

exports.FirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log("Dialogflow Request headers: " + JSON.stringify(request.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  async function encenderLuz(agent) {
    var client = await mqtt.connectAsync("mqtts://mqtt.flespi.io", {
      clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
      username:
        "FlespiToken WldwjLB4BQgGBGmZYtQsz0DYh1R4Dn0ow3KFE9y3PCze7J4V3IbqyEcDtTyX4obq",
    });
    try {
      await client.publish("feeds/onoff", JSON.stringify({ status: true }));
      await client.end();
      console.log("Done");
      agent.add(`Respuesta desde el server`);
    } catch (e) {
      console.log(e.stack);
      agent.add(`Hay un problema en el envio`);
    }
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("Encender luz", encenderLuz);
  agent.handleRequest(intentMap);
});
