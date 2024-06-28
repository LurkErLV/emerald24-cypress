import PSI_Creds from "../../fixtures/PSI_Credentials.json";

describe('GBP FPS Payment limit', () => {
    it('Проверка лимитов для GBP FPS ClearBank платежей', () => {
        cy.visit("https://test-psi.emerald24.co.uk/psi/common/properties/property?mode=&id=17157790462421&name=terms", {
            auth: {
                username: PSI_Creds.login,
                password: PSI_Creds.password,
            },
        });
        cy.contains("div#divId_10_2", "1000000");
    });
});