import {getCode, generateLatvianPhoneNumber, generateRandomEmail} from "../../support/utils";
import PSI_Creds from "../../fixtures/PSI_Credentials.json";

describe('Validation testing', () => {
    it('TC1 - Проверка на наличие ошибки после повторного запроса СМС кода на этапе смены пароля', () => {
        const phoneNumber = generateLatvianPhoneNumber();

        cy.visit("https://test-app.emerald24.co.uk/#/register");
        cy.get("#customer_registration_mobile_personal").click();
        cy.get("#select2-country_of_location-container").click();
        cy.get(".select2-search__field").type("371", {delay: 100});
        cy.contains("li", "+371 Latvia").click();
        cy.get("#phone_number_visible").type(phoneNumber)
        cy.get("#privacy_policy_confirmed").click();
        cy.contains("button", "Send SMS code").click();
        cy.wait(1000);
        getCode(PSI_Creds.login, PSI_Creds.password, `+371${phoneNumber}`, "mdr:service.authentication.challenge", "Create captcha image for").then((code) => {
            cy.get("#dtoken").type(code);
        });
        cy.contains("button", "Confirm").click();
        cy.wait(2000);
        getCode(PSI_Creds.login, PSI_Creds.password, `+371${phoneNumber}`, "dwh:dispatcher.object.payment.update").then((code) => {
            cy.get("#rtoken").type(code);
        });
        cy.contains("button", "Confirm").click();
        cy.get("#email").type(generateRandomEmail());
        cy.contains("button", "Next").click();
        cy.wait(30000);
        getCode(PSI_Creds.login, PSI_Creds.password, `+371${phoneNumber}`, "ext:external.heimdall.integration.send.temporary.token").then((password) => {
            cy.wrap(password).as('temporaryPassword');
            cy.get("#ssoldpassword").type("WrongPassword");
        });
        cy.wait(6000);
        cy.get("#ssnewpassword").type("Test1337");
        cy.wait(6000);
        cy.get("#ssnewpasswordrepeat").type("Test1337");
        cy.contains("button", "Request Code").click();
        cy.wait(6000);
        getCode(PSI_Creds.login, PSI_Creds.password, `+371${phoneNumber}`, "mdr:service.authentication.challenge", "Enter this code to change password for your account:").then((code) => {
            cy.get("#sstoken").type(code);
        });
        cy.contains("button", "Change").click();
        cy.contains("div.alert", "Authentication failed. Please double-check your login details.");
        cy.get('@temporaryPassword').then((el) => cy.get("#ssoldpassword").type(el));
        cy.wait(6000);
        cy.get("#ssnewpassword").type("Test1337");
        cy.wait(6000);
        cy.get("#ssnewpasswordrepeat").type("Test1337");
        cy.wait(106000);
        cy.contains("button", "Request Code").click();
        cy.wait(3000);
        getCode(PSI_Creds.login, PSI_Creds.password, `+371${phoneNumber}`, "mdr:service.authentication.challenge", "Enter this code to change password for your account:").then((code) => {
            cy.get("#sstoken").type(code);
        });
        cy.contains("button", "Change").click();
        cy.contains("div.alert", "Authentication failed. Please double-check your login details.").should("not.exist");
    });

    it('TC2', () => {
        const phoneNumber = generateLatvianPhoneNumber();

        cy.visit("https://test-app.emerald24.co.uk/#/register");
        cy.get("#customer_registration_mobile_business").click();
        cy.contains("button", "New user").click();
        cy.get("#select2-country_of_location-container").click();
        cy.get(".select2-search__field").type("371", {delay: 100});
        cy.contains("li", "+371 Latvia").click();
        cy.get("#phone_number_visible").type(phoneNumber)
        cy.get("#privacy_policy_confirmed").click();
        cy.contains("button", "Send SMS code").click();
        cy.wait(1000);
        getCode(PSI_Creds.login, PSI_Creds.password, `+371${phoneNumber}`, "mdr:service.authentication.challenge", "Create captcha image for").then((code) => {
            cy.get("#dtoken").type(code);
        });
        cy.contains("button", "Confirm").click();
        cy.wait(2000);
        getCode(PSI_Creds.login, PSI_Creds.password, `+371${phoneNumber}`, "dwh:dispatcher.object.payment.update").then((code) => {
            cy.get("#rtoken").type(code);
        });
        cy.contains("button", "Confirm").click();
        cy.get("#email").type(generateRandomEmail());
        cy.contains("button", "Next").click();
        cy.wait(30000);
        getCode(PSI_Creds.login, PSI_Creds.password, `+371${phoneNumber}`, "ext:external.heimdall.integration.send.temporary.token").then((password) => {
            cy.wrap(password).as('temporaryPassword');
            cy.get("#ssoldpassword").type("WrongPassword");
        });
        cy.wait(6000);
        cy.get("#ssnewpassword").type("Test1337");
        cy.wait(6000);
        cy.get("#ssnewpasswordrepeat").type("Test1337");
        cy.contains("button", "Request Code").click();
        cy.wait(6000);
        getCode(PSI_Creds.login, PSI_Creds.password, `+371${phoneNumber}`, "mdr:service.authentication.challenge", "Enter this code to change password for your account:").then((code) => {
            cy.get("#sstoken").type(code);
        });
        cy.contains("button", "Change").click();
        cy.contains("div.alert", "Authentication failed. Please double-check your login details.");
        cy.get('@temporaryPassword').then((el) => cy.get("#ssoldpassword").type(el));
        cy.wait(6000);
        cy.get("#ssnewpassword").type("Test1337");
        cy.wait(6000);
        cy.get("#ssnewpasswordrepeat").type("Test1337");
        cy.wait(106000);
        cy.contains("button", "Request Code").click();
        cy.wait(3000);
        getCode(PSI_Creds.login, PSI_Creds.password, `+371${phoneNumber}`, "mdr:service.authentication.challenge", "Enter this code to change password for your account:").then((code) => {
            cy.get("#sstoken").type(code);
        });
        cy.contains("button", "Change").click();
        cy.contains("div.alert", "Authentication failed. Please double-check your login details.").should("not.exist");
    });
});