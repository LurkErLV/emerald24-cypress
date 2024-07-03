const xml2js = require("xml2js");

describe("Partner API, Faster payment validation", () => {
  it("TC1 - Проверка DOMESTIC платежа не указываю страну, город и адресс платежа", () => {
    cy.fixture("PartnerAPI").then((credentials) => {
      // Request new access token
      cy.request({
        method: "POST",
        url: "https://test-psi.emerald24.co.uk/bifrost/midgard/webhooks/partner/service/token/access/reset",
        headers: {
          "TPP-Registration-Number": credentials["TPP-Registration-Number"],
          "TPP-Client-Secret": credentials.secretToken,
        },
        body: {}, // URLSearchParams() equivalent in Cypress, can be an empty object if no body parameters
        followRedirect: true,
      }).then((response) => {
        // Parse the XML response
        xml2js.parseString(
          response.body,
          { explicitArray: false },
          (err, result) => {
            if (err) {
              throw new Error("Failed to parse XML");
            }

            // Extract the access token
            const accessToken = result.response.accessToken;
            const urlencoded = new URLSearchParams();
            urlencoded.append("document.type", "ACC_TO_ACC_ANY");
            urlencoded.append(
              "document.field[name=subtype]",
              "ACC_TO_ACC_DOMESTIC"
            );
            urlencoded.append(
              "document.field[name=source_acc]",
              credentials.source_acc
            );
            urlencoded.append("document.field[name=currency]", "GBP");
            urlencoded.append("document.field[name=source_currency]", "GBP");
            urlencoded.append("document.field[name=target_currency]", "GBP");
            urlencoded.append("document.field[name=amount]", "0.01");
            urlencoded.append("document.field[name=source_amount]", "0.01");
            urlencoded.append("document.field[name=target_amount]", "0.01");
            urlencoded.append(
              "document.field[name=ben_acc]",
              "GB03EMFG00992100000503"
            );
            urlencoded.append("document.field[name=ben_name]", "John Smith");
            urlencoded.append(
              "document.field[name=info_remmitance]",
              "test partner sepa api"
            );
            urlencoded.append("customer.id", credentials.customer_id);
            urlencoded.append("user.id", "16535439857111");
            urlencoded.append("document.field[name=ben_bank_sort]", "202015");

            // Make DOMESTIC payment
            cy.request({
              method: "POST",
              url: "https://test-psi.emerald24.co.uk/bifrost/midgard/webhooks/partner/payment/document/create",
              headers: {
                "TPP-Registration-Number":
                  credentials["TPP-Registration-Number"],
                "TPP-Client-Access": accessToken,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: urlencoded.toString(),
              followRedirect: true,
            }).then((response) => {
              xml2js.parseString(
                response.body,
                { explicitArray: false },
                (err, result) => {
                  if (err) {
                    throw new Error("Failed to parse XML");
                  }
                  if (result.response.doc[1]["$"].state !== "PSI_RECEIVED") {
                    throw new Error("Payment state is not PSI_RECEIVED");
                  }
                  cy.log(
                    `Payment reference - ${result.response.doc[1]["$"].id}`
                  );
                }
              );
            });
          }
        );
      });
    });
  });
});
