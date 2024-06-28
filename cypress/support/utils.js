/**
 * @param {string} login
 * @param {string} password
 * @param {string} phoneNumber
 * @param {string} action
 * @param {string} [match]
 * @return {Cypress.Chainable<string>}
 * @description "Login and password from PSI"
 */

export const getCode = (login, password, phoneNumber, action, match) => {
    let logId = null;

    // Convert login and password to base64 for Basic authentication
    const token = Buffer.from(`${login}:${password}`).toString("base64");

    const date = new Date();
    const formattedDate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;

    // Request audit message list
    return cy.request({
        method: "POST",
        url: `https://test-psi.emerald24.co.uk/psi/common/audit/auditMessageList?from=${formattedDate}%2000:00:00`,
        headers: {
            authorization: `Basic ${token}`,
            "content-type": "application/x-www-form-urlencoded",
        },
        body: `refilter=yes&transformation=yes&current=1&from=${formattedDate}+00%3A00%3A00&to=&action_module=&advS_id=&advS_status=&advS_action=&advS_workstation=&advS_contextid=&advS_userid=${action.startsWith("dwh") ? "SYSTEM" : ""}&advS_xpath=&advS_xpathvalue=${phoneNumber}&selection=`,
    }).then((response) => {
        const auditMessageList = response.body;
        // Find the index of the action in the audit message list
        const challengeIndex = auditMessageList.indexOf(action);

        if (challengeIndex !== -1) {
            // Extract substring before the challenge action
            const beforeChallenge = auditMessageList.substring(0, challengeIndex);

            // Regular expression to find the log ID
            const regex = /openAuditMsg\('(\d+)'\)/g;
            let match;
            let lastMatch = null;

            // Find the last match of the regex in the substring
            while ((match = regex.exec(beforeChallenge)) !== null) {
                lastMatch = match[1];
            }

            logId = lastMatch;
        }

        // Request detailed audit message using the log ID
        return cy.request({
            method: "GET",
            url: `https://test-psi.emerald24.co.uk/psi/common/audit/auditMessage?amid=${logId}`,
            headers: {
                authorization: `Basic ${token}`,
            },
        }).then((response) => {
            const auditMessage = response.body;

            // Handle different matches based on action and match type
            if (action === "mdr:service.authentication.challenge") {
                if (match === "Your Emerald24 verification code for login:") {
                    // Match SMS code pattern
                    const smsCodeMatch = auditMessage.match(/Your Emerald24 verification code for login:(\d{6})/);

                    if (!smsCodeMatch) {
                        throw new Error("SMS code not found!");
                    }

                    return smsCodeMatch[1]; // Return the SMS code
                } else if (match === "Enter this code to change password for your account:") {
                    // Match SMS code pattern
                    const smsCodeMatch = auditMessage.match(/Enter this code to change password for your account: (\d{6})/);

                    if (!smsCodeMatch) {
                        throw new Error("SMS code not found!");
                    }

                    return smsCodeMatch[1]; // Return the SMS code
                } else if (match === "Create captcha image for") {
                    // Match captcha code pattern
                    const captchaCodeMatch = auditMessage.match(/Create captcha image for \[(\w+)\]/);

                    if (!captchaCodeMatch) {
                        throw new Error("Captcha code not found!");
                    }

                    return captchaCodeMatch[1]; // Return the captcha code
                }
            } else if (action === "dwh:dispatcher.object.payment.update") {
                // Match the code pattern in plain text parameter
                const codeMatch = auditMessage.match(/parameter line="ratify" id="code"&gt;(\d{6})/);

                if (!codeMatch) {
                    throw new Error("Code not found!");
                }

                return codeMatch[1]; // Return the code
            } else if (action === "ext:external.heimdall.integration.send.temporary.token") {
                const passwordMatch = auditMessage.match(/"([^"]+)" with out codes/);

                if (!passwordMatch) {
                    throw new Error("Temporary password not found!");
                }

                return passwordMatch[1]; // Return the temporary password
            } else {
                throw new Error("Action not found!");
            }
        });
    });
};

export function generateLatvianPhoneNumber() {
    const areaCode = getRandomAreaCode(); // Randomly select an area code
    const subscriberNumber = getRandomSubscriberNumber(); // Generate a random 6-digit subscriber number

    // Concatenate all parts to form the complete Latvian phone number
    return `${areaCode}${subscriberNumber}`;
}

function getRandomAreaCode() {
    const areaCodes = ['2', '3', '4', '6', '9'];
    const randomIndex = Math.floor(Math.random() * areaCodes.length);
    return areaCodes[randomIndex];
}

function getRandomSubscriberNumber() {
    const min = 1000000;
    const max = 9999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
}

export function generateRandomEmail() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 10;
    let emailPrefix = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        emailPrefix += characters[randomIndex];
    }

    return `${emailPrefix}@example.com`;
}