import {getCode} from "../../support/utils";
import PSI_Creds from "../../fixtures/PSI_Credentials.json";

describe("Login", () => {
    it('Посетить страницу авторизации', () => {
        cy.visit("https://test-app.emerald24.co.uk/#/login");
    });

    it("TC1 - Логин через SMS без введения номера телефона и пароля", () => {
        cy.visit("https://test-app.emerald24.co.uk/#/login");
        cy.get("#srp-then-etan_entrance_sms").click();
        cy.contains('button', 'Log in with SMS').should("be.disabled");
    });

    it('TC2 - Логин через SMS используя только номер телефона', () => {
        cy.visit("https://test-app.emerald24.co.uk/#/login");
        cy.get("#srp-then-etan_entrance_sms").click();
        cy.get("#lusername").type("+4522123311");
        cy.contains('button', 'Log in with SMS').should("be.disabled");
    });

    it('TC3 - Логин через SMS используя только невалидный номер телефона', () => {
        cy.visit("https://test-app.emerald24.co.uk/#/login");
        cy.get("#srp-then-etan_entrance_sms").click();
        cy.get("#lusername").type("+22123123123123");
        cy.contains('button', 'Log in with SMS').should("be.disabled");
    });

    it('TC4 - Логин через SMS используя только пароль', () => {
        cy.visit("https://test-app.emerald24.co.uk/#/login");
        cy.get("#srp-then-etan_entrance_sms").click();
        cy.get("#lpassword").type("!rulQaSe324!m!23!!");
        cy.contains('button', 'Log in with SMS').should("be.disabled");
    });

    it('TC5 - Логин через SMS используя не верный пароль от аккаунта', () => {
        cy.visit("https://test-app.emerald24.co.uk/#/login");
        cy.get("#srp-then-etan_entrance_sms").click();
        cy.get("#lusername").type("+4522123311");
        cy.get("#lpassword").type("InCoRrEcTPasSwOrD");
        cy.contains('button', 'Log in with SMS').click();
        cy.contains('div.alert', 'Authentication failed. Please double-check your login details.');
    });

    it('TC6 - Логин через SMS используя правильные данные от аккаунта', () => {
        cy.visit("https://test-app.emerald24.co.uk/#/login");
        cy.get("#srp-then-etan_entrance_sms").click();
        cy.get("#lusername").type("+4522123311");
        cy.get("#lpassword").type("!rulQaSe324!m!23!!");
        cy.contains('button', 'Log in with SMS').click();
        cy.contains('div', 'Code has been sent to you');
    });

    it('TC7 - Подтверждение авторизации через sms не вводя SMS код', () => {
        cy.visit("https://test-app.emerald24.co.uk/#/login");
        cy.get("#srp-then-etan_entrance_sms").click();
        cy.get("#lusername").type("+4522123311");
        cy.get("#lpassword").type("!rulQaSe324!m!23!!");
        cy.contains('button', 'Log in with SMS').click();
        cy.contains('div', 'Code has been sent to you')
        cy.contains('button', 'Confirm').should("be.disabled");
    });

    it('TC8 - Подтверждение авторизации через sms вводя не верный SMS код', () => {
        cy.visit("https://test-app.emerald24.co.uk/#/login");
        cy.get("#srp-then-etan_entrance_sms").click();
        cy.get("#lusername").type("+4522123311");
        cy.get("#lpassword").type("!rulQaSe324!m!23!!");
        cy.contains('button', 'Log in with SMS').click();
        cy.contains('div', 'Code has been sent to you');
        cy.get("#ltoken").type("000000");
        cy.contains('button', 'Confirm').click();
        cy.contains('div.alert', 'Authentication failed. Please double-check your login details.');
    });

    it('TC9 - Подтверждение авторизации через sms вводя верный SMS код', () => {
        cy.visit("https://test-app.emerald24.co.uk/#/login");
        cy.get("#srp-then-etan_entrance_sms").click();
        cy.get("#lusername").type("+4522123311");
        cy.get("#lpassword").type("!rulQaSe324!m!23!!");
        cy.contains('button', 'Log in with SMS').click();
        cy.contains('div', 'Code has been sent to you');
        getCode(PSI_Creds.login, PSI_Creds.password, "+4522123311", "mdr:service.authentication.challenge", "Your Emerald24 verification code for login:").then((smsCode) => {
            cy.get("#ltoken").type(smsCode);
        });
        cy.contains('button', 'Confirm').click();
        cy.contains('span.greeting', 'Hello');
    });
});
