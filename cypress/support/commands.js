// Commands to authenticate on Serverest and issue authorized API requests
Cypress.Commands.add('loginServerest', () => {
  return cy.request({
    method: 'POST',
    url: 'https://serverest.dev/login',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: {
      email: 'admin@carrefour.com.br',
      password: 'QATeste'
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    const token = response.body.authorization;

    Cypress.env('tokenServerest', token);

    return token;
  });
});

Cypress.Commands.add('api', (options) => {
  const { method, url, body } = options;
  const log = Cypress.log({
    name: 'api',
    displayName: 'API',
    message: `${method} ${url}`,
    autoEnd: false,
    consoleProps: () => ({
      method,
      url,
      requestBody: body
    })
  });

  return cy.request({
    ...options,
    method,
    url,
    log: false,
    failOnStatusCode: false
  }).then((resp) => {
    log.set({
      consoleProps: () => ({
        method,
        url,
        requestBody: body,
        status: resp.status,
        responseBody: resp.body
      })
    });
    log.end();
    return resp;
  });
});

Cypress.Commands.add('apiServerest', (method, endpoint, body = null) => {
  const url = `https://serverest.dev${endpoint}`;

  return cy.api({
    method,
    url,
    headers: {
      Authorization: Cypress.env('tokenServerest')
    },
    body
  });
});
