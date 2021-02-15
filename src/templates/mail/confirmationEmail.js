module.exports = (params) => {
    const index = (`
        <html>
        <head>
            <style>
                body {
                    padding: 0;
                    margin: 0;
                    font-size: 100%;
                    font-family: sans-serif;
                    background-color: #f3f3f3;
                }

                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .card {
                    width: 80vw;
                    background-color: #fff;
                }

                .header-bg {
                    background-color: #c94040;
                    width: 100%;
                    height: 115px;
                }

                .content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .content-title {
                    font-size: 1.5em;
                }
                .content-text {
                    font-size: 1em;
                    width: 50vw;
                    text-align: justify;
                }

                .btn {
                    background-color: #c94040;
                    text-decoration: none;
                    color: #f3f3f3;
                    padding: 10px 25px;
                    font-weight: bold;
                    border-radius: 4px;
                    margin: 30px auto;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div class="header-bg"></div>
                    <div class="content">
                        <h3 class="content-title">
                            Confirmação de Email
                          </h3>
                          <p class="content-text">
                            Hey, <strong>${params.to.name}</strong>! Você está quase lá para usar o Likearns,
                            você só precisa ativar sua conta e para isso, basta clicar no botão abaixo e voltar para o nosso site.
                          </p>
                          <a href="${process.env.REACT_APP_URL}/minha-conta/ativar?tk=${params.token}" class="btn">Verificar conta</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
    return index;
}