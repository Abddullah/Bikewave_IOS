import { getItem } from './assynsStorage';

const translations = {
  en: {
    // custom error
    'login-301': 'Incorrect login.',
    'login-403': 'Incorrect credentials.',
    'forgot-404': 'User not found.',
    'register-500': 'Email must be unique',
    'Failed to login': 'Failed to login',
    'Failed to register': 'Failed to register.',
    'Failed to Send link': 'Failed to Send link.',
    'Unexpected error': 'Unexpected error',
    'Failed to fetch bicycles': 'Failed to fetch bicycles',
    'Failed to fetch favorites': 'Failed to fetch favorites',
    'Failed to update favorites': 'Failed to update favorites',
    'Failed to fetch bicycle': 'Failed to fetch bicycle',
    'Failed to fetch approved info': 'Failed to fetch approved info',
    'Failed to fetch user info': 'Failed to fetch user info',
    'Failed to update user details': 'Failed to update user details',
    'Failed to delete user': 'Failed to delete user',
    'Authentication token missing.': 'Authentication token missing.',
    'Photo is required.': 'Photo is required.',
    'Failed to add bicycle': 'Failed to add bicycle',
    'Failed to upload images': 'Failed to upload images',
    'Failed to create account': 'Failed to create account',
    'Failed to create account session': 'Failed to create account session',
    'Failed to reset password': 'Failed to reset password',
    'Failed to fetch bicycles near city': 'Failed to fetch bicycles near city',
    'Failed to update bicycle': 'Failed to update bicycle',
    'Faild To Upload more then 2 Bikes': "Only premium accounts can create more than two bikes.",
    'Failed to book bicycle': 'Failed to book bicycle',
    'Failed to set invoice address': 'Failed to set invoice address',
  },
  sp: {
    // custom error
    'login-301': 'Inicio de sesión incorrecto.',
    'login-403': 'Credenciales incorrectas.',
    'forgot-404': 'Usuario no encontrado.',
    'register-500': 'El correo electrónico debe ser único',
    'Failed to login': 'Error al iniciar sesión.',
    'Failed to register': 'Error al registrarse.',
    'Failed to Send link': 'Error al enviar el enlace.',
    'Unexpected error': 'Error inesperado',
    'Failed to fetch bicycles': 'No se pudieron recuperar las bicicletas',
    'Failed to fetch favorites': 'Error al obtener los favoritos',
    'Failed to update favorites': 'Error al actualizar los favoritos',
    'Failed to fetch bicycle': 'Error al obtener la bicicleta',
    'Failed to fetch approved info': 'Error al obtener la información aprobada',
    'Failed to fetch user info': 'Error al obtener información del usuario',
    'Failed to update user details':
      'Error al actualizar los datos del usuario',
    'Failed to delete user': 'Error al eliminar el usuario',
    'Authentication token missing.': 'Falta el token de autenticación.',
    'Photo is required.': 'Se requiere una foto.',
    'Failed to add bicycle': 'Error al agregar la bicicleta.',
    'Failed to upload images': 'Error al cargar las imágenes',
    'Failed to create account': 'No se pudo crear la cuenta',
    'Failed to create account session':
      'No se pudo crear la sesión de la cuenta.',
    'Failed to reset password': 'Error al restablecer la contraseña',
    'Failed to fetch bicycles near city':
      'Error al obtener las bicicletas cerca de la ciudad',
    'Failed to update bicycle': 'No se pudo actualizar la bicicleta',
    'Faild To Upload more then 2 Bikes': "Solo las cuentas premium pueden crear mas de dos bicicletas",
    'Failed to book bicycle': 'Error al reservar la bicicleta',
    'Failed to set invoice address': 'Error al establecer la dirección de facturación',
  },
};

// Function to get translated error message
const getErrorMessage = async errorCode => {
  const languageCode = await getItem('languagecode', 'en');
  const errorMessage = translations[languageCode]?.[errorCode];
  return (
    errorMessage ||
    `${translations[languageCode]?.['Unexpected error']}:${errorCode}`
  );
};

export default getErrorMessage;
