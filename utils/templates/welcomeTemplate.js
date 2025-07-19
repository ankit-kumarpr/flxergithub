const welcomeTemplate = (name, customID, email, password) => {
  return `
    <h2>Welcome to Flexr, ${name}!</h2>
    <p>Thanks for registering. Here are your details:</p>
    <ul>
      <li><strong>Custom ID:</strong> ${customID}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Password:</strong> ${password}</li>
    </ul>
    <p>Please keep this information safe.</p>
    <p>Regards,<br>Flexr Team</p>
  `;
};

module.exports = welcomeTemplate;
