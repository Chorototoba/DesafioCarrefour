describe('CRUD Usuarios - Serverest', () => {
  const uniqueEmail = () =>
    `crud-${Date.now()}-${Math.random().toString(16).slice(2)}@teste.com`;

  const createUser = () => {
    const user = {
      nome:  'Teste Carrefour',
      email: uniqueEmail(),
      password: '123456',
      administrador: 'true'
    };

    return cy.apiServerest('POST', '/usuarios', user).then((resp) => {
      expect(resp.status).to.eq(201);
      expect(resp.body).to.have.property('_id');
      return { id: resp.body._id, data: user };
    });
  };

  beforeEach(() => {
    cy.loginServerest();
  });

  it('Lista usuarios', () => {
    cy.apiServerest('GET', '/usuarios').then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('usuarios');
      expect(resp.body.usuarios).to.be.an('array');
    });
  });

  it('Cria usuario', () => {
    createUser().then(({ id }) => {
      expect(id).to.exist;
    });
  });

  it('Consulta usuario por id', () => {
    createUser().then(({ id, data }) => {
      cy.apiServerest('GET', `/usuarios/${id}`).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.include({
          nome: data.nome,
          email: data.email,
          administrador: data.administrador
        });
      });
    });
  });

  it('Atualiza usuario', () => {
    createUser().then(({ id }) => {
      const updated = {
        nome: 'Teste Carrefour',
        email: uniqueEmail(),
        password: '654321',
        administrador: 'true'
      };

      cy.apiServerest('PUT', `/usuarios/${id}`, updated)
        .then((resp) => {
          expect(resp.status).to.eq(200);
          expect(resp.body.message).to.match(/sucesso/i);
        })
        .then(() => cy.apiServerest('GET', `/usuarios/${id}`))
        .then((resp) => {
          expect(resp.status).to.eq(200);
          expect(resp.body.nome).to.eq(updated.nome);
          expect(resp.body.email).to.eq(updated.email);
        });
    });
  });

  it('Exclui usuario', () => {
    createUser().then(({ id }) => {
      cy.apiServerest('DELETE', `/usuarios/${id}`)
        .then((resp) => {
          expect(resp.status).to.eq(200);
          expect(resp.body.message).to.match(/exclu/i);
        })
        .then(() => cy.apiServerest('GET', `/usuarios/${id}`))
        .then((resp) => {
          expect(resp.status).to.eq(400);
        });
    });
  });

});
