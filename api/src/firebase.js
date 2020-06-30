var https = require("https");

const IDENTITY_URL =
  "https://swapi-examples.codingtree.pl/.netlify/identity/user";

function getCookie(cookies, cookiename) {
  var cookiestring = RegExp(cookiename + "=[^;]+").exec(cookies);
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
  );
}

function getUserData(token, callback) {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  https
    .get(
      IDENTITY_URL,
      {
        headers,
      },
      (res) => {
        console.log("statusCode:", res.statusCode);
        console.log("headers:", res.headers);

        var payload = "";
        res.on("data", (chunk) => {
          payload += chunk;
        });

        res.on("end", () => {
          const deserializedPayload = JSON.parse(payload);

          if (deserializedPayload.code) {
            callback({
              statusCode: deserializedPayload.code,
              message: deserializedPayload.msg,
            });
          } else {
            callback(undefined, payload);
          }
        });
      }
    )
    .on("error", (e) => {
      callback({
        statusCode: 500,
        message: "Error while fetching user data",
      });
    });
}

const handler = function (event, context, response) {
  var token = getCookie(event.headers.cookie, "nf_jwt");
  getUserData(token, (err, payload) => {
    if (err === undefined) {
      response(null, {
        statusCode: 200,
        body: JSON.stringify({ event, context, payload }),
      });
    } else {
      response(null, {
        statusCode: 500,
        body: JSON.stringify({ event, context, err, payload }),
      });
    }
  });
};

exports.handler = handler;

/* TEST CODE 
handler(
  {
    headers: {
      cookie:
        "nf_jwt=TOKEN_HERE",
    },
  },
  {},
  (err, payload) => {
    const data = JSON.parse(payload.body);
    console.log("RESULT", { err, data });
  }
);
*/