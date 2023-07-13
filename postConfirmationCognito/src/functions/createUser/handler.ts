import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
const dynamodb = new DynamoDBClient({ region: "us-east-1" });

enum STATUS {
  ALLOWED = "ALLOWED",
  DENIED = "DENIED",
}

// const createTable = async () => {
//   const params = {
//     TableName: 'NOMBRE_DE_LA_TABLA',
//     KeySchema: [
//       { AttributeName: 'email', KeyType: 'HASH' } // Define los atributos clave de tu tabla
//     ],
//     AttributeDefinitions: [
//       { AttributeName: 'email', AttributeType: 'S' } // Define los atributos de tu tabla
//     ],
//     ProvisionedThroughput: {
//       ReadCapacityUnits: 5, // Define la capacidad de lectura
//       WriteCapacityUnits: 5 // Define la capacidad de escritura
//     }
//   };

//   try {
//     const command = new CreateTableCommand(params);
//     const response = await dynamodbClient.send(command);
//     console.log('Tabla creada:', response.TableDescription);
//   } catch (error) {
//     console.error('Error al crear la tabla:', error);
//   }
// };

// createTable();
/*
const getEmailItem = async (email) => {
  const params = {
    TableName: 'NOMBRE_DE_LA_TABLA',
    Key: {
      email: { S: email } // Define el valor del campo 'email' que deseas consultar
    }
  };

  try {
    const command = new GetItemCommand(params);
    const response = await dynamodbClient.send(command);
    console.log('Item consultado:', response.Item);
  } catch (error) {
    console.error('Error al consultar el item:', error);
  }
};

getEmailItem('usuario@example.com'); // Reemplaza con el valor del campo 'email' que deseas consultar
*/

/*
const updateTableItem = async (email, newName) => {
  const params = {
    TableName: 'NOMBRE_DE_LA_TABLA',
    Key: {
      email: { S: email } // Define el valor del campo 'email' del item que deseas modificar
    },
    UpdateExpression: 'SET #name = :newName', // Define la expresión de actualización
    ExpressionAttributeNames: {
      '#name': 'name' // Define el nombre del atributo a actualizar
    },
    ExpressionAttributeValues: {
      ':newName': { S: newName } // Define el nuevo valor para el atributo a actualizar
    }
  };

  try {
    const command = new UpdateItemCommand(params);
    const response = await dynamodbClient.send(command);
    console.log('Item modificado:', response.Attributes);
  } catch (error) {
    console.error('Error al modificar el item:', error);
  }
};

updateTableItem('usuario@example.com', 'Nuevo Nombre'); // Reemplaza con el valor del campo 'email' y el nuevo nombre que deseas actualizar
*/
const createUserHandler = async (event) => {
  // Logica para la creacion de usuarios Clientes
  // veriicar la TBala User si no exite una tbala con ese correo ya registrado
  // si existe verificar por donde se esta registrando si por cognito o google
  // si es por google se llena el ownerGoogle si es por COgnito se llena el owner
  // si no existe la tabla crearla y ver por donde se esta logeando si por google o por cognito
  console.log("EVENT: ", event);
  const { sub, email, name } = event.request.userAttributes;
  const { triggerSource } = event;
  if (!(triggerSource === "PostConfirmation_ConfirmSignUp"))
    throw new Error("Trigger No aceptado en esta funcion");

  if (
    !(event.request.userAttributes["custom:notificationToken"] === "customer")
  ) {
    throw new Error(
      `Usuario ${event.request.userAttributes["custom:notificationToken"]} no aceptado.`
    );
  }
  // parametros de items table
  const info = {
    id: { S: uuidv4() },
    name: { S: name },
    email: { S: email },
    status: { S: STATUS.ALLOWED },
    notificationToken: {
      S: event.request.userAttributes["custom:notificationToken"],
    },
    previousBalance: { N: "0" },
    owner: { S: sub },
  };

  // formato de Put Item
  const params = {
    TableName: "User-ki5pvxbboveshfzsai4wd4dsmq-dev",
    Item: info,
  };

  try {
    // Put al dynamodb tabla especifica
    const result = await dynamodb.send(new PutItemCommand(params));
    console.log(result);
    return event;
  } catch (error) {
    throw new Error(error);
  }
};

export { createUserHandler };
