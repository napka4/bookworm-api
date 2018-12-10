import nodemailer from 'nodemailer';

const from = '"Bookworm" <info@bookworm.com';

function setup() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
}

export function sendConfirmationEmail(user) {
    const transport = setup();
    const email = {
        from,
        to: user.email,
        subject: "Bienvenue sur BiblioWeb",
        text: `
        Bienvenue sur cette belle application de gestion de vos listes de lecture !
        Veuillez vérifier votre adresse email pour bénéficier de toutes les fonctionnalités de notre site web !
        ${user.generateConfirmationUrl()}
        `
    }
    transport.sendMail(email);
}

export function sendResetPasswordEmail(user) {
    const transport = setup();
    const email = {
        from,
        to: user.email,
        subject: "Rinitialisation du mot de passe",
        text: `
        Pour réinitialiser votre mot de passe, veuillez suivre les instructions dans le lien ci dessus:
        ${user.generateResetPasswordLink()}
        `
    }
    transport.sendMail(email);
}