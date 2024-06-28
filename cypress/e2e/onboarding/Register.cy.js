describe('Register Business account', () => {
    it('TC1 - Регистрация без введения номера телефона и без подтверждения политики', () => {
        cy.visit("https://test-app.emerald24.co.uk/#/register");
        cy.get("#customer_registration_mobile_business").click();
        cy.contains('span', 'New user').click();

        cy.get('.action-submit').click();
        cy.contains('div', "Mandatory field Mobile Number is missing");
        cy.contains('div', "Mandatory field is missing");
    });

    it('TC2 - Регистрация без введения номера телефона', () => {
        cy.visit("https://test-app.emerald24.co.uk/#/register");
        cy.get("#customer_registration_mobile_business").click();
        cy.contains('span', 'New user').click();

        cy.get("#privacy_policy_confirmed").click();
        cy.get('.action-submit').click();
        cy.contains('div', "Mandatory field Mobile Number is missing");
    });

    it('TC3 - Регистрация вводя некорректный номер телефона без подтверждения политики', () => {
        cy.visit("https://test-app.emerald24.co.uk/#/register");
        cy.get("#customer_registration_mobile_business").click();
        cy.contains('span', 'New user').click();

        cy.get("#phone_number_visible").type("+44123123123123");
        cy.get('.action-submit').click();
        cy.contains('div', "Mandatory field is missing");
    });
});