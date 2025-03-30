export const environment = {
    production: false,
    backendUrl: "http://127.0.0.1:4200",
    firebase: {
        apiKey: "AIzaSyDizEz7mCnAJucPd5aXeyV1Uwmp69Q7O2s",
        authDomain: "podcast-therapy-api.firebaseapp.com",
        projectId: "podcast-therapy-api",
        storageBucket: "podcast-therapy-api.appspot.com",
        messagingSenderId: "1033825996310",
        appId: "1:1033825996310:web:272d385ea371f7e8ed6f37",
        measurementId: "G-4LX67WGT46"
    },
    // Square payment credentials (sandbox credentials)
    squareApplicationId: 'sandbox-sq0idb-YOUR-APP-ID-HERE', 
    squareLocationId: 'YOUR-LOCATION-ID-HERE',
    squareAccessToken: 'YOUR-ACCESS-TOKEN-HERE',
    
    // Keeping Stripe keys for reference or fallback
    stripe: {
        publicKey: "pk_test_51R1EjhHlVCzYp0CQTMYwjC6orFITDmVbsw4XD3Y3tmonRFYbs6JypsqY4qAq1TiYxB1JGW5fyTcMEBvDc7DdxUW200WlOg9SMo"
    }
  };
