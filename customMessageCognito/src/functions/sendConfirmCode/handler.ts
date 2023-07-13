const sendConfirmCodeHandler = async (event): Promise<any> => {
  // const { email } = event.request.userAttributes;
  // codeParameter: '{####}',
  //   linkParameter: '{##Click Here##}',
  //   usernameParameter: null
  // const temporaryPassword =
  //   event.request.userAttributes["custom:temporaryPassword"];
  console.log(event);
  // event.response.emailSubject = "Confirmacion de Registro ByBus C.A.";
  // event.response.emailMessage = `
  //           Gracias por registrarte en Bybus CA.
  //           Tu contraseña es: ${temporaryPassword}
  // `;
  return event;
};

export { sendConfirmCodeHandler };
