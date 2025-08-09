// Translation keys that need to be added to your translation files
// Add these to your i18n translation files (en.json, sp.json, etc.)

export const authTranslationKeys = {
  // English translations
  en: {
    login_required: "Login Required",
    login_required_message: "To {{feature}}, please log in to your account or create a new one.",
    continue_browsing: "Continue Browsing",
    add_to_favorites: "add to favorites",
    chat_with_owner: "chat with bike owner",
    make_a_reservation: "make a reservation",
    list_your_bike: "list your bike",
    your_profile: "access your profile",
    login: "Login",
    register: "Register",
  },
  
  // Spanish translations
  sp: {
    login_required: "Iniciar Sesión Requerido",
    login_required_message: "Para {{feature}}, por favor inicia sesión en tu cuenta o crea una nueva.",
    continue_browsing: "Continuar Navegando",
    add_to_favorites: "agregar a favoritos",
    chat_with_owner: "chatear con el propietario",
    make_a_reservation: "hacer una reserva",
    list_your_bike: "publicar tu bicicleta",
    your_profile: "acceder a tu perfil",
    login: "Iniciar Sesión",
    register: "Registrarse",
  }
};

// Instructions:
// 1. Add these translation keys to your existing translation files
// 2. Make sure to include the interpolation for {{feature}} in the login_required_message
// 3. Test that all translations work correctly with the AuthPrompt component 