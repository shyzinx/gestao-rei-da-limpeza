const dns = require("dns").promises;

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                valido: false,
                mensagem: "Método não permitido."
            })
        };
    }

    try {
        const { email } = JSON.parse(event.body || "{}");

        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    valido: false,
                    mensagem: "E-mail não informado."
                })
            };
        }

        const partes = email.trim().toLowerCase().split("@");

        if (partes.length !== 2) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    valido: false,
                    mensagem: "Formato de e-mail inválido."
                })
            };
        }

        const dominio = partes[1];

        const registrosMX = await dns.resolveMx(dominio);

        if (!registrosMX || registrosMX.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    valido: false,
                    mensagem: "O domínio informado não possui configuração de e-mail."
                })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                valido: true,
                mensagem: "Domínio de e-mail válido."
            })
        };

    } catch (erro) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                valido: false,
                mensagem: "O domínio informado não existe ou não possui configuração de e-mail."
            })
        };
    }
};